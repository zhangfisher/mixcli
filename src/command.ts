import { Command, Option } from "commander";
import prompts, { PromptObject } from "prompts";
import { MixOption, type MixedOptionParams } from "./option";
import { addBuiltInOptions, isDisablePrompts, outputDebug } from "./utils";
import type { AsyncFunction } from "flex-tools/types"; 
import path from "node:path";
import fs from "node:fs";



export type IMixCommandHookListener = ({
	args,
	options,
	command,
}: {
	args: any[];
	options: Record<string, any>;
	command: MixCommand;
}) => void | Promise<void>;

export type BeforeMixCommandHookListener = ({
	args,
	options,
	command,
}: {
	args: any[];
	options: Record<string, any>;
	command: MixCommand;
}) => void | Promise<void>;

export type AfterMixCommandHookListener = ({
	value,
	args,
	options,
	command,
}: {
	value: any;
	args: any[];
	options: Record<string, any>;
	command: MixCommand;
}) => void | Promise<void>;

export interface MixActionOptions {
	id: string;
	at: "replace" | "before" | "after" | "preappend" | "append" | number;	
	enhance: boolean;														// 函数签名类型，即采用原始的commander的action函数签名，还是mixcli的action函数签名
}

export interface MixActionRegistry extends Omit<MixActionOptions, "at"> {
	fn: Function;
}

// 原始的Action动作函数
export type MixOriginalAction = (...args: any[]) => any | Promise<void>;

// 增强的Action函数签名
export type MixEnhanceAction = ({
	args,
	options,
	value,
	command,
}: {
	args: any[];
	options: Record<string, any>;
	value: any;
	command: MixCommand;
}) => any | Promise<any>;

// 执行action的返回结果
export const BREAK = Symbol("BREAK_ACTION"); // 中止后续的action执行

export class MixCommand extends Command {
	__MIX_COMMAND__ = true;
	private _beforeHooks   : [ BeforeMixCommandHookListener, boolean ][] = [];
	private _afterHooks    : [ AfterMixCommandHookListener, boolean ][] = [];
	private _customPrompts : PromptObject[] = [];
	private _optionValues  : Record<string, any> = {}; 							// 命令行输入的选项值
	private _actions       : MixActionRegistry[] = []; 							// 允许多个action
	private _enable_prompts: boolean = true; 									// 是否启用交互提示
	constructor(name?: string) {
		super(name);		
		// eslint-disable-next-line no-this-alias
		const self = this
		// if (!this.isRoot) addBuiltInOptions(this); 
		this.hook("preAction", async function (this: any) {
			self._optionValues = self.getOptionValues(this.hookedCommand);			
			// @ts-ignore
			await self.preActionHook.apply(self, arguments);
		});
	} 
	get isRoot() { return this.parent==undefined;	}
	get optionValues(){ return this._optionValues }
	get actions() { return this._actions; }
	get beforeHooks() {	return this._beforeHooks; }
	get afterHooks() {return this._afterHooks;}
	get fullname() {
		let names = [this.name()];
		let parent = this.parent;
		while (parent) {
			if (parent.name() !== "root") {
				names.unshift(parent.name());
			}
			parent = parent.parent;
		}
		return names.join(".");
	}

	/**
	 * 返回根命令
	 */
	root() { 
		// eslint-disable-next-line no-this-alias
		let root:any = this;
		while (root && root.parent != null) {
			root = root.parent as unknown as MixCommand;
		}
		return root;
	}


	action(fn: MixEnhanceAction, options: MixActionOptions): this;
	action(fn: MixOriginalAction): this;
	action(): this {
		const actionFunc = arguments[0];
		if (arguments.length == 1 && typeof actionFunc == "function") {
			// 原始方式
			this._actions.push({
				id: Math.random().toString(36).substring(2),
				enhance: false,
				fn: actionFunc,
			});
		} else if (arguments.length == 2  && typeof actionFunc == "function" && typeof arguments[1] == "object" ) {
			// 增强模式
			const actionFn = arguments[0];
			const actionOpts: MixActionOptions = Object.assign({ at: "append" }, arguments[1]);
			if (actionOpts.at == "replace") this._actions = [];
			const actionItem = {
				id: actionOpts.id || Math.random().toString(36).substring(2),
				enhance: actionOpts.enhance == undefined ? true : actionOpts.enhance,
				fn: actionFn,
			} as const;
			if (typeof actionOpts.at == "number") {
				this._actions.splice(Number(actionOpts.at), 0, actionItem);
			} else if (["append", "before"].includes(actionOpts.at)) {
				this._actions.push(actionItem);
			} else if (["preappend", "after"].includes(actionOpts.at)) {
				this._actions.splice(0, 0, actionItem);
			} else {
				this._actions.push(actionItem);
			}
		} else {
			console.log("[mixcli] action params error");
		}
		return super.action(this.getWrapperedAction());
	}

