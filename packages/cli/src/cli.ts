#!/usr/bin/env node
import "flex-tools/string"
import { LiteEvent, LiteEventSubscriber } from "flex-tools/events/liteEvent"
import { Command } from "commander"
import logsets  from "logsets"

import { assignObject } from "flex-tools/object/assignObject"
import { MixedCommand } from "./command"
import { addBuiltInOptions, fixIndent } from './utils';
import { findCommands } from "./finder"
import { asyncSignal } from "flex-tools/async/asyncSignal"
// @ts-ignore
import replaceAll  from 'string.prototype.replaceall'
replaceAll.shim() 

export interface MixedCliOptions{
    name:string,
    title?:string | (string | boolean | number)[],
    description?:string,
    version?:string
    // 定义显示帮助信息
    logo?:string ,
    // 在根命令执行前执行==commander的preAction
    before?:(thisCommand:Command,actionCommand:Command)=>void,
    // 在根命令执行后执行==commander的postAction
    after?:(thisCommand:Command,actionCommand:Command)=>void, 
    // flexcli运行时会在当前工程的package.json的依赖中查找以prefix/开头的包，然后自动加载其cli目录下的命令
    // 例如：prefix=myapp，则会自动加载flex-cli-xxx包中的cli目录下的命令
    // 如prefix=myapp, cliPath="cmds",则会自动加载flex-cli-xxx包中的cmds目录下的命令
    include?:string | RegExp | string[] | RegExp[],
    // 忽略查找正则表达式
    exclude?:string | RegExp | string[] | RegExp[],
    // flexcli会在当前工程的以prefix/开头下查找命令声明
    // / pattern默认值是cli，即会在当前工程的以prefix/开头的包下查找cli目录下的命令
    // 指定cli所在的目录,默认值是cli,要遍历该目录下的所有js文件作为命令导出
    cliDir?:string            
    context?:Record<string,any>             // 传递给命令的共享上下文，所有命令均可要使用        
}

 
  

export type MixedCliCommand = (cli:MixedCli)=>MixedCommand | MixedCommand[] | void


export type MixedCliEvents = 
    "register"              // 当命令注册时触发

export class MixedCli extends LiteEvent<any,MixedCliEvents>{
    options:Required<MixedCliOptions> 
    root!:Command           
    private findSignals:any[]=[]
    constructor(options?:MixedCliOptions){
        super()
        this.options= assignObject({
            name:"mixed-cli",
            package:null,
            cliDir:"cli",
        },options)   
        this.createRootCommand() 
        this.installExtendCommands()        
    } 
    get context(){return this.options.context}
    get name(){return this.options.name}
    /**
     * 是否禁用了所有的交互提示
     */
    get isDisabledPrompts(){
        return(this.root as any).rawArgs.includes("--no-prompts")    
    }   
    /**
     * 扫描当前工程的依赖，加载匹配include的依赖下的命令
     */
    private installExtendCommands(){
        const cmders = findCommands(this)
        for(let cmder of cmders){
            try{
                if(typeof(cmder)==="function"){
                    let cmds = cmder(this)
                    cmds =cmds ?  (Array.isArray(cmds) ? cmds : [cmds]) : []
                    this.register(()=>cmds) 
                }
            }catch(e:any){
            }
        }
    } 
    /**
     * 创建根命令
     * 
     */
    private createRootCommand(){
        this.root = new MixedCommand(this.name);
        this.root 
            .helpOption('-h, --help')     
            .version(require("../package.json").version,"-v, --version") 
            .action(()=>{                
                if(this.options.logo) logsets.log(fixIndent(this.options.logo,2))
                console.log()
                // 显示标题
                let title = this.options.title|| this.options.name
                if(Array.isArray(title)){
                    logsets.log(String(title[0]).firstUpper(),[...title.slice(1)])
                }else{
                    logsets.log(`${title.firstUpper()}       Version: {}`,this.options.version)
                }                
                // @ts-ignore
                if(this.options.description) logsets.log(logsets.colors.darkGray(this.options.description)) 
                console.log()
                this.root.help()                
            })            
        addBuiltInOptions(this.root)
        if(this.options.before) this.root.hook('preAction',this.options.before)
        if(this.options.after) this.root.hook('postAction',this.options.after) 
    } 
    /**
     * 添加帮助选项
     * 
     * @param text      帮助文本
     * @param position  显示位置，可选值：before|after|beforeAll|afterAll
     * @param fixIndent   是否自动修正缩进，如果为true，则会自动修正缩进，当显示多行时文本时，会自动修正缩进
     * 
     */
    public addHelp(text:string,{pos='beforeAll',alignIndent=true}:{pos:'before'|'after' | 'beforeAll' | 'afterAll',alignIndent?:boolean | number}){
        if(alignIndent) text = fixIndent(text,alignIndent)
        this.root.addHelpText(pos,text)
    }

