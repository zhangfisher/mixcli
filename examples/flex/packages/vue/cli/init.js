const { BREAK } = require('mixcli');
module.exports = (cli)=>{                
    cli.find("init").then(initCommand=>{
      initCommand
          .action((options)=>{      
              if(options.type === "vue"){     
                console.log("[vue] Run init :",options.type)
                //return BREAK
              }
          })
    });        
}     