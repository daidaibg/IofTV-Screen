/*
 * @Author: daidai
 * @Date: 2021-12-06 10:58:24
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-08-02 14:56:12
 * @FilePath: \web-pc\src\config\UtilVar.js
 */
let UtilVar = {
    ENC: false, //返回结果是否加密
    baseUrl: `http://localhost:8888`,
    code: 401,
}
const runtimeType = {
    production: () => {
        /**
         * 通过打包配置打某个环境的api地址
         */
        UtilVar.baseUrl = `http://localhost:8888`
    },
    //测试环境
    test:()=>{

    },
    //开发环境
    development: () => {
      
    },
    
}
console.log(process.env);

//通过打包配置打某个环境的api地址
runtimeType[process.env.VUE_APP_URL_ENV]()
export default UtilVar