    /**
     * 注册一个命令
     * @param cmd 
     */
    register(cmd:MixedCliCommand){
        if(typeof(cmd)=="function"){
            let result = cmd(this)
            let cmds = result instanceof Array ? result : (result==undefined ? [] :  [result])
            for(let cmd of cmds){
                if(cmd instanceof MixedCommand){
                    this.root.addCommand(cmd) ;
                    (cmd as any)._cli = this
                    this.emit("register",cmd.fullname,true)
                }
            }                        
        }else{
            logsets.error("Invalid command")
        }        
    }
    /**
     * 根据命令名称查找命令
     * 
     * @remarks
     * 
     * find("dev")
     * find("dev.microservice")  支持多级命令
     * find("abc",DevCommand)  允许指定从DevCommand下开始查找abc命令
     * 
     * @param name 
     */
    get(name:string):MixedCommand | undefined{
        const names=name.split(".")
        let curCmd:Command = this.root
        let resultCmd:MixedCommand | undefined
        while(names.length>0){
            const topName = names.shift()
            const r = curCmd.commands.find(c=>c.name()==topName)  as MixedCommand
            if(r && names.length==0){
                resultCmd = r
            }
            curCmd = r
        }     
        return resultCmd    
    }
    /**
     * 查找一个命令
     * 
     * 如果命令不存在，则等待命令注册后再返回
     * 
     * 在多包场景下，如果命令在其他包中注册并且该包中的命令还没注册，则会等待命令注册后再返回
     * 
     * @param name 
     * @returns 
     */
    find(name:string):Promise<MixedCommand | undefined>{
        const signal = asyncSignal()
        this.findSignals.push(signal)
        return new Promise<MixedCommand | undefined>((resolve)=>{
            let listener:LiteEventSubscriber
            listener = this.on("register",(fullname:string)=>{
                if(fullname==`${this.name}.${name}`){
                    listener.off()
                    signal.resolve()
                    this.findSignals = this.findSignals.filter(s=>s!=signal)
                    resolve(this.get(name))
                }
            },{objectify:true}) as LiteEventSubscriber
        })
    }
    /**
     * 判断命令是否存在
     * 
     * @param name 
     * @returns 
     */
    exists(name:string):boolean{
        if(name in this.root.commands){
            return true
        }else{
            return this.get(name) != undefined
        }
    }     
    
    /**
     * 运行命令行程序
     */
    run(){ 
        // 为什么有findSignal这玩意，解决什么问题？
        // 当我们要扩展command时，通过get("命令名称")来获取已经注册的命令的方式有个缺陷
        // 就是如果对命令的注册顺序有严格的要求，比如调用get('dev')时要求dev命令必须已经存在
        // 这对动态包的命令注册扩展开发体验不好
        // 所以引入find("命令名称")来获取命令，该方法可以获取到后注册的命令
        // 其副作用是，在run时，可能find还没有运行到，从而导致在帮助信息里面看不到扩展的信息(实际上是已经生效的)
        // 所以我们在find里面注入一个异步信号来解决此问题
        return Promise.all(this.findSignals.map(signal=>signal(10000))).then(()=>{
            this.root.parseAsync(process.argv);              
        })
    }
    /**
     * 创建一个命令
     * 
     * 
     */
    create(){
    }
}
 