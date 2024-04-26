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
    cli.find("build").then(devCommand=>{
        devCommand.action(async function(){                    
            const entryFile = getPackageEntry() 
            child_process.execSync('tsup',{stdio:"inherit"})
        })
    })    
} 
 