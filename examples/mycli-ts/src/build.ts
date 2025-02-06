import  { MixCommand } from "../../../src" 

 
export default ()=>{    
    const command = new MixCommand("build");
    command
        .description("初始化VoerkaI18n支持")
        .disablePrompts() 
        .option('--mode', '翻译模式,取值auto=仅翻译未翻译的,full=全部翻译', {default:'auto'})
        .option('-l, --language <name>', '只翻译指定的语言')        
        .option('-p, --provider <value>', '在线翻译服务提供者名称或翻译脚本文件', {default:'baidu'})
        .option('-m, --max-package-size <value>', '将多个文本合并提交的最大包字节数', {default:200})
        .option('--api-url <url>','API URL')
        .option('--api-id <id>', 'API ID')
        .option('--api-model <name>', 'AI模型名称')
        .option('--api-key <key>', 'API密钥')
        .option('--api <name>', 'API服务名称,明在languages/api.json中',{default:"baidu"})
        .option('-q, --qps <value>', '翻译速度限制,每秒可调用的API次数', {default:1})  
        .option('--prompt <value>', 'languages/prompts文件夹中的提示文件名称',{default:"translate"})  
        .action(async (options) => {
            const opts = Object.assign({
                reset          : false,
                moduleType     : "esm",
                library        : false,
                languages      : [],
                defaultLanguage: "zh-CN",
                activeLanguage : "zh-CN",
                typescript     : true
            }, options);
            console.log("options=",JSON.stringify(opts))     
        });
    return command
}

 
