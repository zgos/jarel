/**
 * @desc   localStroge/sessionStroge缓存
 * @param  {String} key 键名
 * @param  {String} val 键值
 * @param  {Date} time 过期时间
 */

const localStorageApi = {
  // time有效期 默认是半小时传入ms
  set: function (key, val, time = +new Date() + 0.5 * 3600 * 1000) {
    let cacheVal = {
      val: val,
      exp: time
    }
    localStorage.setItem(key, JSON.stringify(cacheVal))
  },
  get: function (key) {
    let cacheVal = localStorage.getItem(key)
    if (!cacheVal) return ''
    let result = JSON.parse(cacheVal)
    if (+new Date() > result.exp) { //缓存过期
      this.remove(key)
      return ''
    }
    return result.val
  },
  remove: function (key) {
    localStorage.removeItem(key)
  },
  clear: function () {
    localStorage.clear()
  }
}

export default localStorageApi