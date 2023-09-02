import type { FlexCli } from './cli';
/**
 * 
 * 在当前工程中查找符合FlexCli.prefix约定的命令 
 *  
 * - 读取当前包的package.json
 * - 找出所有以cli.prefix开头的依赖
 * - 加载这些依赖的目录下的匹配cli.pattern的命令
 * - 加载加载这样命令
 * 
 */

const fs = require("node:fs")
const path = require("node:path")
const { getPackageJson } = require("flex-tools/package/getPackageJson")
 
/**
 *  扫描当前工程中所有符合条件的命令
 * 
 * 
 * @param cli 
 * 
 */
export function findCommands(cli:FlexCli){
 
    // 找出
    const { dependencies={},devDependencies={},peerDependencies={} }= getPackageJson()
    const packageNames = [
        ...Object.keys(dependencies),
        ...Object.keys(devDependencies),
        ...Object.keys(peerDependencies)
    ]

    const cliPaths:string[]=[]
    packageNames.filter(name=>name!=="@voerka/cli" && name.startsWith("@voerka/")).forEach(packageName=>{
        try{
            const packageCliPath =path.join(path.dirname(require.resolve(packageName,{paths:[process.cwd()]})),"cli")
            if(fs.existsSync(packageCliPath)){
                cliPaths.push(packageCliPath)
            }
        }catch(e:any){
           console.error(e.stack)
        }    
    })
    //
    cliPaths.forEach(cliPath=>{
        const extendCommands = require(path.join(cliPath,"index.js"))
        try{
            extendCommands(cli)
        }catch(e:any){
            console.warn(`扩展<${cliPath}>命令出错:`,e.stack)
        }
    })
 

}

