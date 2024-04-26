import { MixCli } from "mixcli"
import devCommand from "./dev"
import initCommand from "./init" 

 

const cli = new MixCli({
    name: "mixcli",
    title: ["mixcli commandline tool      Version: {}","1.0.1"],
    version: "1.0.0",
    description: "mixcli is a cli tool for creating cli tools",
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
 
cli.register(devCommand)
cli.register(initCommand) 

cli.run()


