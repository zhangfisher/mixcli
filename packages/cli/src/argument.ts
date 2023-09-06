
// import { Argument } from 'commander';
// import { PromptObject } from 'prompts'
// import { IPromptable, IPromptableOptions, PromptManager } from './prompt'


// export interface FlexArgumentParams extends IPromptableOptions{
//     defaultDescription?:string          // 默认值的描述    
//     argParser?:<T>(value: string, previous: T) => T 
// }


// export class FlexArgument extends Argument implements IPromptable{
//     // 是否提示用户输入
//     prompt?: PromptManager     
//     private _validate?: (value: any) => boolean       
//     argChoices?:string[]
//     defaultValue?:any
//     constructor(flags: string, description?: string | undefined,optsOrDefault?:any) {
//         super(flags, description)
//         let params:FlexArgumentParams = {}
//         if(arguments.length==3 && typeof arguments[2] == "object"){
//             params = Object.assign({
//                 prompt : 'auto'
//             },arguments[2])  
//         }else if(arguments.length==3){
//             params.default = arguments[2]
//             params.prompt = 'auto'
//         }else{
//             params.prompt = 'auto'
//         }        
//         if(params.default){
//            this.defaultValue = params.default
//            this.default(params.default,params.defaultDescription)
//         }
//         if(params.choices){
//             this.argChoices = params.choices
//             this.choices(params.choices)
//         }
//         if(params.argParser) this.argParser(params.argParser)
//         if(typeof(params.validate)=='function') this._validate = params.validate.bind(this)
//         this.prompt = new PromptManager(this as IPromptable,params.prompt)
//     }  
//     validate(value: any): boolean {
//         if(typeof(this._validate)=='function'){
//             return this._validate(value)
//         }else{
//             return true
//         }
//     }
//     /**
//      * 返回选项的提示对象
//      * 
//      * @remarks
//      * 
//      *
//      * 
//      * @param inputValue 
//      * @returns 
//      */
//     getPrompt(inputValue?:any): PromptObject | undefined {
//         return this.prompt?.get(inputValue)
//     } 
// }