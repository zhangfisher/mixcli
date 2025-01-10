import { Option, OptionValues } from 'commander'
import { PromptObject } from 'prompts'
import { IPromptable, PromptChoice, OptionPromptObject, MixOptionPrompt'./prompt'


export interface MixedOptionParams {
    required?               : boolean; // A value must be supplied when the option is specified.
    optional?               : boolean; // A value is optional when the option is specified.
    variadic?               : boolean;
    mandatory?              : boolean; // The option must have a value after parsing, which usually means it must be specified on command line.
    negate?                 : boolean;
    defaultValue?           : any;
    defaultDescription?     : string;
    conflicts?              : string | string[];
    argParser?              : unknown;
    implies?                : OptionValues
    envVar?                 : string;
    parseArg?               : <T>(value: string, previous: T) => T;
    hidden?                 : boolean;
    choices?                : (string | PromptChoice )[];
    validate?               : (value: any) => boolean;
    preset?                 : unknown;
    prompt?                 : PromptObject | PromptType | boolean | 'auto'
}


export class MixOption extends Option implements IPromptable{
    __MIX_OPTION__ = true
    prompt?       : MixOptionPrompt     
    promptChoices?: PromptChoice[]
    private _validate?: (value: any) => boolean       
    constructor(flags: string, description: string, params?: MixedOptionParams) {
        super(flags, description)                
        this._setOption(params || {})
        this._createPromptObject(params || {})        
    } 
    private _setOption(params:MixedOptionParams){
        if(params.defaultValue) this.default(params.defaultValue,params.defaultDescription)
        if(params.choices) this.choices(params.choices)
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
        if(Array.isArray(params.choices)) this.choices(params.choices.map(choice=>typeof(choice)=='string' ? choice : choice.value))

        if(typeof(params.validate)=='function') this._validate = params.validate.bind(this)
        if(params.required) {
            this.required = params.required
            if(!this._validate ) this._validate  = (value:any)=>String(value).length>0
        }
    }

    private _createPromptObject(params:MixedOptionParams){
        
        const promptParams:PromptObject = {
            type: 'text',
            name: this.name(),
        }
        // 将参数转换为提示对象
        if(Array.isArray(params.choices)){
            promptParams.choices = params.choices.map(choice=>typeof(choice)=='string' ? { title:choice, value:choice } : choice)
        }        
        if(params.defaultValue) promptParams.initial = params.defaultValue
MixOptionPrompt
        this.prompt = new OptionPromptObject(this,promptParams)
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
                    return { title:choice, value:choice }                    
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
     * @param inputValue 
     * @returns 
     */
    getPrompt(inputValue?:any): PromptObject | undefined {
        return this.prompt?.get(inputValue)
    } 
}