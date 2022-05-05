

## 1、项目描述

根据奔跑吧面条的**[vue-big-screen](https://gitee.com/MTrun/big-screen-vue-datav)**开源框架基础上进行修改。

- 项目需要全屏展示（按 F11）。

- 项目部分区域使用了全局注册方式，增加了打包体积，在实际运用中请使用 **按需引入**。

- 项目环境：Vue-cli、DataV、Echarts、Webpack、Npm、Node，axios,mock。

- 请拉取 master 分支的代码，其余分支是开发分支。

- 在项目public目录下存放地图数据合集，根据地市编存放。


友情链接：

1. [Vue 官方文档](https://gitee.com/link?target=https%3A%2F%2Fcn.vuejs.org%2Fv2%2Fguide%2Finstance.html)
2. [DataV 官方文档](https://gitee.com/link?target=http%3A%2F%2Fdatav.jiaminghi.com%2Fguide%2F)
3. [echarts 实例](https://gitee.com/link?target=https%3A%2F%2Fecharts.apache.org%2Fexamples%2Fzh%2Findex.html)，[echarts API 文档](https://gitee.com/link?target=https%3A%2F%2Fecharts.apache.org%2Fzh%2Fapi.html%23echarts)
4. [mock.js官网](http://mockjs.com/examples.html)
5. [axios官网](https://axios-http.com/)

**项目展示** 

![项目展示](https://gitee.com/memeda520/IofTV-Screen/raw/main/public/test.png)

**项目预览地址**

[https://www.daidaibg.com/bigscreen](https://www.daidaibg.com/bigscreen)

**github地址**

[https://github.com/daidaibg/IofTV-Screen](https://github.com/daidaibg/IofTV-Screen)

**Gitee地址**

[https://gitee.com/memeda520/IofTV-Screen](https://gitee.com/memeda520/IofTV-Screen)

##  2、主要文件介绍

| 文件              | 作用/功能                                                    |
| ----------------- | ------------------------------------------------------------ |
| main.js           | 主目录文件，引入 Echart/DataV 等文件                         |
| utils             | 工具函数与 mixins 函数等                                     |
| views/ home.vue   | 项目主结构                                                   |
| views/其余文件    | 界面各个区域组件（按照位置来命名）                           |
| assets            | 静态资源目录，放置 logo 与背景图片                           |
| assets / css/     | 通用 CSS 文件，全局项目快捷样式调节                          |
| components/echart | 所有 echart 图表（按照位置来命名）                           |
| common/...        | 全局封装的 ECharts 和 flexible 插件代码（适配屏幕尺寸，可定制化修改） |
| api/api.js        | 接口封装文件                                                 |
| mock              | 模拟数据接口地址                                             |

## 3、使用介绍

### 安装

```npm
npm install   
```

### 启动

```npm
npm start 
```

[接下来跟面条的差不多还是看面条的文档吧](https://gitee.com/MTrun/big-screen-vue-datav/tree/master#%E4%B8%89%E4%BD%BF%E7%94%A8%E4%BB%8B%E7%BB%8D)

https://gitee.com/MTrun/big-screen-vue-datav/tree/master#%E4%B8%89%E4%BD%BF%E7%94%A8%E4%BB%8B%E7%BB%8D



## 4、公用组件

封装了除面条外个别用到的组件

### 4.1 message消息提示

因为刚开始没想着用第三方提示库，自己简单封装了一个。

注：组件内部目前只有warning，类型，如果需要其他类型自己组件内添加。

因在main.js注册全局可以直接使用，不需要引入

```js
  this.$Message({
      text: res.msg,
      type: 'warning'
  })
//也可以这样
this.$Message.warning(res.msg)
```

| 参数 |   描述   | 默认值  |  类型  | 可选值  |
| :--: | :------: | :-----: | :----: | :-----: |
| text | 提示文字 |    -    | string |    -    |
| type | 弹窗类型 | warning | string | warning |

### 4.2 外边框

因为我的项目外边框几乎一样，还有title,所以封装了此组件。

根据自己需求更改，更换外边框（src\components\item-wrap\item-wrap.vue）下更换。

```vue
<ItemWrap
    title="我是title"
    >
       <div>我是谁？</div>
</ItemWrap>
```

| 参数  | 描述 | 默认值 |  类型  | 可选值 |
| :---: | :--: | :----: | :----: | :----: |
| title | 标头 |   -    | string |   -    |

## 5、全局参数

### 5.1filter

监测数据项统一过滤，保留两位小数。

```vue
{{10.23123|montionFilter }}
```

