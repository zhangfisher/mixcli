 import logsets from "logsets" 


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

/**
 * 增加内置选项
 * @param command 
 */
export function addBuiltInOptions(command:any){    
    command.option("--work-dirs <values...>","指定工作目录",{hidden:true,optional:true,required:true,prompt:false})
    command.option("--disable-prompts","禁用所有交互提示",{hidden:true,prompt:false}) 
    command.option("--debug-cli","显示调试信息",{hidden:true,prompt:false})
}


/**
 * 是否命令行中包含了--debug-cli选项
 */
export function isDebug(){
    return process.argv.includes("--debug-cli")
}


export function isDisablePrompts(){    
    return process.argv.includes("--disable-prompts")
}

/**
 * 打印调试信息
 * @param message 
 * @param args 
 */
export function outputDebug(message:string,...args:any[]){    
    let vars = (args.length == 1 && typeof(args[0])=='function') ? args[0]() : args
    if(isDebug()) logsets.log(`[MixCli] ${message}`,...vars)
}
 

export function showError(e:any){
    if(isDebug()){
        outputDebug("导入命令<>出错:{}",e.stack)
    }else{
        console.error(e)
    }  

}

// 编写一个函数，用于将使用-分隔的字符串转换为驼峰式
export function hyphenToCamelCase(str:string){
    return str.replace(/-([a-z])/g,(_,letter)=>letter.toUpperCase())
}

export function getId(){
    return Math.random().toString(36).substr(2)
}


export async function importModule(file:string){
    let module 
    try{
        module = require(file)
    }catch(e:any){ 
        const cmd = await import(`file://${file}`)
        module = cmd.default   
        throw e
    }
    return module
}
