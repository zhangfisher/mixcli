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
  const seedCommand = new MixCommand('seed');
  seedCommand
    .description('导入种子数据')
    .action(async function (options) {
      const { dbContext } = options
      const task = logsets.task(['导入种子数据: {}', dbContext.seedFile]);
      try {
        await execScript(`ts-node ${dbContext.seedFile}`, { silent: true });
        task.complete();
      } catch (e) {
        task.error(e.message);
        throw e;
      }
    });
  return seedCommand;
};