	/**
	 * 读取命令配置值，包括父命令提供的配置选项
	 * @param command
	 */
	private getOptionValues(command: MixCommand) {
		const opts = {};
		// eslint-disable-next-line no-this-alias
		let parent: any = command;
		while (parent) {
			Object.assign(opts, (parent as MixCommand).optionValues);
			parent = parent.parent;
		}
		return opts;
	}
	/**
	 * 本函数在运行时子类进行action生成该命令的action
	 */
	private getWrapperedAction() {
		return this.wrapperWorkDirsAction(this.wrapperChainActions());
	}

	/**
	 * 向上查找所有祖先命令
	 */
	private getAncestorCommands(): MixCommand[] {
		let cmds: MixCommand[] = [];
		// eslint-disable-next-line no-this-alias
		let cmd: MixCommand | null = this;
		while (cmd) {
			cmd = cmd.parent as unknown as MixCommand;
			if (cmd) {
				cmds.push(cmd);
			}
		}
		return cmds;
	}
	/***
	 * 将所有actions包装成一个链式调用的函数
	 */
	private wrapperChainActions() {
		// eslint-disable-next-line no-this-alias
		const self = this;
		return async function (this: any) {
			const args = Array.from(arguments); // 原始输入的参数
			let preValue: any; // 保存上一个action的返回值
			//解析参数, 0-1个参数为options,最后一个参数为command
			let actionOpts: Record<string, any> = {},
				actionArgs: any[] = [],
				cmd: any;
			if (args.length >= 2) {
				cmd = args[args.length - 1]; // 最后一个command
				actionOpts = args[args.length - 2];
				actionArgs = args.slice(0, args.length - 2);
			}
			await self.executeBeforeHooks({ args: actionArgs, options: actionOpts, command: cmd });
			try {
				for (let action of self._actions) {
					try {
						if (action.enhance) {
							// 增强模式
							outputDebug("执行<{}>: args={}, options={}", () => [
								self.name(),
								actionArgs,
								actionOpts,
							]);
							preValue = await action.fn.call(this, {
								command: cmd,
								value: preValue,
								args: actionArgs,
								options: actionOpts,
							});
						} else {
							// 原始模式
							preValue = await action.fn.apply(this, args);
						}
						if (preValue === BREAK) break;
					} catch (e) {
						outputDebug("命令{}的Action({})执行出错:{}", [self.name, action.id, e]);
						throw e;
					}
				}
			} finally {
				await self.executeAfterHooks({
					value: preValue,
					args: actionArgs,
					options: actionOpts,
					command: cmd,
				});
			}
		};
	}
	/**
	 * 当传入--work-dirs时用来处理工作目录
	 */
	private wrapperWorkDirsAction(fn: AsyncFunction) {
		// eslint-disable-next-line no-this-alias
		const self = this;
		return async function (this: any) {
			let workDirs = self._optionValues.workDirs;
			// 未指定工作目录参数
			if (!workDirs) {
				return await fn.apply(this, Array.from(arguments));
			}
			if (!Array.isArray(workDirs)) workDirs = workDirs.split(",");
			workDirs = workDirs.reduce((dirs: any[], dir: string) => {
				if (typeof dir == "string") dirs.push(...dir.split(","));
				return dirs;
			}, []);
			for (let workDir of workDirs) {
				const cwd = process.cwd();
				try {
					if (!path.isAbsolute(workDir)) workDir = path.join(cwd, workDir);
					if (fs.existsSync(workDir) && fs.statSync(workDir).isDirectory()) {
						outputDebug("切换到工作目录:{}", workDir);
						process.chdir(workDir); // 切换
						await fn.apply(this, Array.from(arguments));
					} else {
						outputDebug("无效的工作目录:{}", workDir);
					} 
				} finally {
					process.chdir(cwd);
				}
			}
		};
	}
	getOption(name: string): MixOption {
		return this.options.find((option) => option.name() == name) as unknown as MixOption;
	}
	/**
	 * 添加一个Before钩子
	 * @param listener
	 * @param scope     =false时代表只在本命令执行，=true时代表在本命令及其子命令执行
	 * @returns
	 */
	before(listener: BeforeMixCommandHookListener, scope: boolean = true) {
		this._beforeHooks.push([listener, scope]);
		return this;
	}
	private async executeBeforeHooks(args: any) {
		const hooks: [BeforeMixCommandHookListener, boolean, MixCommand][] = this.beforeHooks.map(
			([hook, scope]) => [hook, scope, this]
		);
		this.getAncestorCommands().forEach((cmd: MixCommand) => {
			hooks.unshift(
				...cmd.beforeHooks.map(([hook, scope]) => {
					return [hook, scope, cmd] as [BeforeMixCommandHookListener, boolean, MixCommand];
				})
			);
		});
		for (let [hook, scope, cmd] of hooks) {
			if (!scope) continue;
			await hook.call(cmd, args);
		}
	}
	/**
	 * 添加一个After钩子
	 * @param listener
	 * @param scope     =false时代表只在本命令执行，=true时代表在本命令及其子命令执行
	 * @returns
	 */
	after(listener: AfterMixCommandHookListener, scope: boolean = true) {
		this._afterHooks.push([listener, scope]);
		return this;
	}

