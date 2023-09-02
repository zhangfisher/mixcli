import { Option } from 'commander'
import { PromptObject } from 'prompts'
import { IPromptable, PromptManager } from './prompt'

export type PromptType = "text" | "password" | "invisible" | "number"| "confirm"| "list"| "toggle"| "select" | "multiselect" | "autocomplete" | "date" | "autocompleteMultiselect"

export type PromptParam = 'auto' | boolean | PromptType | PromptObject
export type InputPromptParam = PromptParam | ((value:any)=>PromptParam)
export type PromptParamDefaultValue = string | boolean | string[]  



export interface OptionParams{
    dataType?:string | number | boolean 
    default?:PromptParamDefaultValue
    defaultDescription?:string          // 默认值的描述
    choices?:string[]                   // 选项值的可选值
    required?: boolean;                 // A value must be supplied when the option is specified.
    optional?: boolean;                 // A value is optional when the option is specified.
    conflicts?:string | string[]
    env?:string
    argParser?:<T>(value: string, previous: T) => T 
    hideHelp?:boolean
    mandatory?: boolean 
    implies?:{[key:string]:any} 
    prompt?: InputPromptParam
    validate?: (value: any) => boolean 
    
}


export class FlexOption extends Option implements IPromptable{
    // 是否提示用户输入
    prompt?: PromptManager           
    // 校验用户输入
    validate?:(value: any) => boolean 
    constructor(flags: string, description?: string | undefined,optsOrDefault?:any) {
        super(flags, description)
        let params:OptionParams = {}
        if(arguments.length==3 && typeof arguments[2] == "object"){
            params = Object.assign({
                prompt : 'auto'
            },arguments[2])  
        }else if(arguments.length==3){
            params.default = arguments[2]
            params.prompt = 'auto'
        }else{
            params.prompt = 'auto'
        }        
        if(params.default) this.default(params.default,params.defaultDescription)
        if(params.choices) this.choices(params.choices)
        if(params.conflicts) this.conflicts(params.conflicts)
        if(params.env) this.env(params.env)
        if(params.argParser) this.argParser(params.argParser)
        if(params.hideHelp) this.hideHelp(params.hideHelp)
        if(params.mandatory) this.makeOptionMandatory(params.mandatory)
        if(params.implies) this.implies(params.implies) 
        if(typeof(params.validate)=='function') this.validate = params.validate
        this.prompt = new PromptManager(this,params.prompt)
    }
}