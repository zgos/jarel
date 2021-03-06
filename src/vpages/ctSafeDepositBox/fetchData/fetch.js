import md5 from 'md5'
import axios from 'axios'
import { stringify } from 'qs'
import Flash from '@/components/flash'

export const fetch = (url, data)=>{
  let domain = process.domain
  let ishttps = 'https:' == document.location.protocol ? true: false
  if(ishttps){
    domain = domain.replace("http", "https")
  }

  
  // data['v'] = "1.0.0"
  // data['appid'] = "jinr_activity"
  // data['request_no'] = "ctgqyearinvest4ee349fd89af4cc3a1b90c7c6423f05e"
  // // data['timestamp'] = Math.round(new Date().getTime()/1000)
  // data['timestamp'] = 1527240938
  // data = JSON.stringify(data)
	// const dataMd5 = md5(data+"0c83b7cb6fff1fc1782f0e5ed7ff3bb7")
	
	// data = {
	// 	data: data,
	// 	sign: "F71DA9A1E61DCA4A6308B1B210543A88"
	// }

  return new Promise((resolve, reject) =>{
    let instance = axios.create({
      // 新建一个请求实例，配置默认项
      // headers: {'Content-Type': 'application/json'},
      method: 'post',
      // baseURL: 'http://hbnew.dev.jingyugame.com/',
      baseURL: domain,
      timeout: 25000
    })
    instance.interceptors.response.use(response => {
      // 创建拦截器
      response = response.data
      // return hander( response )
      return response
    }, error=> {
      return Promise.reject(error)
    })
    instance({
      // 接口调用走这里,先走拦截器
      method: 'post',
      url: url,
      data: stringify(data)
    }).then(response => {
      // 只要数据格式不出问题，都走这里,非1000200的请求经过拦截器后还是会走这里
      // 这里的response是由下面的handle返回的
      if(typeof(response) === 'string'){
        response = JSON.parse(response)
      }
      resolve(response.data)
    }).catch(error => {
      reject(error)
    })
  })
}

// function hander(res){
//   if(res.status == 10000){
//     return res;
//   }else{
//     Flash(res.data)
//     // 此处返回的数据会resolve到接口的then里面去
//     // return {data: res}
//   }
// }
