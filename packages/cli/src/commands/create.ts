import { Command } from 'commander';
import child_process from 'child_process'



const command = new Command();


command
  .name("create") 
  .description('创建模块/服务等应用组件')  

module.exports = command