import { Command } from 'commander';



const command = new Command();


command
    .name('init')
    .description('初始化应用') 
    
module.exports = command