	private async executeAfterHooks(args: any) {
		const hooks: [AfterMixCommandHookListener, boolean, MixCommand][] = this.afterHooks.map(
			([hook, scope]) => [hook, scope, this]
		);
		this.getAncestorCommands().forEach((cmd: MixCommand) => {
			hooks.push(
				...cmd.afterHooks.map(([hook, scope]) => {
					return [hook, scope, cmd] as [BeforeMixCommandHookListener, boolean, MixCommand];
				})
			);
		});
		for (let [hook, scope, cmd] of hooks) {
			if (!scope) continue; //=false时不执行
			await hook.call(cmd, args);
		}
	}
	private async preActionHook(thisCommand: Command) {
		if (this.isEnablePrompts()) {
			// 自动生成提示
			const questions: PromptObject[] = [
				...this.generateAutoPrompts(),
				...this._customPrompts,
			];
			// 用户提示
			if (questions.length > 0) {
				const results = await prompts(questions);
				Object.entries(results).forEach(([key, value]) => {
					thisCommand.setOptionValue(key, value);
				});
			}
		}
	}

	private isEnablePrompts() {
		if (isDisablePrompts()) {			
			return false;// 命令行参数禁用了提示，优先级最高
		} else {
			return this._enable_prompts;
		}
	}

	/**
	 * 生成选项自动提示
	 *
	 * @remarks
	 * 要求所有未提供默认值的Option自动生成提示
	 *
	 * - 未提供默认值，并且是必选的参数Option
	 * - 指定了choices但未提供有效值的Option
	 *
	 */
	private generateAutoPrompts(): PromptObject[] {
		const options = this.options as unknown as MixOption[];
		const optionPromports = options
			.filter((option) => !option.hidden && option.__MIX_OPTION__)
			.map((option) => option.getPrompt(this._optionValues[option.name()]))
			.filter((prompt) => prompt) as PromptObject[];
			
		outputDebug("命令<{}>自动生成{}个选项提示:{}", [
			this.name(),
			optionPromports.length,
			optionPromports.map((prompt) => `${prompt.name}(${prompt.type})`).join(","),
		]);
		return optionPromports;
	} 

	// @ts-ignore
	option( flags: string, description: string, options?: MixedOptionParams ):this{ 
 		const option = new MixOption(flags, description, options);
		if (option.required && !this.isEnablePrompts()) option.mandatory = true;		
		return this.addOption(option as unknown as Option)  
	}

	/**
	 * 添加提示
	 *
	 * @remarks
	 *
	 * 添加一些自定义提示 
	 *
	 * @param questions
	 * @returns
	 */
	prompt(questions: PromptObject | PromptObject[]) {
		this._customPrompts.push(...(Array.isArray(questions) ? questions : [questions]));
		return this;
	}

	/**
	 *
	 *  选择命令并执行
	 *
	 * @remorks
	 *
	 * 当命令具有多个子命令时，并且没有提供默认子命令时，提示用户选择一个子命令
	 *
	 */
	async selectCommands() {
		const choices = this.commands.map((command) => ({
			title: `${command.description()}(${command.name()})`,
			value: command.name(),
		}));
		const result = await prompts({
			type   : "select",
			name   : "command",
			message: "请选择命令:",
			choices,
		});
		// 重新解析命令行参数标志,
		const command = this.commands.find((command) => command.name() === result.command);
		await command?.parseAsync([result.command], { from: "user" });
	}
	/**
	 * 禁用/启用所有提示
	 */
	disablePrompts() {
		this._enable_prompts = false;
		return this;
	}
	enablePrompts() {
		this._enable_prompts = true;
		return this;
	}
}
