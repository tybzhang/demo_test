# 技术栈

vue3 + vite + vant + sass + axios  

# 项目运行
node版本18.3以上  

## 安装依赖
npm install  

## 项目启动
npm run dev  

## 打包
npm run build  



# 项目配置
vite.config.js

server -> port 端口号修改  
server -> proxy 修改接口请求的路径配置   


# 项目目录
|-- demo
    |-- index.html
    |-- jsconfig.json
    |-- package.json    依赖  
    |-- README.md
    |-- vite.config.js   项目配置  
    |-- public
    |   |-- favicon.ico     网站ico图标
    |-- src
        |-- App.vue 
        |-- main.js
        |-- assets          静态资源  
        |   |-- images      图片 
        |   |-- scss        样式 
        |       |-- base.css    公共样式 
        |       |-- main.css    公共样式 
        |       |-- mixin.scss  混入样式
        |-- components          公共组件 
        |-- request             网络请求 
        |   |-- api.js          接口定义文件 
        |   |-- axios.js        网络请求封装 
        |-- router              路由配置
        |   |-- index.js
        |-- views               页面
            |-- error.vue       404
            |-- index.vue       首页
