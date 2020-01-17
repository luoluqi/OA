import CryptoJS from 'crypto-js'
const mixinsFun = {
  data () {
    return {
      filePath: 'http://192.168.80.105/FileCenter',
      permission: {
        view: 'view',
        add: 'add',
        edit: 'edit',
        delete: 'delete'
      }
    }
  },
  created () {
  },
  methods: {
    handleConfirm (msg, callback) {
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        callback()
      }).catch(() => {         
      })
    },
    tip (msg, type) {
      this.$message({
        message: msg,
        type: type
      })
    },
    handleLoading (interval) {
      const loading = this.$loading({
        lock: 'true',
        text: '加载中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)' 
      })
      setTimeout(() => {
          loading.close()
      }, interval)
    },
    fixHead () {
      // 判断高度菜单列表置顶
      var basic = document.getElementById('basicContainer')
      var menus = document.getElementById('menus')
      var viewCustom = document.getElementById('packView')
      var self = this
      if (menus && typeof menus == 'object' && viewCustom && typeof viewCustom == 'object') {
        basic.addEventListener('scroll', function () {
          if (this.scrollTop > 220) {
            self.isFixed = true
          } else {
            self.isFixed = false
          }
        })
      } else {
        basic.removeEventListener('scroll')
      }
    },
    encryptStr (word, keyStr) {
      keyStr = keyStr == null ? keyStr : 'abcdefgabcdefg12'
      var srcs = CryptoJS.enc.Utf8.parse(word)
      var encrypted = CryptoJS.AES.encrypt(srcs, keyStr)
      return encrypted.toString()
    },
    goUrl (path, queryParams) {
      queryParams = typeof (queryParams) == 'undefined' ? {} : queryParams
      var arr = path.split('/')
      var len = arr.length
      var pathLast = arr[len - 1]
      queryParams.p = this.encryptStr(pathLast)
      this.$router.push({
        path: path,
        query: queryParams
      })
    },
    closeTag (path, status, query) {
      const item = this.tagCurrent[0]
      this.$store.commit('DEL_TAG', item)
      if (status) {
        this.goUrl(path, query)
      } else {
        this.$router.push(path)
      }
    },
    numberFormat (number, decimals, decPoint, thousandsSep) {
      number = (number + '').replace(/[^0-9+-Ee.]/g, '')
      var n = !isFinite(+number) ? 0 : +number
      var prec = !isFinite(+decimals) ? 2 : Math.abs(decimals)
      var sep = (typeof thousandsSep === 'undefined') ? ',' : thousandsSep
      var dec = (typeof decPoint === 'undefined') ? '.' : decPoint
      var s = ''
      var toFixedFix = function (n, prec) {
          var k = Math.pow(10, prec)
          return '' + Math.round(n * k) / k
        }
      s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.')
      var re = /(-?\d+)(\d{3})/
      while (re.test(s[0])) {
        s[0] = s[0].replace(re, '$1' + sep + '$2')
      }

      if ((s[1] || '').length < prec) {
        s[1] = s[1] || ''
        s[1] += new Array(prec - s[1].length + 1).join('0')
      }
      return s.join(dec)
    },
    rmoney (e) {
      if (isNaN(e)) {
        return parseFloat(e.replace(/[^\d-]/g, '')).toFixed(2)
      } else {
        e = e ? parseFloat(e).toFixed(2) : 0
        return e
      }
    },
    setAutoTable (className) {
      var width = parseInt(document.querySelector(className).querySelector('.el-table__body').style.width) + 2
      document.querySelector(className).querySelectorAll('.el-table')[0].style.width = width + 'px'
      document.querySelector(className).querySelectorAll('.el-table')[0].style.maxWidth = 'none'
      document.querySelector(className).querySelectorAll('.el-table')[1].style.width = width + 'px'
      document.querySelector(className).querySelectorAll('.el-table')[1].style.maxWidth = 'none'
      document.querySelector(className).querySelector('.auto-table-wrap').style.overflowX = 'auto'
    },
    generateUUID () {
      var d = new Date().getTime()
      if (window.performance && typeof window.performance.now === 'function') {
          d += performance.now() // use high-precision timer if available
      }
      var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
          var r = (d + Math.random() * 16) % 16 | 0
          d = Math.floor(d / 16)
          return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16)
      })
      return uuid
    },
    smalltoBIG (n) {
      var fraction = ['角', '分']
      var digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']
      var unit = [
        ['元', '万', '亿'],
        ['', '拾', '佰', '仟']
      ]
      var head = n < 0 ? '欠' : ''
      n = Math.abs(n)

      var s = ''

      for (var i = 0; i < fraction.length; i++) {
        s += (digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '')
      }
      s = s || '整'
      n = Math.floor(n)

      for (i = 0; i < unit[0].length && n > 0; i++) {
        var p = ''
        for (var j = 0; j < unit[1].length && n > 0; j++) {
          p = digit[n % 10] + unit[1][j] + p
          n = Math.floor(n / 10)
        }
        s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s
      }
      return head + s.replace(/(零.)*零元/, '元').replace(/(零.)+/g, '零').replace(/^整$/, '零元整')
    }
  }
}
const mixinsIndex = {
  install: function (Vue, options) {
    Vue.mixin(mixinsFun)
  }
}

export default mixinsIndex
