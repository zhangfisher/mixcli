# 自动交互提示

`MixCli`最核心的功能就是基于`prompts`为命令选项提供推断提示类型，自动为命令选项提供合适的提示类型。


## 推断提示类型

[prompts](https://github.com/terkelg/prompts)提供了以下几种提示类型：`text`、`password`、`invisible`、`number`、`confirm`、`list`、`toggle`、`select`、`multiselect`、`autocompleteMultiselect`、`autocomplete`、`date`。

默认情况下，会自动推断提示类型，按以下规则推断：

- 如果指定了`choices`，则推断为`multiselect`或`select`
- 如果声明了`variadic=true`，则推断为`list`
- 开关选项推断为`toggle`或`confirm`
- 数字类型推断为`number`
- 日期类型推断为`date`
- 其他类型推断为`text`

也可以手动指定提示类型。

## 自动交互提示

默认情况下，是否显示选项交互提示是根据以下条件自动推断的：

### 有值输入时

如果命令行已经有值输入，不会显示交互提示。

```ts
const devCommand = new MixCommand();
devCommand.option("-p,--port","运行端口")

// 不显示交互提示，因为已经有值输入值，所以不会显示交互提示
> mycli dev --port 3000             
// 显示交互提示
> mycli dev     
```
### 指定了默认值

**如果没有输入值，但是有默认值，则不会显示交互提示**

```ts
const devCommand = new MixCommand();
devCommand.option("-p,--port","运行端口",{
    default:3000
})
// 不显示交互提示，因为已经有默认值，所以不会显示交互提示
> mycli dev 
```

### prompt=true

如果显式指定`prompt=true`值时，显示交互提示, 交互提示类型会自动推断。

```ts
const devCommand = new MixCommand();
devCommand.option("-p,--port","运行端口",{
    prompt:true
})
```

### prompt=<提示类型>

如果自动推断不正确，也可以显式指定`prompt=<提示类型>`值时，显示交互提示。

```ts
const devCommand = new MixCommand();
devCommand.option("-p,--port","运行端口",{
    prompt:"text",
    prompt:"password",
    prompt:"invisible",
    prompt:"number",
    prompt:"confirm",
    prompt:"list",
    prompt:"toggle",
    prompt:"select",
    prompt:"multiselect",
    prompt:"autocompleteMultiselect",
    prompt:"autocomplete",
    prompt:"date",    
})
```

### prompt=<提示参数>

也可以指定指定`prompt={<PromptObject>}`值时，以便可以对提示进行更多的定制, `PromptObject`类型如下：

```ts
     interface PromptObject<T extends string = string> {
        type: PromptType | Falsy | PrevCaller<T, PromptType | Falsy>;
        name: ValueOrFunc<T>;
        message?: ValueOrFunc<string> | undefined;
        initial?: InitialReturnValue | PrevCaller<T, InitialReturnValue | Promise<InitialReturnValue>> | undefined;
        style?: string | PrevCaller<T, string | Falsy> | undefined;
        format?: PrevCaller<T, void> | undefined;
        validate?: PrevCaller<T, boolean | string | Promise<boolean | string>> | undefined;
        onState?: PrevCaller<T, void> | undefined;
        onRender?: ((kleur: Kleur) => void) | undefined;
        min?: number | PrevCaller<T, number | Falsy> | undefined;
        max?: number | PrevCaller<T, number | Falsy> | undefined;
        float?: boolean | PrevCaller<T, boolean | Falsy> | undefined;
        round?: number | PrevCaller<T, number | Falsy> | undefined;
        instructions?: string | boolean | undefined;
        increment?: number | PrevCaller<T, number | Falsy> | undefined;
        separator?: string | PrevCaller<T, string | Falsy> | undefined;
        active?: string | PrevCaller<T, string | Falsy> | undefined;
        inactive?: string | PrevCaller<T, string | Falsy> | undefined;
        choices?: Choice[] | PrevCaller<T, Choice[] | Falsy> | undefined;
        hint?: string | PrevCaller<T, string | Falsy> | undefined;
        warn?: string | PrevCaller<T, string | Falsy> | undefined;
        suggest?: ((input: any, choices: Choice[]) => Promise<any>) | undefined;
        limit?: number | PrevCaller<T, number | Falsy> | undefined;
        mask?: string | PrevCaller<T, string | Falsy> | undefined;
        stdout?: Writable | undefined;
        stdin?: Readable | undefined;
    }
```

更多`PromptObject`的参数请参考[prompts](https://github.com/terkelg/prompts)文档。


**示例如下：**

```ts
const devCommand = new MixCommand();
devCommand.option("-p,--port","运行端口",{
    prompt: {
        type: "number",
        min:1000,
        max:65535,
    }
})


// 不显示交互提示
> mycli dev --port 3000  

// 显示交互提示
> mycli dev 

```




## 禁用交互提示

### 禁用指定选项

可以通过指定`{prompt:false}`来禁用指定选项的交互提示。

```js{5}
    const devCommand = new MixCommand();
    devCommand
        .name('dev')
        .description('在开发模式下运行应用')
        .option("-p,--port","运行端口",{prompt:false})
        .action(async function (options,cmd){
            
        })
```


### 禁用所有提示

在命令输入时，可以通过指定`--disable-prompts`来禁用所有提示。这优先级最高，会覆盖其他的提示设置。

### 禁用命令的所有提示

```js{5}
    const devCommand = new MixCommand();
    devCommand
        .name('dev')
        .description('在开发模式下运行应用')
        .option("-p,--port","运行端口")
        // 该方法会禁用该命令下的所有交互提示，不影响其他命令
        .disablePrompts()
        .action(async function (options,cmd){
            
        })

```

## 启用命令的所有提示

```js{5}
    const devCommand = new MixCommand();
    devCommand
        .name('dev')
        .description('在开发模式下运行应用')
        // 该方法会禁用该命令下的所有交互提示，不影响其他命令
        .enablePrompts()
        .option("-p,--port","运行端口")        
        .action(async function (options,cmd){
            
        })

``` 