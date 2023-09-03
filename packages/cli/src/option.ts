import { Option } from 'commander'
import { PromptObject } from 'prompts'
import { IPromptable, IPromptableOptions, PromptManager } from './prompt'


export interface FlexOptionParams extends IPromptableOptions{
    defaultDescription?:string          // 默认值的描述    
    conflicts?:string | string[]
    env?:string
    argParser?:<T>(value: string, previous: T) => T 
    hideHelp?:boolean
    mandatory?: boolean 
    implies?:{[key:string]:any}  
}


export class FlexOption extends Option implements IPromptable{
    // 是否提示用户输入
    prompt?: PromptManager     
    private _validate?: (value: any) => boolean       
    constructor(flags: string, description?: string | undefined,optsOrDefault?:any) {
        super(flags, description)
        let params:FlexOptionParams = {}
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
        if(typeof(params.validate)=='function') this._validate = params.validate
        this.prompt = new PromptManager(this as IPromptable,params.prompt)
    }  
    validate(value: any): boolean {
        if(typeof(this._validate)=='function'){
            return this._validate(value)
        }else{
            return true
        }
    }
    /**
     * 返回选项的提示对象
     * 
     * @remarks
     * 
     *
     * 
     * @param inputValue 
     * @returns 
     */
    getPrompt(inputValue?:any): PromptObject | undefined {
        return this.prompt?.get(inputValue)
    } 
}