import { Command } from 'commander';



const command = new Command();


command
    .name('dev')
    .description('在开发模式下运行应用') 
    
module.exports = command