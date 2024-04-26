/**
 * 服务服务
 *
 */
const { execScript } = require('flex-tools/misc/execScript');
const logsets = require('logsets');
const path = require('node:path');
const { MixCommand } = require('mixcli');
const { getDatabaseContext } = require("./utils")

/**
 * @param {import("mixcli").MixedCli} cli
 */
module.exports = (cli) => {
  const syncCommand = new MixCommand('sync');
  syncCommand
    .description('重新生成@prisma/client,当修改了数据库模型时需要执行此命令')
    .action(async (options) => {
      const { dbContext } = options
      try { 
        const task = logsets.task('生成{}访问库', ['@prisma/client']);
        await execScript(`npx prisma generate --schema=${dbContext.schemaFile}`,{ silent: true });
        task.complete();
      } catch (e) {
        task.error(e.message);
        throw e;
      }
    });
  return syncCommand;
};
