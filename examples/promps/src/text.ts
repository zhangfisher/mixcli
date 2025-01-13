import { MixCommand } from "../../../src"


export default ()=>{        
    type Options = {
        color: string
    }
    const textCommand = new MixCommand();
    textCommand
        .name('text') 
        .option('-p, --pizza-type <type>', 'flavour of pizza')
        .option('-a, --color-a [color]', '颜色A')
        //  1. 提供默认值时，不会提示
        .option('-b, --color-b [color]', '颜色B', {
            default: 'red'
        })
         // 2. 提供默认值时，强制提示
        .option('-c, --color-c [color]', '颜色C', {
             default: 'red',
             prompt: true
        })
        // 2. 自动推断为text
        .option('-d, --color-d [color]', '颜色D', {
            prompt: true
       })       
       // 3. 可选值,不进行提示
        .option('-e, --color-e <color>', '颜色E', {
            
       })       
       .option('-f, --color-f <color>', '颜色F', {
            prompt: true
       })       
       
       // // 3. 提供默认值时，强制提示，且只能选择指定值
        // .option('-c, --color3 [color]', '颜色', {
        //     default: 'red',
        //     choices: ['red', 'green', 'blue'],
        //     prompt : true
        // })
        // 4. 自动推断为select
     
        .action(async function (options:Options){
            console.log('options: ',JSON.stringify(options))
        })
    return textCommand
} 