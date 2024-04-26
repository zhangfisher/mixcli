const path = require("node:path")


/**
 * 在当前项目读取数据库相关信息
 * 
 * @return {Object} 
 * {
 *      path:"绝对路径",
 *      relPath:"相对路径"
 *      schemaFile:"schema.prisma路径"
 *      seedFile:"seed.ts路径"
 * }
 * 
 * 
 */
function getDatabaseContext(options){
    const entry = process.cwd();      
    const dbPath =path.isAbsolute(options.dbPath) ?options.dbPath : path.join(entry,options.dbPath) 
    const relPath = path.isAbsolute(options.dbPath) ? path.relative(entry,options.dbPath) : options.dbPath
    const schemaFile = path.join(dbPath,"schema.prisma")
    const seedFile = path.join(dbPath,"seed.ts")    
    return {
        path:dbPath,
        relPath,
        schemaFile,
        seedFile
    }
}


module.exports = {
    getDatabaseContext 
}