import { MixCommand } from "../../../src"


export default ()=>{        

    const multiselectCommand = new MixCommand();
    multiselectCommand
        .name('multiselect')
        .description('多选项')
        // .option('-d, --color4 [color]', '颜色', {
        //     default: 'green',
        //     choices: [ 'red', 'green', 'blue' ],
        //     prompt : true
        // })
        // // 5. 自动推断为multiselect
        // .option('-e, --color5 [color...]', '颜色2', {
        //     // default: 'red',
        //     prompt:{
        //         type:'multiselect',
        //         choices: [
        //             { title: 'Red', value: 'red' },
        //             { title: 'Green', value: 'green', selected: true },
        //             { title: 'Blue', value: 'blue' }
        //         ]
        //     }
        // })  
        // .option('-f, --color6 [color]', '颜色3', {
        //     default: 'green',
        //     choices: [ 'red', 'green', 'blue' ],
        //     prompt : "select"
        // })       
        .option('-g, --color7 [color]', '颜色4', {   
            choices: ()=>{
                return [
                    { title: 'Red', value: 'red' },
                    { title: 'Green', value: 'green', selected: true },
                    { title: 'Blue', value: 'blue',description:'蓝色' }
                ]
            },
            prompt : "multiselect"
        })
        .option('-h, --color8 [color]', '颜色5', {   
            required:true,
            choices: ()=>{
                return ['red', 'green', 'blue']
            },
            prompt : {
                type: "multiselect",
                min:1,
            }
        })        
        .option('-i, --color9 [color]', '颜色6', {   
            default: ['green', 'blue'],
            choices: ['red', 'green', 'blue'],
            prompt :"multiselect"
        })
        .action(async function (options){
            console.log('options: ',JSON.stringify(options))
        })
    return multiselectCommand
} 