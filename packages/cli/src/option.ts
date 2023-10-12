import { Option } from 'commander'
import { PromptObject } from 'prompts'
import { IPromptable, IPromptableOptions, PromptChoice, PromptManager } from './prompt'


export interface MixedOptionParams extends IPromptableOptions{
    hidden?:boolean
    defaultDescription?:string          // 默认值的描述    
    conflicts?:string | string[]
    env?:string
    argParser?:<T>(value: string, previous: T) => T 
    hideHelp?:boolean
    mandatory?: boolean 
    implies?:{[key:string]:any}  
}


export class MixedOption extends Option implements IPromptable{
    // 是否提示用户输入
    prompt?: PromptManager     
    promptChoices?:PromptChoice[]
    private _validate?: (value: any) => boolean       
    constructor(flags: string, description?: string | undefined,optsOrDefault?:any) {
        super(flags, description)
        let params:MixedOptionParams = {}
        if(arguments.length==3 && typeof arguments[2] == "object"){
            params = Object.assign({ },arguments[2])  
        }else if(arguments.length==3){
            params.default = arguments[2]
        }
        if(params.prompt===undefined) params.prompt = 'auto'
        if(params.default) this.default(params.default,params.defaultDescription)
        if(params.choices) this.choices(params.choices)
        if(params.conflicts) this.conflicts(params.conflicts)
        if(params.env) this.env(params.env)
        if(params.required) this.required = params.required
        if(params.argParser) this.argParser(params.argParser)
        if(params.hideHelp) this.hideHelp(params.hideHelp)
        if(params.hidden) this.hidden = params.hidden
        if(params.mandatory) this.makeOptionMandatory(params.mandatory)
        if(params.implies) this.implies(params.implies) 
        if(params.optional) this.optional=params.optional
        if(typeof(params.validate)=='function') this._validate = params.validate.bind(this)
        this.prompt = new PromptManager(this as IPromptable,params.prompt)
    } 
    validate(value: any): boolean {
        if(typeof(this._validate)=='function'){
            return this._validate(value)
        }else{
            return true
        }
    }
    // @ts-ignore
    choices(values:(PromptChoice | string)[]){
        if(!this.promptChoices){
            this.promptChoices = values.map(choice=>{
                if(typeof(choice)=='object'){
                    return choice
                }else{
                    return {title:choice,value:choice}                    
                }
            })
        }        
        super.choices(this.promptChoices.map((item:any)=>item.value))    
    }    

    private resetChoices(){
        super.choices(this.promptChoices!.map((item:any)=>item.value))    
    }

    addChoice(value:PromptChoice | string){
        if(!this.promptChoices || !Array.isArray(this.promptChoices)) this.promptChoices = []
        this.promptChoices!.push(typeof(value)=='string' ? {title:value,value} : value)
        this.resetChoices()
    }
    removeChoice(value:any){
        this.promptChoices =this.promptChoices?.filter(choice=>choice.value!==value)
        this.resetChoices()
    }
    clearChoice(){
        this.promptChoices = []
        this.resetChoices()
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