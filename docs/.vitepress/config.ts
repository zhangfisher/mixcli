import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "MixedCli",
  description: "Create CommandLine Application with Interactive prompts",
  // outDir: '../website',
  base: '/mixed-cli/',
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
      { text: '指南', link: '/guide/' }
    ],

    sidebar: [
      {
        text: '',
        items: [          
          { text: '关于', link: '/about' },
          { text: '快速入门', link: '/get-started' },
          { 
            text: '指南', 
            link: '/guide/',
            items:[
              { text: '创建命令行', link: '/guide/create-cli' },
              { text: '创建命令', link: '/guide/create-command' },
              { text: '推断提示类型', link: '/guide/infer-prompt' },
              { text: '定制提示类型', link: '/guide/custom-prompt' },
              { text: '终端增强组件', link: '/guide/term-ui' },
            ]
        
          },
        ]
      }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/zhangfisher/mixed-cli' }
    ]
  }
})
