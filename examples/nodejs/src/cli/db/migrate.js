/**
 * 服务服务
 *
 */
const { execScript } = require('flex-tools/misc/execScript');
const logsets = require('logsets');
const { MixCommand } = require('mixcli');
const path = require('node:path'); 


/**
 * @param {import("mixcli").MixedCli} cli
 */
module.exports = (cli) => { 
  const migrateCommand = new MixCommand('migrate');

  migrateCommand 
    .description('当修改了数据库模型时执行此命令进行数据库迁移')
    .option('-n, --name <value>', '为本次迁移指定名称')
    .action(async function (options) {
        const {schemaFile}  =options.dbContext  
        const task = logsets.task('执行数据库迁移');
        try {
          await execScript(`npx prisma migrate dev ${options.name ? '--name ' + options.name : ''} --schema=${schemaFile}`);
          task.complete();
        } catch (e) {
          task.error(e.message);
          throw e;
        }
      });

  return migrateCommand;
};
