/**
 * 
 *   实现配置的加载与保存
 * 
 */
import { SettingLoader } from "@voerka/core";
import { deepMerge } from "flex-tools/object/deepMerge"; 
import yaml from "js-yaml"
import path from "node:path"
import fs from "node:fs" 
import dotenv from "dotenv"
import dotenvExpand from "dotenv-expand"
import { set as setByPath } from 'flex-tools/object/set';
import type { NodejsApplication } from "./app";
dotenvExpand.expand(dotenv.config())

export class NodejsSettingLoader extends SettingLoader{   

    /**
     * 加载所有配置参数
     * 
     * 1. 读取@voerka/nodejs默认配置文件
     * 2. 扫描当前目录下的配置文件
     * 
     * 合并形成最终的配置参数
     * 
     * @param app 
     * @returns 
     */
    async load(mode?:string){                
        let  values:Record<string,any> = {}
        const app = this.app as NodejsApplication
        const cwd = process.cwd()
        const dataPath = app.dataPath

        // 1. 配置文件
        const settingFiles:string[] = [
            path.join(dataPath,"voerka.settings.yaml"),       // 默认配置文件
        ]        
        // 2. 指定模式的配置文件        
        if(mode){
            mode = mode.toLowerCase()
            path.join(dataPath,"voerka.settings.${mode}.yaml")  
        };  

        // 3. 加载配置文件
        let loadedSettingsFiles:string[] = []
        settingFiles
            .map((file:string)=>path.isAbsolute(file) ? file : path.join(cwd,file))                
            .filter(file=>fs.existsSync(file))
            .map(file=>{
                return ()=>{
                    try{
                        let result:any = null
                        if(file.endsWith('.yaml')){
                            result = yaml.load(fs.readFileSync(file,'utf-8')) 
                        }else if(file.endsWith('.json')){
                            result = require(file)
                        }
                        return result
                    }catch(e:any){
                        logger.error("加载配置文件<{}>失败:{}",file,e.stack)
                    }
                }                     
            }).forEach((loader:any)=>deepMerge(values,loader()));

        // 4. 打印已加载的配置文件
        loadedSettingsFiles.forEach(file=>logger.debug("加载配置文件:[{}]",file))        
        return  values         
    }  


    /**
     * 当配置参数发生变化时调用
     * 
     * 当配置数据发生变化时，由子类实现对配置参数的持久化
     * 
     */
    async onUpdate(key:string,value:any){
        const app = this.app as NodejsApplication
        const file = path.join(app.dataPath,"voerka.settings.yaml")
        return new Promise<void>((resolve,reject)=>{
            fs.writeFile(file,yaml.dump(app.settings.items),(error:any)=>{
                if(error){
                    reject(`Error while save settings: ${error.stack}`)
                }else{
                    resolve()
                }                
            })
        })
    }
    /**
     * 用来从本地文件或者数据库中恢复配置参数
     * 
     * 主要是恢复一些可持久化的配置参数，一般可以保存在数据库或者文件中
     * 
     * @param appMeta 
     */
    async restore(mode:string){ 
        const app = this.app as NodejsApplication
        const file = path.join(app.dataPath,`voerka.settings${mode ? `.${mode}` : ''}.yaml`)
        if(fs.existsSync(file)){
            return yaml.load(fs.readFileSync(file).toString())
        }
    }
}
