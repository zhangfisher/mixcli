import  { MixCommand } from "../../../src" 


const initOptions = {
    languages: ['zh-CN', 'en-US'],
    reset:true,
    languageDir: "src/languages2",
    moduleType: "umd",
}
let selectLanguages:any[] = []

export default ()=>{    
    const command = new MixCommand("i18n");
    command
        .description("初始化VoerkaI18n支持")
        .enablePrompts()
        .initial(initOptions)        
        .option("-m, --module-type <type>", "模块类型", {
            default: "esm",
            choices: ["esm", "cjs", "umd", "system", "amd"],
            prompt: "select",
        })
        // .option("-r, --reset","重新初始化",{default:false,prompt:false})        
        // .option("-d, --language-dir [path]", "语言目录", {
        //     default: "src/languages",
        //     prompt : true,
        // })
        // .option("--library", "是否开发库工程")
        // .option("-l, --languages <tags...>", "选择支持的语言", {
        //     prompt: {
        //         type   : "multiselect",
        //         min    : 2,
        //         choices: [
        //             { title: "简体中文", value: "zh-CN" },
        //             { title: "英文", value: "en-US" },
        //             { title: "日文", value: "ja-JP" },
        //             { title: "韩文", value: "ko-KR" },
        //             { title: "法文", value: "fr-FR" },
        //             { title: "西班牙文", value: "es-ES" }
        //         ],
        //     },
        // })        
        // .option("--defaultLanguage <tag>", "默认语言", {
        //     prompt: {
        //         type    : "select",
        //         initial : (_, answers) => {
        //             return answers.languages[0].value;
        //         },
        //         choices : (preLangs) => {
        //             selectLanguages = preLangs
        //             return preLangs
        //         },
        //     },
        // })
        // .option("--activeLanguage <tag>", "激活语言", {
        //     prompt: {
        //         type    : "select",
        //         choices : (_, answers) => {
        //             return selectLanguages as any[]
        //         },
        //     },
        // })
        // .option("-t, --typescript", "启用Typescript", {
        //     default: true,
        //     prompt: true,
        // }) 
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

 
