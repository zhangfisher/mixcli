const { outputStr,FlexCli } = require("flexcli")
const devCommand = require("./dev")
const initCommand = require("./init")
const startCommand = require("./start")

 

const cli = new FlexCli({
    name: "flexcli",
    version: "1.0.0",
    description: "flexcli is a cli tool for creating cli tools",
    before:()=>{
        outputStr(String.raw`
            ____   ____                  __            
            \   \ /   /___   ___________|  | _______   
             \   Y   /  _ \_/ __ \_  __ \  |/ /\__  \  
              \     (  <_> )  ___/|  | \/    <  / __ \_
               \___/ \____/ \___  >__|  |__|_ \(____  /
                                \/           \/     \/`)
    }
})

// cli.register(devCommand)
cli.register(initCommand)
// cli.register(startCommand)


cli.run()


