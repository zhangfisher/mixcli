import { PromptObject } from "prompts" 
import { outputDebug } from "./utils"


export type PromptType = "text" | "password" | "invisible" | "number"| "confirm"| "list"| "toggle"| "select" | "multiselect" | "autocomplete" | "date" | "autocompleteMultiselect"

export type PromptParam = 'auto' | boolean | PromptType | PromptObject
export type InputPromptParam = PromptParam | ((value:any)=>PromptParam) | boolean
export type PromptParamDefaultValue = string | boolean | string[]  

export const promptTypeMap:Record<string,string> = {
    boolean:"confirm",
    string:"text",
    number:"number",                        
    array:"list",                        
} 

export const supportedPromptTypes = ["text","password","invisible", "number", "confirm" , "list", "toggle" , "select" , "multiselect" , "autocomplete" , "date" , "autocompleteMultiselect"]
export interface PromptChoice {
    title: string;
    value?: any;
    disabled?: boolean | undefined;
    selected?: boolean | undefined;
    description?: string | undefined;
}



export interface IPromptableOptions{
    required?: boolean;                         // A value must be supplied when the option is specified.
    optional?: boolean;                         // A value is optional when the option is specified.
    default?:PromptParamDefaultValue
    choices?:(PromptChoice | any)[]                           // 选项值的可选值
    prompt?:InputPromptParam
    validate?:(value: any) => boolean
}


export interface IPromptable{
    name():string 
    description?:string
    flags:string
    promptChoices?:PromptChoice[]
    argChoices?:string[]
    variadic?:boolean
    defaultValue?:PromptParamDefaultValue
    input?:any        
    required?:boolean
    validate?: (value: any) => boolean  
    getPrompt(inputValue?:any):PromptObject | undefined 
}

/**
 * 供command.option()使用的参数对象
 */
export interface PromptableObject{
   

}


/**
 * 负责生成prompt对象
 * 
 */
export class PromptManager{
    args:InputPromptParam                           
    private _promptable:IPromptable                 // 对应的FlexOption或FlexArgument
    constructor(promptable:IPromptable,promptArgs?:InputPromptParam){ 
        this._promptable = promptable
        this.args= promptArgs===undefined ? 'auto' : promptArgs
    }

    /**
     * 返回输入的是否是有效的prompt类型
     * @param type 
     * @returns 
     */
    isValid(type:any){
        return  supportedPromptTypes.includes(String(type))
    }
    /**
     * 推断是否需要提示
     * 
     */
    isNeed(input:any,defaultValue?:any){
    
        const promptArg = this.args
        const inputValue = input || defaultValue
        // 是否有输入值，即在命令行输入了值
        const hasInput = !(inputValue === undefined)
        // 1. 显式指定了_prompt为true，则需要提示，后续进行提示类型的推断，可能不会准确
        if(promptArg===true) return true
        if(promptArg===false) return false        

        // 2. 提供了一个prompt对象，并且没有在命令行输入值，则需要提示
        if(typeof(promptArg)=='object'){
            return !hasInput
        }

        // 3. 指定了内置的prompt类型，如prompt='password'，则使用password类型提示输入
        if(typeof(promptArg) == 'string' && supportedPromptTypes.includes(promptArg)){
            return  !hasInput
        }
        
        // 4. 判断输入是否有效，则显示提示
        if(this._promptable.argChoices && this._promptable.argChoices.indexOf(inputValue) == -1){
            return true
        } 
        return !hasInput
    }
    /**
     * 返回生成prompt对象
     * 
     * @param inputValue   从命令行输入的值
     */
    get(inputValue?:any){
        const {description,promptChoices,validate,defaultValue} = this._promptable
        let input = inputValue || defaultValue
        // 判断是否需要输入提示
        if(!this.isNeed(input,defaultValue)) return
        // 推断prompt类型
        let promptType = this.infer(inputValue)
        const prompt = {
            type:promptType,                        
            name:this._promptable.name(),
            message:description,
            initial: input,
            ...typeof(this.args) == 'object' ? this.args : {}
        } as PromptObject
        // 指定了验证函数，用来验证输入值是否有效
        prompt.validate = validate?.bind(this._promptable)
        if(promptType=='multiselect') prompt.instructions=false
        if(['select','multiselect'].includes(promptType)){
            let index = promptChoices?.findIndex(item=>item.value==input)
            prompt.initial = index==-1 ? undefined : index
        } 
        // 选项值的可选值
        if(Array.isArray(promptChoices)) {
            prompt.choices =promptChoices
        }
        return prompt
    }
    /**
     * 推断prompt类型
     * 
     * @param inputValue   从命令行输入的值
     */
    infer(inputValue?:any){
        const {argChoices,variadic,defaultValue} = this._promptable
        let input = inputValue || defaultValue
        // 如果选择指定了"-p [value]或[value...]"，则使用text类型，如果没有要求输入值，则使用confirm类型
        let promptType = /(\<[\w\.]+\>)|(\[[\w\.]+\])/.test(this._promptable.flags) ? 'text' : 'confirm'
        let promptArg = this.args
        if(this.isValid(promptArg)){   // 显式指定了prompt类型
            promptType = promptArg as string
        }else{          // 未显式指定prompt类型，需要按一定规则推断类型
            if(typeof(promptArg)=='object'){
                promptType = promptArg.type as string
            }else{
                if(argChoices){  // 提供多个可选值时
                    promptType = variadic ? 'multiselect' : 'select'
                }else{
                    const datatype:string = Array.isArray(defaultValue) ? 'array' : typeof(defaultValue)                              
                    // 如果输入值班是数组，则使用list类型,允许使用逗号分隔的多个值
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
        outputDebug("选项<{}> -> 提示类型<{}>",[this._promptable.name(),promptType])
        return promptType
    }

}