import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "MixCli",
  description: "Create CommandLine Application with Interactive prompts",
  // outDir: '../website',
  base: '/mixcli/',
  markdown: {
    toc: { level: [1, 2,3,4,5] }
  }, 
  themeConfig: {
    outline:{
      level:[2,4],
      label: '目录',
    },
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: '指南', link: '/guide/' },
      {
        text: '开源推荐',
        link: 'https://zhangfisher.github.io/repos/'
      }
    ],
    sidebar: [
      {
        text: '',
        items: [          
          { text: '关于', link: '/about' },
          { text: '快速入门', link: '/get-started' },
          {
            text:"变更历史",
            link:"/CHANGELOG"
          },
          { 
            text: '指南', 
            link: '/guide/',
            items:[
              { text: '创建命令行', link: '/guide/create-cli' },
              { text: '创建命令', link: '/guide/create-command' },
              { text: '命令钩子', link: '/guide/command_hooks' },
              { text: '自动交互提示', link: '/guide/auto-prompts' },
              { text: '定制提示类型', link: '/guide/custom-prompt' },
              { text: '终端增强组件', link: '/guide/term-ui' },
              { text: '工作目录', link: '/guide/work-dirs' },       
              { text: '内置选项', link: '/guide/builtin-options' },              
              { text: '共享上下文', link: '/guide/context' }, 
              { text: '国际化', link: '/guide/i18n' }            
            ]        
          }
        ]
      }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/zhangfisher/mixcli' }
    ]
  }
})
