const { outputStr,FlexCli } = require("flexcli")
const devCommand = require("./dev")
const initCommand = require("./init")
const startCommand = require("./start")

 

const cli = new FlexCli({
    name: "flexcli",
    title: "Flexcli commandline tool",
    version: "1.0.0",
    description: "flexcli is a cli tool for creating cli tools",
    include: /^\@flex\//, 
    // 显示logo
    logo: String.raw`
        ____   ____                  __            
        \   \ /   /___   ___________|  | _______   
         \   Y   /  _ \_/ __ \_  __ \  |/ /\__  \  
          \     (  <_> )  ___/|  | \/    <  / __ \_
           \___/ \____/ \___  >__|  |__|_ \(____  /
                            \/           \/     \/`,
    // before:()=>{
    //     console.log("root before")      
    // }
})

// cli.register(devCommand)
cli.register(devCommand)
// cli.register(startCommand)


cli.run()


