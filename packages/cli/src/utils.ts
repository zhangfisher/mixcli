import artTemplate from "art-template"
import fs from "fs-extra"
import path  from "node:path"
import { promisify }   from "flex-tools/func/promisify"
import logsets from "logsets"
import { Option } from "commander"
/**
 * 
 * 在控制台输出一个字符串
 * 本方法会将字符串中的每一行空格去掉
 * 
 * @remarks
 * 
 * outputStr(String.raw`
 *     a
 *       b`)
 * 
 * 会输出
 * a
 *   b
 *
 * 此功能可以用于输出多行字符串时，保持代码的缩进格式，而不会影响输出结果
 * 
 * @param str : 要输出的字符串
 * @param vars : 用于替换字符串中的变量
 * 
 */
export function outputStr(str:string,vars?:Record<string,any> | any[]){ 
    logsets.log(fixIndent(str),vars)
}

/**
 * 修正多行字符串的缩进
 * 
 * @param text 
 * @param indent 
 * @returns 
 */
export function fixIndent(text:string,indent?:boolean | number):string{
    let indentValue = (indent==undefined || indent===true) ? 0 : (typeof(indent)=='number' ? indent : -1)
    if(indentValue==-1) return text // 不修正缩进
    let lines:string[] = text.split("\n")
    let minSpaceCount = lines.reduce<number>((minCount,line,index)=>{
        if(index==0) return minCount
        const spaceCount = line.match(/^\s*/)?.[0].length || 0
        return Math.min(minCount,spaceCount)
    },9999)
    lines = lines.map(line=>line.substring(minSpaceCount))
    return lines.join("\n")
}

export function addPresetOptions(command:any){
    let option  = new Option("--no-prompts","禁用所有交互提示")
    option.hidden = true
    command.addOption(option)
    option  = new Option("--debug-cli","显示调试信息")
    option.hidden = true
    command.addOption(option)
}


/**
 * 是否命令行中包含了--debug-cli选项
 */
export function hasDebugCliOption(){
    return process.argv.includes("--debug-cli")
}

export const fileExists = promisify(fs.exists,{
    parseCallback:(results)=>{
        return results[0]
    }
})
export const readFile = promisify(fs.readFile)
export const writeFile = promisify(fs.writeFile)
export const mkdir = promisify(fs.mkdir)

/**
 * 基于artTemplate模板生成文件
 * 
 * @param {*} tmplFile 
 * @param {*} vars 
 */
export async function createFileByTemplate(targetFile:string,tmplFile:string,vars:Record<string,any>={}){
    tmplFile=path.isAbsolute(tmplFile)? tmplFile : path.join(process.cwd(),tmplFile)
    if(!fs.existsSync(tmplFile)){
        throw new Error("模板文件不存在:"+tmplFile)
    }
    targetFile=path.isAbsolute(targetFile)? targetFile : path.join(process.cwd(),targetFile)
    const outPath = path.dirname(targetFile)
    if(!await fileExists(outPath)){
        await mkdir(outPath,{recursive:true})
    }    
    const template = artTemplate(tmplFile,await readFile(tmplFile,{encoding:"utf-8"}));    
    await writeFile(targetFile,template(vars),{encoding:"utf-8"})
    return targetFile
}

/**  
 * 创建目录  
 * 
 *  
 * 
 * @param {String[]} dirs 要创建的目录列表，类型为字符串数组  
 * @param callback      创建目录过程中的回调函数，类型为异步函数，接收一个参数 dir，表示当前正在创建的目录  
 * @returns 该函数返回一个 Promise 对象，表示创建目录的操作是否完成  
 */
export async function mkDirs(dirs:string[],{callback,base}:{callback?:Function,base?:string}){
    if(!Array.isArray(dirs)) throw new Error("dirs参数必须为字符串数组")
    for(let dir of dirs){
        if(!path.isAbsolute(dir)) dir = path.join(base || process.cwd(),dir)
        if(typeof(callback)=='function') callback(dir)
        await mkdir(dir,{recursive:true})
    }
}