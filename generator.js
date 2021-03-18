/*
 * @Author: Echo
 * @Date: 2020-11-17 13:31:56
 * @LastEditTime: 2021-03-18 15:00:30
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \base-jk-cli\vue-cli-plugin-extend\generator.js
 */
/**
 * api : 一个 GeneratorAPI 实例
 * options: 可以先简单理解为 prompts 问题数组的用户输入 组合成的选项对象
 * rootOptions: 整个 preset.json 对象
 */
const path = require('path');
module.exports = (api, options, rootOptions) => {
    // options.projectType 可以访问上面问题数组的第一个对象的值，默认为: 'web'
    // console.log(`Your choice is ${options.projectType}`)
    // console.log(`Your projectName is ${options.projectName}`)

    // render函数把该路径下的 ./template/vue-web1 文件拷贝到默认的vue项目中。
    // 如果文件的路径和文件名称相同的则覆盖，否则是叠加
    if (options.projectType === 'web') {
        api.render('./template-web', { InputOptions: { ...options } })
        // 安裝web端相关依赖
        api.extendPackage({
            dependencies: {
                "@types/good-storage": "^1.1.0",
                "axios": "^0.19.2",
                "element-ui": "^2.7.2",
                "good-storage": "^1.1.0",
                "jquery": "^3.4.1",
                "mockjs": "^1.1.0",
                "vue-class-component": "^7.2.2",
                "vue-property-decorator": "^8.3.0",
                "vue-router": "^3.1.5"
            },
            devDependencies: {
                "@vue/eslint-config-standard": "^4.0.0",
                "eslint-friendly-formatter": "4.0.1",
                "eslint-plugin-html": "^6.0.3",
                "eslint-plugin-import": "^2.20.2",
                "node-sass": "^4.13.1",
                "sass-loader": "^8.0.2",
                "uglifyjs-webpack-plugin": "^2.2.0",
                "webpack-bundle-analyzer": "^3.6.0"
            }
        })
        options.vueCropper && api.extendPackage({
            dependencies: {
                "vue-cropper": "^0.5.4"
            }
        })
    } else {
        api.render('./template-mobile/src', { InputOptions: { ...options } })
        api.render({
            './vue.config.js': './template-mobile/vue.config.js'
        })
        
        // 安裝移动端相关依赖
        api.extendPackage({
            dependencies: {
                "@vant/touch-emulator": "^1.2.0",
                "axios": "^0.21.0",
                "good-storage": "^1.1.1",
                "vant": "^2.10.11",
                "mockjs": "^1.1.0",
                "vue-router": "^3.2.0"
            },
            devDependencies: {
              "babel-plugin-component": "^1.1.1",
              "uglifyjs-webpack-plugin": "^2.2.0",
              "vue-template-compiler": "^2.6.11"
            }
        })
        options.elementUI && api.extendPackage({
            dependencies: {
                "element-ui": "^2.13.2"
            }
        })
        options.weixinJSSDK && api.extendPackage({
            dependencies: {
                "weixin-js-sdk": "^1.6.0"
            }
        })
        if(options.needRem) {
            api.extendPackage({
                devDependencies: {
                    "postcss-pxtorem": "^5.1.1"
                }
            })
            api.render({
                './postcss.config.js': './template-mobile/postcss.config.js',
                './public/rem.js': './template-mobile/rem.js'
            })
        }
    }
    options.echarts && api.extendPackage({
        dependencies: {
            "echarts": "^4.6.0"
        }
    })
    api.extendPackage({
        devDependencies: {
            "husky": "^4.3.0",
            "lint-staged": "^10.5.1"
        },
        // 5.添加自定义的脚本
        scripts: {
            "serve": "vue-cli-service serve",
            "build": "vue-cli-service build"
        },
        "husky": {
            "hooks": {
                "pre-commit": "lint-staged",
            }
        },
        "lint-staged": {
            "src/**/*.{js,json,css,vue}": [
                "eslint --fix",
                "git add"
            ]
        },
    })
    if(options.vueCropper) {
        // main.js 引入图片裁剪依赖
        api.injectImports(api.entryFile, `import VueCropper from 'vue-cropper'`);
    }
    if(options.projectType == 'web' || options.elementUI) {
        // main.js 添加elementUI
        api.injectImports(api.entryFile, `import Element from 'element-ui'`);
        api.injectImports(api.entryFile, `import 'element-ui/lib/theme-chalk/index.css'`);
        api.injectImports(api.entryFile, `import './element-variables.scss'`);
    }
    if(options.projectType === 'mobile') {
        api.injectImports(api.entryFile, `import Vant from 'vant'`);
        api.injectImports(api.entryFile, `import 'vant/lib/index.css'`);
        api.injectImports(api.entryFile, `import '@vant/touch-emulator'`);
    }
    if(options.needRem) {
        api.injectImports(api.entryFile, `import '/rem.js'`);
    }
    api.injectImports(api.entryFile, `import storage from 'good-storage'`);
    // main.js 引入默认样式
    api.injectImports(api.entryFile, `import './assets/styles/normalize.css'`);
    // main.js 引入公共样式表
    api.injectImports(api.entryFile, `import './assets/styles/common.less'`);
    api.injectImports(api.entryFile, `import config from './config'`);
}

module.exports.hooks = (api, options) => {
    api.afterInvoke(() => {
        console.log('----afterInvoke-----');
        const { EOL } = require('os')
        const fs = require('fs')
        let mainPath = path.resolve(process.cwd(), `${api.rootOptions.projectName}/${api.entryFile}`);
        const contentMain = fs.readFileSync(mainPath, { encoding: 'utf-8' })
        const lines = contentMain.split(/\r?\n/g)
    
        const renderIndex = lines.findIndex(line => line.match(/productionTip/))
        if(options.vueCropper) {
            lines[renderIndex] += `${EOL} Vue.use(VueCropper);`
        }
        if(options.projectType === 'web' || options.elementUI) {
            lines[renderIndex] += `${EOL} Vue.use(Element);`
        }
        if(options.projectType === 'mobile') {
            lines[renderIndex] += `${EOL} Vue.use(Vant);`
        }
        lines[renderIndex] += `${EOL} Vue.prototype.$storage = storage;`

        // 生产环境使用mock
        lines[renderIndex] += `${EOL} config.needMock && require('@/mock/')`;

        fs.writeFileSync(mainPath, lines.join(EOL), { encoding: 'utf-8' })
    })
}