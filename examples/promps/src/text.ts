import { MixCommand } from "../../../src"


export default ()=>{        
    type Options = {
        color: string
    }
    const textCommand = new MixCommand();
    textCommand
        .name('text')
        .description('文本') 
        // // .option('-c, --color [color]', '颜色')
        // // 1. 提供默认值时，不会提示
        // .option('-a, --color1 [color]', '颜色', {
        //     default: 'red'
        // })
        // // 2. 提供默认值时，强制提示
        // .option('-b, --color2 [color]', '颜色', {
        //     default: 'red',
        //     prompt: true
        // })
        // // 3. 提供默认值时，强制提示，且只能选择指定值
        // .option('-c, --color3 [color]', '颜色', {
        //     default: 'red',
        //     choices: ['red', 'green', 'blue'],
        //     prompt : true
        // })
        // 4. 自动推断为select
        .option('-d, --color4 [color]', '颜色', {
            default: 'green',
            choices: [ 'red', 'green', 'blue' ],
            prompt:true
        })
        // 5. 自动推断为multiselect
        .option('-e, --color5 [color...]', '颜色', {
            default: 'red',
            prompt:{
                type:'multiselect',
                choices: [
                    { title: 'Red', value: 'red' },
                    { title: 'Green', value: 'green', selected: true },
                    { title: 'Blue', value: 'blue' }
                ]
            }
        })
        .action(async function (options:Options){
            console.log('options: ',JSON.stringify(options))
        })
    return textCommand
} 