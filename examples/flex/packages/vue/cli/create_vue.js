const { MixedCommand } = require('mixed-cli');

/**
 * @param {import('mixed-cli').MixedCli} cli
 */
module.exports = (cli)=>{           
    cli.find("init").then((initCommand)=>{
      const initVueCommand = new MixedCommand("vue");
        initVueCommand
          .description("创建Vue应用")  
          .option("-a, --app <value>", "应用名称",{validate:(value)=>value.length>0})                           
          .action((options)=>{            
              console.log("创建Vue应用:",options.app)
          })
        initCommand.addCommand(initVueCommand)
    })    
} 