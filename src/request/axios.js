import axios from 'axios'

import router from '@/router'

axios.defaults.timeout = 50000;

// 请求拦截器
axios.interceptors.request.use(
  config => {
    if(config.method.toUpperCase() === 'POST') {
      config.headers['Content-Type'] = 'application/json;charset=utf-8'
    }
    return config
  },
  error => {
    return Promise.error(error)
  })

// 返回拦截器
axios.interceptors.response.use(
    res => {
        const back_data = res.data
        if (back_data.code === 20000){
            router.push('/login')
        }
        return Promise.resolve(res);
    }, 
    error => {
        switch (error.response.status) {
        case 500:
            ElMessage.error('Oops,Server Error.')
            break
        case 404:
            ElMessage.error('Oops, Not Find!')
            break
        case 400:
            // ElMessage.error('Oops, 400!')
            break
        // 其他错误，直接抛出错误提示
        default:
            ElMessage.error(error.message)
        }
        return Promise.reject(error);
    }
);

function f_base_get (url, params) {
    return new Promise((resolve, reject) => {
        axios.get(url, params)
        .then(res => {
            resolve(res.data)
        })
        .catch(err => {
            reject(err)
        })
    })
}

function f_base_post(url, params){
    return new Promise((resolve, reject) => {
      axios.post(url, params)
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
}

//  将Promise 的错误统一捕获
export async function post (url, params) {
    let back = null
    try{
        back = await f_base_post(url, params)
    }catch(e){
        if (e.response.data === 'The CSRF token is missing.'){
            console.log('CSRF token miss, try again')
            back = await post(url, params)
        }
        console.log('async post', e)
    }
    return back
}

export async function get(url, params) {
    let back = null
    try{
        back = await f_base_get(url, params)
    }catch(e){
        console.log('async get', e)
    }
    return back
}