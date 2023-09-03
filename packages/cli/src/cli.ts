#!/usr/bin/env node
import "flex-tools/string"
import { Command } from "commander"
import logsets  from "logsets"
// @ts-ignore
import replaceAll  from 'string.prototype.replaceall'
import { assignObject } from "flex-tools/object/assignObject"
import { FlexCommand } from "./command"
replaceAll.shim() 


export interface FlexCliOptions{
    name:string,
    title?:string,
    version?:string
    logo?:(thisCommand:Command,actionCommand:Command)=>void,
    // 在根命令执行前执行==commander的preAction
    before?:(thisCommand:Command,actionCommand:Command)=>void,
    // 在根命令执行后执行==commander的postAction
    after?:(thisCommand:Command,actionCommand:Command)=>void, 
    // flexcli运行时会在当前工程的package.json的依赖中查找以prefix/开头的包，然后自动加载其cli目录下的命令
    // 例如：prefix=myapp，则会自动加载flex-cli-xxx包中的cli目录下的命令
    // 如prefix=myapp, cliPath="cmds",则会自动加载flex-cli-xxx包中的cmds目录下的命令
    prefix:string | RegExp,
    // flexcli会在当前工程的以prefix/开头下查找命令声明
    // / pattern默认值是cli，即会在当前工程的以prefix/开头的包下查找cli目录下的命令
    pattern?:string                         // 指定cli所在的目录,默认值是cli    
    context?:Record<string,any>             // 传递给命令的上下文，当使用        
}

const configs:FlexCliOptions ={
    name:"FlexCli",
    prefix:"^flexcli",      
    pattern:"cli",
}
 
  

export type FlexCliCommand = (cli:FlexCli)=>Command | void


export class FlexCli{
    commands:Record<string,Command> = {}
    options:FlexCliOptions 
    root!:Command                        // 根命令
    constructor(options?:FlexCliOptions){
        this.options= assignObject({
            name:"FlexCli",
        },options)   
        this.createRootCommand()
    } 
    get name(){return this.options.name}

    /**
     * 创建根命令
     * 
     */
    private createRootCommand(){
        this.root = new Command('root');
        this.root.name(this.name)
            .helpOption('-h, --help', '显示帮助')     
            .version(require("../package.json").version,"-v, --version","当前版本号") 
            .action(()=>{
                logsets.log("Voerka Cloud Command Line Interface")
                logsets.log("版本号:{}",require("../package.json").version)
                this.root.help()
            })
        if(this.options.before) this.root.hook('preAction',(thisCommand,actionCommand)=>this.rootBeforeHook.call(this,thisCommand,actionCommand))
        if(this.options.after) this.root.hook('postAction',this.options.after) 
    } 

    private rootBeforeHook(thisCommand:Command,actionComand:Command){
        if(actionComand.parent==null){
            if(this.options.logo) this.options.logo(thisCommand,actionComand)
        }
        if(this.options.before) this.options.before(thisCommand,actionComand)
    }

    /**
     * 注册一个命令
     * @param cmd 
     */
    register(cmd:FlexCliCommand){
        if(typeof(cmd)=="function"){
            let result = cmd(this)
            if(result instanceof Command){
                this.root.addCommand(result)
                this.commands[result.name()] = result
            }
        }else{
            logsets.error("无效的FlexCliCommand")
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
    get(name:string,command?:Command):Command | undefined{
        const names=name.split(".")
        let curCmd:Command = command || this.root
        let resultCmd:Command | undefined
        while(names.length>0){
            const topName = names.shift()
            const r = curCmd.commands.find(c=>c.name()==topName)  as Command
            if(r && names.length==0){
                resultCmd = r
            }
            curCmd = r
        }    
        return resultCmd    
    }
    /**
     * 判断命令是否存在
     * 
     * @param name 
     * @returns 
     */
    exists(name:string):boolean{
        if(name in this.commands){
            return true
        }else{
            return this.get(name) != undefined
        }
    } 
    /**
     * 运行命令行程序
     */
    run(){ 
        this.root.parseAsync(process.argv);              
    }
    /**
     * 创建一个命令
     * 
     * 
     */
    create(){
    }
}
 