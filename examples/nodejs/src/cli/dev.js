/**
 * 开发模式下运行微服务应用
 * 
 * 
 *  "ts-node -P ./tsconfig.json ./node_modules/moleculer/bin/moleculer-runner.js --config ./src/moleculer.config.ts --hot --repl ./src/services/index.ts
 */


const child_process = require('child_process');
const {getPackageEntry} = require("flex-tools/package/getPackageEntry")
 /**
 * @param {import("mixcli").MixedCli} cli
 */
 module.exports =(cli)=>{
    cli.find("dev").then(devCommand=>{
        devCommand.action(async function(){                    
            const entryFile = getPackageEntry()
            const cmd = `ts-node -P ./tsconfig.json ${entryFile}`
            console.log("Run: ",cmd)
            child_process.execSync(cmd,{stdio:"inherit"})
        })
    })    
} 
 