
// const { MixCommand } = require('mixcli');

// /**
//  * @param {import('mixcli').mixcli} cli
//  */
//  module.exports = (cli)=>{        
//     const pauseCommand = new MixCommand();
//     pauseCommand
//         .name("pause")
//         .description("暂停应用1")
//         .option("-t, -time <time>","暂停时间")
//         .action(()=>{
//             console.log("pause app")
//         })
//     return pauseCommand
//  }

 
import { MixCommand } from 'mixcli'

export default (cli)=>{        
    const pauseCommand = new MixCommand();
    pauseCommand
        .name("pause-esm")
        .description("暂停应用ESM")
        .option("-t, -time <time>","暂停时间")
        .action(()=>{
            console.log("pause app")
        })
    return pauseCommand
 }