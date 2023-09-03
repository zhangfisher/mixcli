import { Command,Option } from "commander";
import prompts, { PromptObject }  from  "prompts"
import { FlexOption,type FlexOptionParams } from "./option";

export type HookCommandListener = (thisCommand:FlexCommand,actionComand:FlexCommand)=>void | Promise<void>

export class FlexCommand extends Command{
    private _beforeHooks:Function[] = []
    private _afterHooks:Function[] = []
    private _customPrompts:PromptObject[] = [] 
    private _autoPrompt:boolean = true              // 根据参数自动生成提示    
    private _optionValues:Record<string,any> = {}   // 命令行输入的选项值
    constructor(){
        super()
        const self = this
        this.addInlineOptions()        
        this.hook("preAction",async function(this:any){
            self._optionValues = this.hookedCommand._optionValues        
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
        return this.parent === undefined
    }
    action(fn: (...args: any[]) => void | Promise<void>): this {
        return super.action(async function(){
            await fn(...arguments);        
        })
    } 
    before(listener:HookCommandListener){        
        this._beforeHooks.push(listener)
        return this
    } 
    after(listener:HookCommandListener){
        this._afterHooks.push(listener)
        return this
    }
    /**
     * 增加一些内置的辅助选项
     * 
     * --no-prompts 禁用所有交互提示
     * --no-option-prompts 禁用选项的交互提示
     * --no-argument-prompts 禁用参数的交互提示
     * 
     */
    private addInlineOptions(){
        if(!this.isRoot) return
        let option  = new Option("--no-prompts","禁用所有交互提示")
        option.hidden = true
        this.addOption(option)
    }

    private async preActionHook(thisCommand:Command, actionCommand:Command){              
        for(let listener of this._beforeHooks){
            await listener(...arguments)
        }
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
        const options = this.options as FlexOption[]
        const optionPromports = options
                    .map(option=>option.getPrompt(this._optionValues[option.name()]))
                    .filter(prompt=>prompt) as PromptObject[]
        return optionPromports
    }

    private async postActionHook(){
        for(let listener of this._afterHooks){
            await listener(...arguments)
        }
    }

    option(flags: string, description?: string | undefined,defaultValue?:any ): this
    option(flags: string, description?: string | undefined,options?:FlexOptionParams ): this{
        // @ts-ignore
        return this.addOption(new FlexOption(...arguments))         
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
        this._customPrompts.push(...Array.isArray(questions) ? questions:[questions])
        return this
    }
    /**
    * 当命令具有多个子命令时，并且没有提供默认子命令时，需要提示用户选择一个子命令
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

        this.args = [result.command]

        const command = this.commands.find(command=>command.name() === result.command)
    
        await command?.parseAsync([result.command],{from:"user"})

    }
}






    // 从命令行输入的选项值
    // let inputValue = this._optionValues[option.name()] || option.defaultValue
    // // 提示参数,即在option中指定的prompt参数
    // let promptArg:PromptParam 
    // if(typeof(option._prompt)==='function'){
    //     promptArg = option._prompt(inputValue)  
    //     option._prompt = promptArg
    // }else{
    //     promptArg= option._prompt
    // }              
    // // 推断是否需要提示
    // if(this.isNeedPrompt(option) ){
    //     // 推断prompt类型
    //     let promptType = this.inferPromptType(option,promptArg,inputValue)
    //     const prompt = {
    //         type:promptType,                        
    //         name:option.name(),
    //         message:option.description,
    //         initial: inputValue,
    //         ...typeof(promptArg) == 'object' ? promptArg : {}
    //     } as PromptObject
    //     // 指定了验证函数，用来验证输入值是否有效
    //     if(typeof(option._validate)=='function'){
    //         prompt.validate = option._validate
    //     }
    //     if(promptType=='multiselect') prompt.instructions=false
    //     // 选项值的可选值
    //     if(Array.isArray(option.argChoices)) {
    //         prompt.choices = option.argChoices.map(choice=>{
    //             if(typeof(choice)=='string'){
    //                 return {
    //                     title:choice,
    //                     value:choice
    //                 }
    //             }else{
    //                 return choice
    //             }                        
    //         })
    //     }
    //     prompts.push(prompt)
    // }     
    //     /**
    //  * 
    //  * 根据选项的配置和输入值自动推断提示类型
    //  * 
    //  * @remarks
    //  * 
    //  * 本方法在没有显式使用prompt参数指定提示类型时使用自动推断提示类型
    //  * 
    //  * @param option 
    //  * @param promptArg 
    //  * @param inputValue 
    //  * @returns 
    //  */
    //     private inferPromptType(option:Option,promptArg:PromptParam,inputValue:any):string{
    //         let promptType = 'text'
    //         if(isValidPromptType(promptArg)){   // 显式指定了prompt类型
    //             promptType = promptArg as string
    //         }else{          // 未显式指定prompt类型，需要按一定规则推断类型
    //             if(typeof(promptArg)=='object'){
    //                 promptType = promptArg.type as string
    //             }else{
    //                 if(option.argChoices){  // 提供多个可选值时
    //                     promptType = option.variadic ? 'multiselect' : 'select'
    //                 }else{
    //                     const datatype:string = Array.isArray(inputValue) ? 'array' : typeof(inputValue)                              
    //                     // 如果输入值班是数组，则使用list类型,允许使用逗号分隔的多个值
    //                     if(Array.isArray(inputValue) || option.variadic){
    //                         promptType = "list"
    //                     }else{
    //                         promptType = datatype in promptTypeMap ? promptTypeMap[datatype] : 'text'
    //                     }
    //                 }
    //             }
    //         }
    //         return promptType
    //     }

    //     /**
    //  *  判断是否需要为当前选项显示提示
    //  * 
    //  *  @remarks
    //  * 
    //  *  逻辑如下：
    //  *  - 没有提供默认值时，且没有在命令行输入值时，需要提示
    //  *  - 当提供choices时，且输入值不在choices中时，需要提示
    //  *  - 显示指定了prompt类型时，需要提示
    //  * 
    //  * prompt='auto'的意思是如果没有提供默认值，则自动推断提示类型
    //  * prompt=true 强制进行输入提示
    //  * prompt=false 不进行输入提示
    //  * prompt='password' 使用password类型提示输入
    //  * 
    //  * 
    //  */
    //     private isNeedPrompt(option:Option):boolean{
        
    //         const promptArg = option._prompt
    //         const inputValue = this._optionValues[option.name()] || option.defaultValue
    //         // 是否有输入值，即在命令行输入了值
    //         const hasInput = !(inputValue === undefined)
    //         if(option.hidden) return false
    //         // 1. 显式指定了_prompt为true，则需要提示，后续进行提示类型的推断，可能不会准确
    //         if(promptArg===true) return true
    //         if(promptArg===false) return false        
    
    //         // 2. 提供了一个prompt对象，并且没有在命令行输入值，则需要提示
    //         if(typeof(promptArg)=='object'){
    //             return !hasInput
    //         }
    
    //         // 3. 指定了内置的prompt类型，如prompt='password'，则使用password类型提示输入
    //         if(typeof(promptArg) == 'string' && supportedPromptTypes.includes(promptArg)){
    //             return  !hasInput
    //         }
            
    //         // 4. 判断输入是否有效，则显示提示
    //         if(option.argChoices && option.argChoices.indexOf(inputValue) == -1){
    //             return true
    //         }
    
    //         return !hasInput
    //     } 