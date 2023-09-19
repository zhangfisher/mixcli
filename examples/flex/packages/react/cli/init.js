const { BREAK } = require('mixed-cli');
module.exports = (cli)=>{                
    cli.find("init").then(initCommand=>{
      initCommand
          .action((options)=>{      
              if(options.type === "react"){     
                console.log("[React] Run init :",options.type)
                return BREAK
              }
          })
    });        
}     