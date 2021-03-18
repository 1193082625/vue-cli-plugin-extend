<!--
 * @Author: ECHO
 * @Date: 2021-02-05 17:54:46
 * @LastEditTime: 2021-03-18 15:12:31
 * @LastEditors: 
 * @Description: 
-->
## vue cli 插件

该插件用于基于vue cli使用--preset快速生成带相关插件的基础项目代码

该代码已上传至github，使用方法如下：

```vue create --preset 1193082625/vue-cli-plugin-extend pro-name```



该插件包含：

#### 默认安装插件

  * good-storage
  * axios
  * jquery
  * vue-router
  * vuex
  * mock
  * eslint（git提交前会先检查代码）
  * less

* web端
  * element（默认安装）
  * ECharts （可选）
  * vue-cropper（可选）
* 移动端
  * vant（默认安装）
  * Element（可选，用于一套代码包含移动和pc的项目）
  * rem（可选）
  * weixin-js-sdk（可选）

 ### 参考地址：

 * https://blog.csdn.net/u012987546/article/details/103972786
 * https://cli.vuejs.org/zh/dev-guide/plugin-dev.html#%E7%AC%AC%E4%B8%89%E6%96%B9%E6%8F%92%E4%BB%B6%E7%9A%84%E5%AF%B9%E8%AF%9D

**目录结构：**

├── template      # 模板文件
├── generator.js  # generator（可选）
├── package.json  
├── preset.json   # 包含 preset 数据的主要文件（必需）
├── prompts.js    # prompt 文件（可选）
├── README.md     # 說明文件
├── index.js      # service 插件
└── ui.js         # Vue UI 集成（可选）







