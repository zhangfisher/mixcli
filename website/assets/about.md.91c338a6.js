import{_ as s,o,c as a,Q as n}from"./chunks/framework.d3b23cdb.js";const m=JSON.parse('{"title":"关于","description":"","frontmatter":{},"headers":[],"relativePath":"about.md","filePath":"about.md"}'),p={name:"about.md"},e=n(`<h1 id="关于" tabindex="-1">关于 <a class="header-anchor" href="#关于" aria-label="Permalink to &quot;关于&quot;">​</a></h1><p>开发<code>nodejs</code>命令行应用一般会涉及到以下几个方面：</p><ul><li>使用<a href="https://github.com/tj/commander.js" target="_blank" rel="noreferrer">commander</a>进行命令行参数解析</li><li>使用<a href="https://github.com/terkelg/prompts" target="_blank" rel="noreferrer">prompts</a>、<a href="https://github.com/SBoudrias/Inquirer.js" target="_blank" rel="noreferrer">inquirer</a>,<a href="https://github.com/enquirer/enquirer" target="_blank" rel="noreferrer">enquirer</a>等库来提供交互输入提示。</li><li>使用<a href="https://github.com/chalk/chalk" target="_blank" rel="noreferrer">chalk</a>来进行命令行输出的颜色控制。</li></ul><p><code>MixedCli</code>基于<code>commander</code>、<code>prompts</code>和<code>logsets</code>，提供命令行解析、自动交互提示以及终端界面增强等功能。</p><p><strong>主要特性：</strong></p><ul><li>由<a href="https://github.com/tj/commander.js" target="_blank" rel="noreferrer">commander</a>提供命令行解析</li><li>由<a href="https://github.com/terkelg/prompts" target="_blank" rel="noreferrer">prompts</a>提供交互提示</li><li><a href="https://github.com/terkelg/prompts" target="_blank" rel="noreferrer">logsets</a>提供终端输出增强组件</li><li>自动为命令行选项推断生成交互提示</li><li>自动搜索当前依赖下符合条件的命令进行合并，适合于<code>monorepo</code>项目开发</li></ul><h2 id="自动生成交互提示" tabindex="-1">自动生成交互提示 <a class="header-anchor" href="#自动生成交互提示" aria-label="Permalink to &quot;自动生成交互提示&quot;">​</a></h2><p><strong>为命令行命令选项推断生成交互提示</strong></p><p>当我们使用<code>commander</code>开始命令行时，一般会这样写：</p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> { </span><span style="color:#79B8FF;">program</span><span style="color:#E1E4E8;"> } </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">require</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&#39;commander&#39;</span><span style="color:#E1E4E8;">);</span></span>
<span class="line"><span style="color:#E1E4E8;">program </span></span>
<span class="line"><span style="color:#E1E4E8;">    .</span><span style="color:#B392F0;">option</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&quot;-p,--port &lt;port&gt;&quot;</span><span style="color:#E1E4E8;">,</span><span style="color:#9ECBFF;">&quot;指定端口号&quot;</span><span style="color:#E1E4E8;">,</span><span style="color:#79B8FF;">3000</span><span style="color:#E1E4E8;">)                      </span></span>
<span class="line"><span style="color:#E1E4E8;">    .</span><span style="color:#B392F0;">option</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&quot;-d,--debug&quot;</span><span style="color:#E1E4E8;"> ,</span><span style="color:#9ECBFF;">&quot;调试模式&quot;</span><span style="color:#E1E4E8;">,</span><span style="color:#79B8FF;">false</span><span style="color:#E1E4E8;">)      </span></span>
<span class="line"><span style="color:#E1E4E8;">    .</span><span style="color:#B392F0;">option</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&quot;-h,--host &lt;host&gt;&quot;</span><span style="color:#E1E4E8;">,</span><span style="color:#9ECBFF;">&quot;指定主机名&quot;</span><span style="color:#E1E4E8;">)      </span></span>
<span class="line"><span style="color:#E1E4E8;">    .</span><span style="color:#B392F0;">option</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&quot;-m,--mode &lt;mode&gt;&quot;</span><span style="color:#E1E4E8;">,</span><span style="color:#9ECBFF;">&quot;指定模式&quot;</span><span style="color:#E1E4E8;">) </span><span style="color:#6A737D;">// 可选值&quot;development&quot;,&quot;production&quot;,&quot;test&quot;,&quot;debug&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">    .</span><span style="color:#B392F0;">action</span><span style="color:#E1E4E8;">((</span><span style="color:#FFAB70;">options</span><span style="color:#E1E4E8;">)</span><span style="color:#F97583;">=&gt;</span><span style="color:#E1E4E8;">{</span></span>
<span class="line"><span style="color:#E1E4E8;">      console.</span><span style="color:#B392F0;">log</span><span style="color:#E1E4E8;">(options)</span></span>
<span class="line"><span style="color:#E1E4E8;">    })</span></span>
<span class="line"><span style="color:#E1E4E8;">program.</span><span style="color:#B392F0;">parse</span><span style="color:#E1E4E8;">();</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">const</span><span style="color:#24292E;"> { </span><span style="color:#005CC5;">program</span><span style="color:#24292E;"> } </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">require</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&#39;commander&#39;</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">program </span></span>
<span class="line"><span style="color:#24292E;">    .</span><span style="color:#6F42C1;">option</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;-p,--port &lt;port&gt;&quot;</span><span style="color:#24292E;">,</span><span style="color:#032F62;">&quot;指定端口号&quot;</span><span style="color:#24292E;">,</span><span style="color:#005CC5;">3000</span><span style="color:#24292E;">)                      </span></span>
<span class="line"><span style="color:#24292E;">    .</span><span style="color:#6F42C1;">option</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;-d,--debug&quot;</span><span style="color:#24292E;"> ,</span><span style="color:#032F62;">&quot;调试模式&quot;</span><span style="color:#24292E;">,</span><span style="color:#005CC5;">false</span><span style="color:#24292E;">)      </span></span>
<span class="line"><span style="color:#24292E;">    .</span><span style="color:#6F42C1;">option</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;-h,--host &lt;host&gt;&quot;</span><span style="color:#24292E;">,</span><span style="color:#032F62;">&quot;指定主机名&quot;</span><span style="color:#24292E;">)      </span></span>
<span class="line"><span style="color:#24292E;">    .</span><span style="color:#6F42C1;">option</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;-m,--mode &lt;mode&gt;&quot;</span><span style="color:#24292E;">,</span><span style="color:#032F62;">&quot;指定模式&quot;</span><span style="color:#24292E;">) </span><span style="color:#6A737D;">// 可选值&quot;development&quot;,&quot;production&quot;,&quot;test&quot;,&quot;debug&quot;</span></span>
<span class="line"><span style="color:#24292E;">    .</span><span style="color:#6F42C1;">action</span><span style="color:#24292E;">((</span><span style="color:#E36209;">options</span><span style="color:#24292E;">)</span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">      console.</span><span style="color:#6F42C1;">log</span><span style="color:#24292E;">(options)</span></span>
<span class="line"><span style="color:#24292E;">    })</span></span>
<span class="line"><span style="color:#24292E;">program.</span><span style="color:#6F42C1;">parse</span><span style="color:#24292E;">();</span></span></code></pre></div><p>以上代码中<code>--host</code>和<code>--mode</code>是必填项，而<code>--port</code>和<code>--debug</code>是可选项。 正常情况下，如果用户没有指定<code>--host</code>和<code>--mode</code>，则只会简单地提示出错退出。</p><ul><li>我们希望在用户没有指定<code>--host</code>和<code>--mode</code>时，能够自动交互提示用户输入<code>--host</code>和<code>--mode</code>的值。</li><li>如果选择指定了<code>choices</code>，则希望能够自动提示用户选择<code>choices</code>中的值。</li><li>如果是<code>boolean</code>值，则希望能够自动提示用户选择<code>yes</code>或<code>no</code>。</li></ul><p>总之，我们希望交互体验更加友好！</p><p>而<code>MixedCli</code>的作用就是为<strong>命令行应用的选项自动推断生成交互提示</strong>，当用户没有指定<code>--host</code>和<code>--mode</code>选项时,按照一定的推断规则(根据选项的值、choices等)，会自动使用<code>prompts</code>提供的交互提示，提示引导用户输入<code>--host</code>和<code>--mode</code>选项的值。</p><h2 id="多包命令混合" tabindex="-1">多包命令混合 <a class="header-anchor" href="#多包命令混合" aria-label="Permalink to &quot;多包命令混合&quot;">​</a></h2><p><strong>搜索当前依赖下符合条件包的命令进行混合</strong></p><p>在开发基于<code>monorepo</code>的应用时，我们需要配套开发一个<code>cli</code>应用，一般我们会单独创建一个包位于<code>packages/cli</code>，然后在<code>package.json</code>中配置<code>bin</code>字段，然后在<code>bin</code>目录下创建一个<code>cli.js</code>文件，然后在<code>cli.js</code>中使用<code>commander</code>来编写命令行应用。</p><div class="language-json vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">json</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#E1E4E8;">{</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#79B8FF;">&quot;name&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">&quot;@myapp/cli&quot;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#79B8FF;">&quot;version&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">&quot;1.0.0&quot;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#79B8FF;">&quot;bin&quot;</span><span style="color:#E1E4E8;">: {</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#79B8FF;">&quot;myapp&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">&quot;bin/cli.js&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">  }</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#005CC5;">&quot;name&quot;</span><span style="color:#24292E;">: </span><span style="color:#032F62;">&quot;@myapp/cli&quot;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#005CC5;">&quot;version&quot;</span><span style="color:#24292E;">: </span><span style="color:#032F62;">&quot;1.0.0&quot;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#005CC5;">&quot;bin&quot;</span><span style="color:#24292E;">: {</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">&quot;myapp&quot;</span><span style="color:#24292E;">: </span><span style="color:#032F62;">&quot;bin/cli.js&quot;</span></span>
<span class="line"><span style="color:#24292E;">  }</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><p>然后，当安装了<code>@myapp/cli</code>后，就可以在命令行中使用<code>myapp</code>命令了。</p><p>现在问题来，假设我们在<code>@myapp</code>这个<code>monorepo</code>工程中，还存在<code>@myapp/core</code>、<code>@myapp/app</code>、<code>@myapp/vue</code>、<code>@myapp/react</code>等包， 并且每个包均提供了相应的命令行命令,我们想实现：</p><ul><li>只安装<code>@myapp/cli</code>就可以启用所有<code>@myapp/*</code>包提供的命令行。</li><li>各个包的命令声明在各自的包中，而不是在<code>@myapp/cli</code>中。比如<code>@myapp/vue</code>包的命令声明在<code>@myapp/vue</code>包中，而不是在<code>@myapp/cli</code>中。</li><li>能按安装的<code>@myapp/*</code>依赖自动扩充<code>@myapp/cli</code>的命令。</li></ul><p><strong>举例：</strong></p><ul><li><code>packages/vue/cli/x.js</code>中声明了一个<code>x</code>命令，</li><li><code>packages/react/cli/y.js</code>中声明了一个<code>y</code>命令，</li></ul><p>当一个应用安装了<code>@myapp/vue</code>后，就可以在命令行中使用<code>myapp x</code>命令了。 当一个应用安装了<code>@myapp/react</code>后，就可以在命令行中使用<code>myapp y</code>命令了。</p><p><code>MixedCli</code>可以让您开发一个<code>cli</code>应用，当安装了<code>@myapp/cli</code>后，启动时可以自动搜索当前工程下符合条件的依赖下的命令进行混合，提供完整动态的命令行。</p>`,25),l=[e];function c(t,r,d,E,y,i){return o(),a("div",null,l)}const q=s(p,[["render",c]]);export{m as __pageData,q as default};