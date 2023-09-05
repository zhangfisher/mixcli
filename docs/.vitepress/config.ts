import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "FLexCli",
  description: "Create CommandLine Application with Interactive prompts",
  outDir: '../website',
  themeConfig: {
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
              { text: '定义命令', link: '/guide/define-command' },
              { text: '推断提示类型', link: '/guide/infer-prompt' },
              { text: '定制提示类型', link: '/guide/custom-prompt' },
            ]
        
          },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
