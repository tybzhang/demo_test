import {get, post} from './axios'

// 获取推荐列表
export const getTopfreeapplications = (parameter) => get(`/api/hk/rss/topfreeapplications/limit=${parameter.limit}/json`, parameter)

// 获取APP列表
export const getTopgrossingapplications = (parameter) => get(`/api/hk/rss/topgrossingapplications/limit=${parameter.limit}/json`, parameter)