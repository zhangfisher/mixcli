import { MixCommand } from "../../../src"


export default ()=>{        

    const selectCommand = new MixCommand();
    selectCommand
        .name('select')
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
            choices: (pre,answers)=>{
                return [
                    { title: 'Red', value: 'red' },
                    { title: 'Green', value: 'green', selected: true },
                    { title: 'Blue', value: 'blue' }
                ]
            },
            prompt : "select"
        })
        .option('-h, --color8 [color]', '颜色5', {   
            choices: (pre,answers)=>{
                return ['red', 'green', 'blue']
            },
            prompt : {
                type: "select"
            }
        })
        .action(async function (options){
            
        })
    return selectCommand
} 