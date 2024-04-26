# 推断提示类型

`MixCli`最核心的功能就是基于`prompts`为命令选项提供推断提示类型，自动为命令选项提供合适的提示类型。

## 启用提示

当命令行选项满足以下条件时，启用交互提示:

- 未提供默认值时，并且命令行无该选项输入时
- 显式指定`FlexOptionParams`参数的`prompt`为`true`时
- 当提供了无效的choices时
- 显式指定`FlexOptionParams`参数的`prompt`时

## 推断提示类型

[prompts](https://github.com/terkelg/prompts)提供了以下几种提示类型：

- text
- password
- invisible
- number
- confirm
- list
- toggle
- select
- multiselect
- autocompleteMultiselect
- autocomplete
- date

当满足以上条件时，代表着该命令行选项需要启用交互提示输入，采用何种提示类型则按以下规则推断：

- 如果指定了`choices`，则推断为`multiselect`或`select`
- 如果声明了`variadic=true`，则推断为`list`


## 指定提示类型

如果自动推断的提示类型不符合预期，可以显式指定`FlexOptionParams`参数的`prompt`来指定提示类型，如下：


- **prompt=true**

强制启用交互提示，自动推断提示类型

- **prompt=false**

禁用交互提示

- **prompt="提示类型"**

指定交互提示类型，如`prompt="select"`，指定为`select`类型.
取值为`text|password|invisible|number|confirm|list|toggle|select|multiselect|autocompleteMultiselect|autocomplete|date`.

- **prompt=PromptObject**

指定完整的提示对象参数，请参阅[prompts](https://github.com/terkelg/prompts)文档。

```js
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

## 示例

```js

 const appCommand = new MixCommand();
    appCommand.name("app")
        .description("以开发模式启动应用")      // 未指定默认值,自动使用text类型提供
        .option("--color <value...>","显示颜色",{choices:["red","yellow","blue"],prompt:"multiselect"})  
        // 未指定默认值,使用自动完成，可以输入任意值
        .option("--filter <value>","文件过滤",{choices:["src","test","debug"],prompt:"autocomplete"})    
        // 未指定默认值,自动使用text类型提供
        .option("-t,--title <value>","标题(不少于5个字符)",{
            validate:(value)=>value.length>=5,
            prompt:{
                type:'text',
                hint:'不少于5个字符'
            }
        })    
        // 指定了默认值且强制提示
        .option("--count <value>","数量",{default:5,prompt:true})
        // 没有指定默认值，使用,分割多个值
        .option("-r,--routes <value...>","路由(多个值采用,分割)")                           
        // 指定了默认值时不进行提示
        .option("-p,--port <port>","指定端口号",3000)                      
        // 有默认值且强制显示提示
        .option("-d,--debug" ,"调试模式",{ default:true,prompt:true })      
        // 自动提示（没有输入且无默认值时）
        .option("-h,--host <host>","指定主机名",{default:"localhost",prompt:true})                            
        // 始终不进行提示取，取决env是可选还是必选
        .option("-e,--env [value]","环境变量",{ prompt:false })                                   
        .option("-m,--mode <mode>","指定模式",{choices:["development","production","test","debug"]})
        .option("-f,--framework [value]","开发框架",{
            choices:[
                {title:"vue",value:1},
                {title:"react",value:2,description:"默认"},
                {title:"angular",value:3}
            ]
        })
```












