# 禁用交互提示

## 禁用指定选项

可以通过指定`{prompt:false}`来禁用指定选项的交互提示。

```js{5}
    const devCommand = new MixedCommand();
    devCommand
        .name('dev')
        .description('在开发模式下运行应用')
        .option("-p,--port","运行端口",{prompt:false})
        .action(async function (options,cmd){
            
        })
```


## 禁用所有提示

在命令输入时，可以通过指定`--disable-prompts`来禁用所有提示。这优先级最高，会覆盖其他的提示设置。

## 禁用命令的所有提示

```js{5}
    const devCommand = new MixedCommand();
    devCommand
        .name('dev')
        .description('在开发模式下运行应用')
        .option("-p,--port","运行端口")
        // 该方法会禁用该命令下的所有交互提示，不影响其他命令
        .disablePrompts()
        .action(async function (options,cmd){
            
        })

```

