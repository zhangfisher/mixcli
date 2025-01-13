import { Option, OptionValues } from 'commander'
import { PromptObject } from 'prompts'
import {  PromptChoice, MixOptionPrompt,PromptParams } from  './prompt'
 

export interface MixedOptionParams {
    required?               : boolean; // A value must be supplied when the option is specified.
    optional?               : boolean; // A value is optional when the option is specified.
    variadic?               : boolean; 
    mandatory?              : boolean; // The option must have a value after parsing, which usually means it must be specified on command line.
    negate?                 : boolean;
    default?                : any;
    defaultDescription?     : string;
    conflicts?              : string | string[];
    argParser?              : unknown;
    implies?                : OptionValues
    envVar?                 : string;
    parseArg?               : <T>(value: string, previous: T) => T;
    hidden?                 : boolean;
    choices?                : (string | PromptChoice )[] | ((pre:any,answers:any)=>(string | PromptChoice)[]);
    validate?               : (value: any) => boolean;
    preset?                 : unknown;
    prompt?                 : PromptParams
}


export class MixOption extends Option{
    __MIX_OPTION__ = true
    prompt?                 : MixOptionPrompt      
    private _validate?: (value: any) => boolean       
    constructor(flags: string, description: string,public params?: MixedOptionParams) {
        super(flags, description)                
        this._setOption(params || {})        
        this.prompt = new MixOptionPrompt(this,params?.prompt)    
    } 
    private _setOption(params:MixedOptionParams){        
        if(params.default) this.default(params.default,params.defaultDescription)
        if(params.conflicts) this.conflicts(params.conflicts)
        if(params.envVar) this.env(params.envVar)
        if(params.parseArg) this.argParser(params.parseArg) 
        if(params.hidden) this.hidden = params.hidden
        if(params.mandatory) this.makeOptionMandatory(params.mandatory)
        if(params.implies) this.implies(params.implies) 
        if(params.optional) this.optional=params.optional
        if(params.variadic) this.variadic = params.variadic
        if(params.negate) this.negate = params.negate
        if(params.preset) this.preset(params.preset)
        if(Array.isArray(params.choices)) {
            this.choices(params.choices.map(choice=>typeof(choice)=='string' ? choice : choice.value))
        }
        if(typeof(params.validate)=='function') this._validate = params.validate.bind(this)
        if(params.required) {
            this.required = params.required
            if(!this._validate ) this._validate  = (value:any)=>String(value).length > 0
        }
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
     * @param inputValue 
     * @returns 
     */
    getPrompt(inputValue?:any): PromptObject | undefined {
        return this.prompt?.get(inputValue)
    } 
}