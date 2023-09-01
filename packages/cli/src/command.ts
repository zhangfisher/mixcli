import { Command,Option } from "commander";
import prompts, { PromptObject }  from  "prompts"

export type HookCommandListener = (thisCommand:FlexCommand,actionComand:FlexCommand)=>void | Promise<void>

declare module "commander"{
    // 对原始的Option接口进行扩展
    interface Option{
        _prompt: 'auto' | boolean | PromptObject  | string            // 是否提示用户输入
    }
}
export interface OptionParams{
    default?:boolean | string | string[]
    defaultDescription?:string          // 默认值的描述
    choices?:string[]              // 选项值的可选值
    required: boolean; // A value must be supplied when the option is specified.
    optional: boolean; // A value is optional when the option is specified.
    conflicts?:string | string[]
    env?:string
    argParser:<T>(value: string, previous: T) => T 
    hideHelp?:boolean
    mandatory?: boolean 
    implies?:{[key:string]:any}
    // 是否提示用户输入
    // auto: 根据是否有值来判断是否提示用户输入。如果没有指定默认值且没有指定选项值，则提示用户输入
    // true: 总是提示用户输入
    // false: 不提示用户输入
    prompt: 'auto' | boolean
}

const promptTypeMap:Record<string,string> = {
    boolean:"confirm",
    string:"text",
    number:"number",                        
    array:"list",                        
} 

export const supportedPromptTypes = ["text","password","invisible", "number", "confirm" , "list", "toggle" , "select" , "multiselect" , "autocomplete" , "date" , "autocompleteMultiselect"]

function isValidPromptType(type:any):boolean{
    return supportedPromptTypes.includes(String(type))
}
export class FlexCommand extends Command{
    private _beforeHooks:Function[] = []
    private _afterHooks:Function[] = []
    private _promptQuestions:PromptObject[] = [] 
    private _autoPrompt:boolean = true              // 根据参数自动生成提示    
    private _optionValues:Record<string,any> = {}   // 命令行输入的选项值
    constructor(){
        super()
        const self = this
        this.hook("preAction",function(this:any){
            self._optionValues = this.hookedCommand._optionValues
            // @ts-ignore
            self.preActionHook.apply(self,arguments)
        })
        this.hook("postAction",this.postActionHook.bind(this) as any)
    }
    action(fn: (...args: any[]) => void | Promise<void>): this {
        return super.action(this._action)
    }
    /**
     * 动作
     */
    private _action(...args:any[]){
                
    }
    before(listener:HookCommandListener){        
        this._beforeHooks.push(listener)
        return this
    }
    after(listener:HookCommandListener){
        this._afterHooks.push(listener)
    }

    private async preActionHook(thisCommand:Command, actionCommand:Command){              
        for(let listener of this._beforeHooks){
            await listener(...arguments)
        }
        // 自动生成提示
        const questions:PromptObject[] = [
            ...this.generateAutoPrompts(),
            ...this._promptQuestions            
        ]
        // 用户提示
        if(questions.length > 0){
            const results = await prompts(questions)
            Object.entries(results).forEach(([key,value])=>{
                thisCommand.setOptionValue(key,value)
            })
        }        
    }
    /**
     *  判断是否需要提示用户输入
     * 
     *  @remarks
     *  当用户没有提供有效的选项值时，需要提示用户输入
     * 
     */
    private isNeedPrompt(option:Option):boolean{
 
        if(option._prompt===true) return true
        
        const promptArg = option._prompt
        const inputValue = this._optionValues[option.name()]

        // 显式指定了prompt类型
        if(typeof(promptArg) == 'string' && promptArg != 'auto' && supportedPromptTypes.includes(promptArg)){
            return true
        }


        // 未提供默认值，且没有在控制输入值
        if(!option.defaultValue && !inputValue){
            return true
        }
        // 判断输入是否有效
        if(option.argChoices && option.argChoices.indexOf(inputValue) == -1){
            return true
        }
        return false
    }
    /**
     * 生成自动提示
     * @remarks
     * FlexCli要求所有未提供默认值的Option自动生成提示
     * 
     * - 未提供默认值，并且是必选的参数Option
     * - 指定了choices但未提供有效值的Option
     * 
     */
    private generateAutoPrompts(){
        let prompts:any[] = []
        this.options.forEach(option=>{            
            const inputValue = this._optionValues[option.name()] || option.defaultValue
            const promptArg = option._prompt
            if(promptArg!==false){       // 自动创建提示                
                let promptType:string
                // 推断是否需要提示
                if(this.isNeedPrompt(option) ){
                    // 根据默认值来推断提示类型
                    const datatype:string = Array.isArray(inputValue) ? 'array' : typeof(inputValue)                     
                    promptType = isValidPromptType(promptArg) ? promptArg as string :(
                        datatype in promptTypeMap ? promptTypeMap[datatype] : 'text'
                    )
                    const prompt = {
                        type:promptType,
                        name:option.name(),
                        message:option.description,
                        initial: inputValue
                    } as PromptObject
                    if(Array.isArray(option.argChoices)) {
                        prompt.choices = option.argChoices.map(choice=>{
                            return {
                                title:choice,
                                value:choice
                            }
                        })
                    }
                    prompts.push(prompt)
                }
            }else if(typeof(promptArg) == 'object'){  //
                prompts.push(promptArg)
            }       
        })
        return prompts
    }

    private async postActionHook(){
        for(let listener of this._afterHooks){
            await listener(...arguments)
        }
    }
    option(flags: string, description?: string | undefined,opts?:OptionParams): this;
    option(flags: string, description?: string | undefined, defaultValue?: string | boolean | string[] | undefined): this;
    option<T>(flags: string, description: string, fn: (value: string, previous: T) => T, defaultValue?: T | undefined): this;
    option(flags: string, description: string, regexp: RegExp, defaultValue?: string | boolean | string[] | undefined): this;
    option(flags: unknown, description?: unknown, regexp?: unknown, defaultValue?: unknown): this {
        if(arguments.length==3 && typeof arguments[2] == "object"){
            let params = Object.assign({},arguments[2] || {}) as OptionParams
            let option  = new Option(arguments[0],arguments[1])
            if(params.default) option.default(params.default,params.defaultDescription)
            if(params.choices) option.choices(params.choices)
            if(params.conflicts) option.conflicts(params.conflicts)
            if(params.env) option.env(params.env)
            if(params.argParser) option.argParser(params.argParser)
            if(params.hideHelp) option.hideHelp(params.hideHelp)
            if(params.mandatory) option.makeOptionMandatory(params.mandatory)
            if(params.implies) option.implies(params.implies) 
            option._prompt = params.prompt
            return this.addOption(option)
        }else{            
            // @ts-ignore
            return super.option(...Array.from(arguments))
        } 
    }
    /**
     * 启用自动提示
     * 
     * @remarks
     * 
     * 启用后会根据用户输入的选项值来判断是否需要提示用户输入
     * 
     * @param auto 
     * 
     */
    autoPrompt(value:boolean){
        this._autoPrompt = value
        return this
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
        this._promptQuestions.push(...Array.isArray(questions) ? questions:[questions])
        return this
    }
}