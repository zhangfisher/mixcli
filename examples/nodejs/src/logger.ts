import { VoerkaApplication } from "@voerka/core"
import { assignObject } from "flex-tools/object/assignObject"
import { get as getByPath } from 'flex-tools/object/get'; 
import FileTransport from "@voerkalogger/file"
import HTTPTransport from "@voerkalogger/http"
import ColorizedConsoleTransport from "@voerkalogger/console"
import path from "path";
import type { NodejsApplication } from "./app";

/**
 * 初始化日志输出
 */
export function initLogger(app:VoerkaApplication){
    const thisApp = app as NodejsApplication
    // 1. 读取日志配置参数
    const logSettings = assignObject({
        output:['console','file']
    },thisApp.settings.items.logger)            
    logger.options = logSettings
    const output = logger.options.output as string[]

    // 2. 安装日志文件输出
    if (output.includes("file")) {
        let outputPath = path.join(thisApp.dataPath,"logs")
        logger.use("file", new FileTransport({
            location:outputPath,
            ...getByPath(logSettings,'file')
        }));
    }
    // 3. 安装日志http输出
    if (output.includes("http")) {
        logger.use("http", new HTTPTransport(getByPath(logSettings,'http')));
    }
    // 4. 安装日志控制台输出
    logger.use("console",new ColorizedConsoleTransport())

}