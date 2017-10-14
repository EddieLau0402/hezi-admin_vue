export default {
  /**
   * 设置Cookie
   *
   * @author Eddie
   *
   * @param name
   * @param val
   * @param options
   */
  put (name, val, expireeMins, options = {}) {
    let _cookieCmd = '', selfDomain = document.domain, expiredAt = new Date()

    expiredAt.setMinutes(expiredAt.getMinutes() + expireeMins)

    _cookieCmd += name + '=' + JSON.stringify(val)
    _cookieCmd += ';expires=' + expiredAt.toUTCString()

    if (!_.isEmpty(options)) {
      _cookieCmd += ';domain=' + (options.domain ? options.domain : selfDomain)
      _cookieCmd += options.secure ? ';secure' : ''
    } else {
      _cookieCmd += ';domain=' + selfDomain
    }

    console.log('>>>> show set cookie command: ', _cookieCmd)

    window.document.cookie = _cookieCmd

    return
  },

  /**
   * 获取Cookie
   *
   * @author Eddie
   *
   * @param key
   */
  get (key) {
    let arr = [], reg = new RegExp("(^| )" + key + "=([^;]*)(;|$)")
    if (arr = window.document.cookie.match(reg)) {
      return JSON.parse(arr[2])
    }
    return null
  },

  /**
   * 删除Cookie
   *
   * @author Eddie
   *
   * @param key
   */
  del (key) {
    this.put(key, '', -1)
  }

}
