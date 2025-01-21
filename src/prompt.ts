import { isPlainObject } from "flex-tools/typecheck/isPlainObject"
import { isNumber  } from "flex-tools/typecheck/isNumber"

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
    date   : "date"
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
        return supportedPromptTypes.includes(String(type))
    }
    /**
     * 推断是否需要提示
     * 
     * 1. 显式指定prompt=true或者提示类型，或者提示对象，则需要提示
     * 
     * 
     */
    isNeedPrompt(input:any,defaultValue?:any,enable?:boolean){
    
        if(enable === false) return false
        if(enable === true) return true
        
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
            return  true
        }

        // 4. 指定了可选值，但是没有输入值，则需要提示
        const isOptional = /(\<s*\w\s*\>)/.test(this.cliOption.flags) 
        if(isOptional) return !hasInput
        
        // 4. 判断输入是否有效，则显示提示
        if(this.cliOption.argChoices && this.cliOption.argChoices.indexOf(inputValue) == -1){
            return true
        } 
        return !hasInput

    }
    
    private _getChoices(){
        let choices:(string | PromptChoice)[] | ((pre:any,answers:any)=>(string | PromptChoice)[]) = []
        let choicesParam = this.cliOption.params?.choices
        if(this.cliOption.argChoices){
            choices =  this.cliOption.argChoices.map(choice=>{
                if(typeof(choice)=='string'){
                    return {title:choice,value:choice}
                }else{
                    return choice
                }
            })
        }else if(choicesParam){
            choices = typeof(choicesParam)=='function' ? choicesParam : [] 
        }else{
            return []
        } 
        return choices
    } 

    /**
     * 自动推断prompt类型
     * 
     * 
     * 
     * @param inputValue   从命令行输入的值
     */
    infer(inputValue?:any){

        const { variadic, defaultValue } = this.cliOption

        const input = inputValue || defaultValue

        // 如果选择指定了"-p [value]或[value...]"，则使用text类型，如果没有要求输入值，则使用confirm类型
        let promptType:PromptType = 'text'

        const params = this.params

        if(this.isValidPromptType(params)){   // 显式指定了prompt类型,m则以指定的类型为准            
            promptType = params as PromptType
        }else if(isPlainObject(params)){     // 显式指定了prompt对象
            promptType = (params as PromptObject).type as PromptType
        }else{          // 自动推断prompt类型
        
            const isListType = /(\[\s*\w+\.\.\.\s*])|(\<\s*\w+\.\.\.\s*>)/.test(this.cliOption.flags)
            const isTextType = /(\<s*\w+\s*\>)|(\[\w+\])/.test(this.cliOption.flags) 
            const isBooleanType = !/(\[\s*\w+s*])|(\<\s*\w+\s*>)/.test(this.cliOption.flags)
            const isNumberType = isNumber(defaultValue)
            const isDate = defaultValue && defaultValue instanceof Date

            // 根据默认值的类型推断
            const datatype:string = Array.isArray(input) ? 'array' : 
                input instanceof Date ? 'date' :
                typeof(input)                              

            const optionParams = this.cliOption.params

            if(optionParams && optionParams.choices){
                const choices = optionParams.choices
                if(isBooleanType && (Array.isArray(choices) && choices.length==2)){
                    promptType = 'toggle'
                }else{
                    promptType = variadic ? 'multiselect' : 'select'
                }                
            }else if(isListType){   // 提供多个可选值时
                promptType = 'list'
            }else if(isDate){
                promptType = 'date'
            }else if(isNumberType){
                promptType = 'number'
            }else if(isTextType){   // 提供一个可选值时
                promptType = 'text' 
            }else if(isBooleanType || typeof(defaultValue)==='boolean'){
                promptType = 'confirm'
            }else if(datatype in promptTypeMap){
                promptType = promptTypeMap[datatype] as PromptType
            }
        }
        outputDebug("选项<{}> -> 提示类型<{}>",[this.cliOption.name(),promptType])
        return promptType
    }
    /**
     * 返回生成prompt对象
     * 
     * @param inputValue   从命令行输入的值
     */
    get(inputValue?:any,enable?:boolean){

        const { description, defaultValue } = this.cliOption
        
        let input = inputValue || defaultValue

        // 1. 判断是否需要启用提示
        if(!this.isNeedPrompt(input,defaultValue,enable)) return

        // 2. 推断prompt类型
        const promptType = this.infer(inputValue)

        const prompt = {
            type   : promptType,                        
            name   : this.cliOption.attributeName(),
            message: description,
            initial: input,
            ...typeof(this.params) == 'object' ? this.params : {}
        } as PromptObject


        // 指定了验证函数，用来验证输入值是否有效
        prompt.validate = this.cliOption.params?.validate

        if(promptType=='multiselect') prompt.instructions=false
        prompt.choices = prompt.choices || this._getChoices()  as any 

        if(['select','multiselect'].includes(promptType)){                  

        }else if(promptType=='toggle'){  
            if(Array.isArray(prompt.choices)){
                if(!prompt.active) prompt.active = prompt.choices[0].value
                if(!prompt.inactive) prompt.inactive = prompt.choices[1].value                
            }
        }

        if(input && typeof(prompt.initial)!='function'){
            if(prompt.choices && Array.isArray(prompt.choices)){
                if(promptType=='select'){
                    const index = Array.isArray(prompt.choices) ? prompt.choices.findIndex(item=>item.value==input) : -1
                    if(index!=-1){
                        prompt.initial = index
                    }
                }else if(promptType=='multiselect'){                
                    prompt.choices.forEach((item)=>{
                        if(Array.isArray(input) && input.includes(item.value)){
                            item.selected = true
                        }else if(item.value==input){
                            item.selected = true
                        }
                    })
                }
            }
        }

        return prompt
    }


}