import { isPlainObject } from "flex-tools/typecheck/isPlainObject"
import { PromptObject } from "prompts" 
import { outputDebug } from "./utils"
import { MixOption } from "./option"
 

export type PromptType = "text" | "password" | "invisible" | "number"| "confirm"| "list" 
    | "toggle"| "select" | "multiselect" | "autocomplete" | "date" | "autocompleteMultiselect"

export type PromptParam = 'auto' | boolean | PromptType | PromptObject
export type InputPromptParam = PromptParam | ((value:any)=>PromptParam) | boolean
export type PromptParamDefaultValue = string | boolean | string[]  

export const promptTypeMap:Record<string,string> = {
    boolean: "confirm",
    string : "text",
    number : "number",                        
    array  : "list",                        
} 

export const supportedPromptTypes = [
    "text",
    "password",
    "invisible", 
    "number", 
    "confirm" , 
    "list", 
    "toggle" , 
    "select" , 
    "multiselect" , 
    "autocomplete" , 
    "date" , 
    "autocompleteMultiselect"
]

export interface PromptChoice {
    title       : string;
    value?      : any;
    disabled?   : boolean | undefined;
    selected?   : boolean | undefined;
    description?: string | undefined;
}

 
export type PromptParams = Omit<PromptObject,'name'> | PromptType | boolean | 'auto' | undefined     

/**
 * 负责生成prompt对象
 * 
 */
export class MixOptionPrompt{
    params?: PromptParams
    constructor(public cliOption:MixOption,promptParams?:PromptParams){ 
        this.params = promptParams
    }
    /**
     * 返回输入的是否是有效的prompt类型
     * @param type 
     * @returns 
     */
    isValidPromptType(type:any){
        return  supportedPromptTypes.includes(String(type))
    }
    /**
     * 推断是否需要提示
     * 
     */
    isNeedPrompt(input:any,defaultValue?:any){
    
        const params = this.params
        const inputValue = input || defaultValue

        // 是否有输入值，即在命令行输入了值
        const hasInput = !(inputValue === undefined)
        
        // 1. 显式指定了_prompt为true，则需要提示，后续进行提示类型的推断，可能不会准确
        if(params === true) return true
        if(params === false) return false        
        if(params === 'auto') return !hasInput

        // 2. 提供了一个prompt对象，并且没有在命令行输入值，则需要提示
        if(isPlainObject(params)){
            return !hasInput
        }

        // 3. 指定了内置的prompt类型，如prompt='password'，则使用password类型提示输入
        if(typeof(params) == 'string' && this.isValidPromptType(params)){
            return  !hasInput
        }
        
        // 4. 判断输入是否有效，则显示提示
        if(this.cliOption.argChoices && this.cliOption.argChoices.indexOf(inputValue) == -1){
            return true
        } 
        return !hasInput

    }
    
    private _getChoices(){
        if(this.cliOption.argChoices){
            return this.cliOption.argChoices.map(choice=>{
                if(typeof(choice)=='string'){
                    return {title:choice,value:choice}
                }else{
                    return choice
                }
            })
        }
        return []
    }

    private _getInitialValue(inputValue:any){

    }

    /**
     * 返回生成prompt对象
     * 
     * @param inputValue   从命令行输入的值
     */
    get(inputValue?:any){

        const { description, validate, defaultValue } = this.cliOption
        
        let input = inputValue || defaultValue

        // 1. 判断是否需要启用提示
        if(!this.isNeedPrompt(input,defaultValue)) return

        // 2. 推断prompt类型
        const promptType = this.infer(inputValue)

        const prompt = {
            type   : promptType,                        
            name   : this.cliOption.name(),
            message: description,
            initial: input,
            ...typeof(this.params) == 'object' ? this.params : {}
        } as PromptObject


        // 指定了验证函数，用来验证输入值是否有效
        prompt.validate = validate?.bind(this.cliOption)
        if(promptType=='multiselect') prompt.instructions=false
        if(['list','select','multiselect'].includes(promptType)){
            prompt.choices = this._getChoices()
            //  let index = promptChoices?.findIndex(item=>item.value==input)
            //  prompt.initial = index==-1 ? undefined : index
        }  
        return prompt
    }

    /**
     * 自动推断prompt类型
     * 
     * 
     * 
     * @param inputValue   从命令行输入的值
     */
    infer(inputValue?:any){

        const { argChoices, variadic, defaultValue } = this.cliOption

        const input = inputValue || defaultValue

        // 如果选择指定了"-p [value]或[value...]"，则使用text类型，如果没有要求输入值，则使用confirm类型
        let promptType = /(\<[\w\.]+\>)|(\[[\w\.]+\])/.test(this.cliOption.flags) ? 'text' : 'confirm'

        const params = this.params

        if(this.isValidPromptType(params)){   // 显式指定了prompt类型
            promptType = params as string
        }else{          // 未显式指定prompt类型，需要按一定规则推断类型
            if(typeof(params)=='object'){
                promptType = params.type as string
            }else{
                if(argChoices){  // 提供多个可选值时
                    promptType = variadic ? 'multiselect' : 'select'
                }else{
                    const datatype:string = Array.isArray(defaultValue) ? 'array' : typeof(defaultValue)                              
                    // 如果输入值是数组，则使用list类型,允许使用逗号分隔的多个值
                    if(Array.isArray(input) || variadic){
                        promptType = "list"
                    }else{
                        if(datatype in promptTypeMap){
                            promptType = promptTypeMap[datatype]
                        }
                    }
                }
            }
        }
        outputDebug("选项<{}> -> 提示类型<{}>",[this.cliOption.name(),promptType])
        return promptType
    }

}