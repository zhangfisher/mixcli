const cli = require("./")
const { scanAndExtendCommands } = require("./extend")

// 扫描当前工程中所有以@voerka/开头的依赖不，提取其cli路径中注册的命令进行扩展
scanAndExtendCommands(cli)
cli.run()