# 定义命令

`FlexCli`基于`commander`，因此可以使用`commander`的所有功能，在`commander`的基础上作了增强，提供了更加友好的命令行开发体验。

## 命令选项

比如在`commander`中，定义一个命令选项提供了两种方式：

```js
program 
    // 无choices 
    .option('-d, --drink <size>', 'drink size')    
    // 需要使用choices时     
    .addOption(new Option('-d, --drink <size>', 'drink size').choices(['small', 'medium', 'large']))
```

而在`FlexCli`中，可以简化为直接这样定义：

```js
    const devCommand = new FlexCommand();
        devCommand.option("-m,--mode <mode>","指定模式",{choices:["development","production","test","debug"]})
```

`FlexCommand`继承自`commander.Command`，因此可以使用`commander`的所有功能,`FlexCommand.option`用来声明命令选项，其参数与`commander.Command.option`一致，但是`FlexCommand.option`提供了更加友好的方式来定义命令选项。


```ts
class FlexCommand extends Command{
    option(flags: string, description?: string | undefined,defaultValue?:any ): this
    option(flags: string, description?: string | undefined,options?:FlexOptionParams ): this{
}

```

`FlexOptionParams`定义如下：

```ts
export interface FlexOptionParams extends IPromptableOptions{
    required?: boolean;                         // A value must be supplied when the option is specified.
    optional?: boolean;                         // A value is optional when the option is specified.
    default?:PromptParamDefaultValue            // 默认值
    choices?:string[]                           // 选项值的可选值
    prompt?:InputPromptParam                    // 交互提示信息配置
    validate?:(value: any) => boolean
    defaultDescription?:string          // 默认值的描述    
    conflicts?:string | string[]
    env?:string
    argParser?:<T>(value: string, previous: T) => T 
    hideHelp?:boolean
    mandatory?: boolean 
    implies?:{[key:string]:any}  
}

```

`FlexOptionParams`本质上仅是对`commander.Option`的一个封装，在此基础上扩充了一个参数`prompt`，用于**定义命令选项使用哪一种交互提示信息。**
