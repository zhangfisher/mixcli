# 内置选项

`MixCli`内置了一些隐藏选项：

## --disable-prompts

禁用所有交互提示。

## --debug-cli

打印些调试信息，当你遇到问题时，可以使用这个选项来显示诊断信息。

![](../public/images/debug_cli.png)


## --work-dirs 

指定命令执行时的工作目录，允许指定多个目录，详见[这里](./work-dirs)


**注意**

- 以上命令均为保留命令，您开发时不要使用这些选项。
- `MixCli`内置的选项不会被显示在帮助信息中。 