const { MixedCli } = require("mixed-cli") 
const initCommand = require("./init") 
const devCommand = require("./dev")
const cli = new MixedCli({
    name: "flex",
    version: "1.0.0",
    include: /^\@flex\//,  //  [!code ++]
    logo: String.raw`
        ____   ____                  __            
        \   \ /   /___   ___________|  | _______   
         \   Y   /  _ \_/ __ \_  __ \  |/ /\__  \  
          \     (  <_> )  ___/|  | \/    <  / __ \_
           \___/ \____/ \___  >__|  |__|_ \(____  /
                            \/           \/     \/`, 
})
cli.register(initCommand)
cli.register(devCommand)

cli.run() 