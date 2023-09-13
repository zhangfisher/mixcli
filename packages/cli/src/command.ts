import { Command,Option } from "commander";
import prompts, { PromptObject }  from  "prompts"
import { MixedOption,type MixedOptionParams } from "./option";  
import { addPresetOptions, isDebug, outputDebug } from "./utils";
import path from "node:path"
import logsets from 'logsets';
import fs from "node:fs"


export type HookCommandListener = (thisCommand:MixedCommand,actionComand:MixedCommand)=>void | Promise<void>

export class MixedCommand extends Command{
    private _beforeHooks:Function[] = []
    private _afterHooks:Function[] = []
    private _customPrompts:PromptObject[] = [] 
    private _optionValues:Record<string,any> = {}   // 命令行输入的选项值
    private _actions:Function[] =[]                 // 允许多个action
    constructor(){
        super()
        const self = this
        addPresetOptions(this)
        this.hook("preAction",async function(this:any){
            self._optionValues = Object.assign({},self.root()._optionValues,this.hookedCommand._optionValues)
            try{
                // @ts-ignore
                await self.preActionHook.apply(self,arguments)
            }catch{}            

        })
        this.hook("postAction",this.postActionHook.bind(this) as any)
    }
    /**
     * 是否是根命令
     */
    get isRoot(){
        return !!!this.parent
    }
    get fullname(){
        let names = [this.name()]
        let parent = this.parent
        while(parent){
            if(parent.name()!=="root"){
                names.unshift(parent.name())
            }            
            parent = parent.parent
        }
        return names.join(".")
    }
    /**
     * 返回根命令
     */
    root(){
        let root:MixedCommand | null | undefined = this
        while(root && root.parent!=null){
            root = root.parent as MixedCommand
        }
        return root
    }
    action(fn: (...args: any[]) => void | Promise<void>): this {        
        const self = this
        return super.action(async function(this:any){
            let workDirs = this._optionValues.workDirs
            if(workDirs){
                await self.handleActionWithWorkDirs(workDirs,async ()=>await fn(...arguments))
            }else{
                await fn(...arguments);        
            }             
        })
    } 
    /**
     * 当传入--work-dirs时用来处理工作目录
     */
    private async handleActionWithWorkDirs(workDirs:any,fn:Function){        
        if(!Array.isArray(workDirs)) workDirs = workDirs.split(",")
        workDirs  = workDirs.reduce((dirs:any[],dir:string)=>{
            if(typeof(dir)=='string') dirs.push(...dir.split(","))
            return dirs
        },[])
        for(let workDir of workDirs){
            const cwd = process.cwd()
            try{
                if(!path.isAbsolute(workDir)) workDir = path.join(cwd,workDir)
                if(fs.existsSync(workDir) && fs.statSync(workDir).isDirectory()){
                    outputDebug("切换到工作目录:{}",workDir)
                    process.chdir(workDir)          // 切换
                    await fn();       
                }else{
                    outputDebug("无效的切换到工作目录:{}",workDir)
                }                
            }catch(e){
                throw e
            }finally{
                process.chdir(cwd)
            } 
        }
    }
    getOption(name:string):MixedOption{
        return this.options.find(option => option.name() == name) as unknown as MixedOption
    }
    before(listener:HookCommandListener){        
        this._beforeHooks.push(listener)
        return this
    } 
    after(listener:HookCommandListener){
        this._afterHooks.push(listener)
        return this
    } 

    private async preActionHook(thisCommand:Command, actionCommand:Command){              
        for(let listener of this._beforeHooks){ 
            await listener(...arguments)
        }
        const noPrompts =this.isDisabledPrompts() 
        if(!noPrompts){
            // 自动生成提示
            const questions:PromptObject[] = [
                ...this.generateAutoPrompts(),
                ...this._customPrompts            
            ]            
            // 用户提示
            if(questions.length > 0) {
                const results = await prompts(questions)
                Object.entries(results).forEach(([key,value])=>{
                    thisCommand.setOptionValue(key,value) 
                })
            }        
        }        
    }


    /**
     * 生成选项自动提示
     * 
     * @remarks
     * FlexCli要求所有未提供默认值的Option自动生成提示
     * 
     * - 未提供默认值，并且是必选的参数Option
     * - 指定了choices但未提供有效值的Option
     * 
     */
    private generateAutoPrompts():PromptObject[]{ 
        const options = this.options as unknown as MixedOption[]
        const optionPromports = options
                    .filter(option=>!option.hidden && (option instanceof MixedOption))
                    .map(option=>option.getPrompt(this._optionValues[option.name()]))
                    .filter(prompt=>prompt) as PromptObject[] 
        outputDebug("[MixedCli] 命令<{}>自动生成{}个选项提示:{}",[this.name(),optionPromports.length,optionPromports.map(prompt=>`${prompt.name}(${prompt.type})`).join(",")])        
        return optionPromports
    }

    private async postActionHook(){
        for(let listener of this._afterHooks){
            await listener(...arguments)
        }
    }

    option(flags: string, description?: string | undefined,defaultValue?:any ): this
    option(flags: string, description?: string | undefined,options?:MixedOptionParams ): this{
        // @ts-ignore
        const option =new MixedOption(...arguments)
        if(option.required && this.isDisabledPrompts()) option.mandatory = true
        return this.addOption(option as unknown as Option)         
    }  

  

    isDisabledPrompts(){
        return this._optionValues.prompts===false
    }    
    /** 
     * 添加提示
     * 
     * @remarks
     * 
     * 添加一些自定义提示
     * 
     * 
     * @param questions
     * @param show              是否显示提示信息，auto表示只有在用户没有提供option的值时才显示提示信息,always表示总是显示提示信息，never表示不显示提示信息
     * @returns 
     */
    prompt(questions:PromptObject | PromptObject[]){        
        this._customPrompts.push(...Array.isArray(questions) ? questions:[questions])
        return this
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
    async selectCommands(){
        const choices = this.commands.map(command=>({
            title:`${command.description()}(${command.name()})`,
            value:command.name()
        }))
        const result = await prompts({
            type:"select",
            name:"command",
            message:"请选择命令:",
            choices
        })
        // 重新解析命令行参数标志,        
        const command = this.commands.find(command=>command.name() === result.command)        
        await command?.parseAsync([result.command],{from:'user'})

    }
}
 