const { outputStr,MixedCli } = require("mixed-cli")
const devCommand = require("./dev")
const initCommand = require("./init")
const startCommand = require("./start")

 

const cli = new MixedCli({
    name: "mixed-cli",
    title: ["MixedCli commandline tool      Version: {}","1.0.1"],
    version: "1.0.0",
    description: "mixed-cli is a cli tool for creating cli tools",
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


