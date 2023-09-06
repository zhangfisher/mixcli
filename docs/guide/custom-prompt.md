# 定制提示类型

除了为命令选项自动推断交互提示类型外，也可以手动指定提示类型。


```js
const { FlexCommand } = require('flexcli');

/**
 * @param {import('flexcli').FlexCli} cli
 */
 module.exports = (cli)=>{    
    
  const restartCommand = new FlexCommand();
    restartCommand
        .name("restart")
        .prompt([
            {
                name: "force",
                type: "confirm",
                message: "是否强制重启？",
                default: false
            }
        ])
 }
```

- `prompt`方法添加自定义的`prompt`，每个选项都是一个对象`PromptObject`，对象的属性请参阅[prompts](https://github.com/terkelg/prompts)