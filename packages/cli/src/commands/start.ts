const { Command } = require('commander');



const command = new Command();


command
    .name('start')
    .description('运行应用') 
    
module.exports = command