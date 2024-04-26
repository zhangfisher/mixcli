/**
 * 
 * 配置应用日志
 * 
 */
import { VoerkaApplication } from "@voerka/core"
import path from "node:path"
import fs from "node:fs"
import { isTest } from 'std-env';
import { NodejsSettingLoader } from './settings';
import { NodejsEnvironment } from './env';
import { initLogger } from "./logger";
import dotenv from "dotenv"
import dotenvExpand  from "dotenv-expand"
dotenvExpand.expand(dotenv.config())

export class NodejsApplication extends VoerkaApplication{     
    static env = new NodejsEnvironment()
    static settingLoader = NodejsSettingLoader  
    dataPath:string       
    
    /**
     * 应用引导时调用
     */
    bootstrap(){
        logger.info("Voerka Application for Nodejs")    
        logger.info("Version: {}",this.version)
    }    

    /**
    * 创建数据保存路径，如果不存在则创建
    * 
    * 注意：此时还没有加载配置参数，但是可以读取环境变量
    * 
    * 
    */
    private initDataPath(){      
        // 1. 获取创建数据保存路径  
        let dataPath = this.env.vars['VOERKA_DATA_PATH'] || 'data'
        if(!path.isAbsolute(dataPath)){
           dataPath = path.join(process.cwd(),dataPath)
        }
        // 2. 创建数据保存路径
        if(!fs.existsSync(dataPath)){
            fs.mkdirSync(dataPath)
        }
        this.dataPath = dataPath
        logger.debug("Application data path : {}",[dataPath])
    }

    /**
    * 保存合并后的最终配置到data/veerka.settings.json
    * 供诊断使用
    */
    private saveFinalSettings(){        
        const outputFile = path.join(this.dataPath,`voerka.settings.json`)
        fs.writeFileSync(outputFile,JSON.stringify(this.settings.items,null,4))
    }
    created(): void {
        this.initDataPath()
    }
    /**
    * 此时应用的配置已经加载完成
    * 在此可以使用最新的配置参数来进行一些初始化操作
    */
	ready(): void {       
        try{
            initLogger(this)
            this.saveFinalSettings()
        }catch(e:any){
            logger.error("Error while ready application<nodejs>: <{}>",[e.stack])
        }
    }
    stopped(){        
        if(!isTest){ 
            setTimeout(()=>process.exit(0),500)
        }
    }
}