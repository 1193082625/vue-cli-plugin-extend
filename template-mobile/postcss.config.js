/*
 * @Descripttion: 
 * @Author: 王月
 * @Date: 2020-10-27 15:37:06
 * @LastEditors: 王月
 * @LastEditTime: 2020-11-05 09:51:09
 */
module.exports = () => ({
    plugins: [
        require('autoprefixer')(),
        // require('postcss-px2rem')({ remUnit: 75 })
        require('postcss-pxtorem')({
            rootValue: 32,
            propList: ['*'],
            selectorBlackList: ['mint-', 'el-'],
            exclude: /node_modules/i
        })
    ]
});