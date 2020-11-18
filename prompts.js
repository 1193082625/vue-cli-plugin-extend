/*
 * @Author: your name
 * @Date: 2020-11-17 13:32:14
 * @LastEditTime: 2020-11-18 15:34:51
 * @LastEditors: Please set LastEditors
 * @Description: 本质上是一个对话配置文件
 * @FilePath: \base-jk-cli\cli-extend\prompts.js
 */
module.exports = [
    {
        type: 'list', // 即类型为 选择项
        name: 'projectType', // 名称，作为下面 generator.js导出 函数 options 的键
        message: '请选择你要生成的项目类型', // 提示语
        choices: [
            { name: 'web', value: 'web' },
            { name: 'mobile', value: 'mobile' }
        ],
        default: 'web',
    },
    {
        type: 'confirm',
        name: 'echarts',
        message: `Use ECharts for project?`
    },
    {
        type: 'confirm',
        name: 'vueCropper',
        message: `Use vue-cropper for project?`,
        when: function (answers) {
            return answers.projectType == 'web'
        }
    },
    {
        type: 'confirm',
        name: 'elementUI',
        message: `Use Element-ui for project?`,
        when: function (answers) {
            return answers.projectType == 'mobile'
        }
    },
    {
        type: 'confirm',
        name: 'weixinJSSDK',
        message: `Use weixin-js-sdk for project?`,
        when: function (answers) {
            return answers.projectType == 'mobile'
        }
    },
    {
        type: 'confirm',
        name: 'needRem',
        message: `is project need rem?`,
        when: function (answers) {
            return answers.projectType == 'mobile'
        }
    }
]