<template>
  <el-aside style="width:15%">
    <div class="logo">
      <transition name="fade">
        <div class v-show="isCollapse">O</div>
      </transition>
      <transition name="fade">
        <div class="title" v-show="!isCollapse">OA系统</div>
      </transition>
    </div>
    <div class="menu">
      <!-- <ul class="c_left_c">
        <li
          :class="{'on':activeOn==item.url}"
          v-for="(item, index) in menuList"
          :key="index"
          @click="goToUrl(item.url)">
          <a href="javascript:void(0)" :class="'c'+(index+1)">{{item.title}}</a>
        </li>
      </ul>-->
      <el-menu
        :default-active="activeOn"
        class="el-menu-vertical-demo"
        background-color="#353d47"
        text-color="#fff"
        :unique-opened="true"
        active-text-color="#ffd04b"
      >
        <el-submenu index="1">
          <template slot="title">
            <i class="fa fa-navicon"></i>
            <span>个人事务</span>
          </template>
          <el-menu-item index="/index/email" @click="goToUrl('/index/email')">
            <i class="fa fa-file-text"></i> 电子邮件
          </el-menu-item>
          <el-menu-item index="/index/notice" @click="goToUrl('/index/notice')">
            <i class="fa fa-file-text"></i> 通知公告
          </el-menu-item>
          <el-menu-item index="/index/schedule" @click="goToUrl('/index/schedule')">
            <i class="fa fa-file-text"></i> 日程安排
          </el-menu-item>
          <el-menu-item index="/index/payroll" @click="goToUrl('/index/payroll')" v-if="roleCode">
            <i class="fa fa-file-text"></i> 工资条
          </el-menu-item>
          <el-menu-item index="/workLog/index" @click="goToUrl('/workLog/index')">
            <i class="fa fa-file-text"></i> 工作日志
          </el-menu-item>
          <el-menu-item index="/index/addressBook" @click="goToUrl('/index/addressBook')">
            <i class="fa fa-file-text"></i> 通讯录
          </el-menu-item>
          <el-menu-item index="/index/file" @click="goToUrl('/index/file')">
            <i class="fa fa-file-text"></i> 个人文件柜
          </el-menu-item>
          <el-menu-item index="/index/shortNote" @click="goToUrl('/index/shortNote')">
            <i class="fa fa-file-text"></i> 便签
          </el-menu-item>
        </el-submenu>
       <el-submenu index="2">
          <template slot="title">
            <i class="fa fa-navicon"></i>
            <span>工作流</span>
          </template>
          <el-submenu index="2-1">
            <template slot="title">
              <i class="fa fa-file-text"></i>
              <span>流程中心</span>
            </template>
            <el-menu-item
              index="/work-flow/indexProcessed"
              @click="goToUrl('/work-flow/indexProcessed')"
            >
              <i class="fa fa-file-text"></i>已处理流程
            </el-menu-item>
            <el-menu-item
              index="/work-flow/indexPendingProcess"
              @click="goToUrl('/work-flow/indexPendingProcess')"
            >
              <i class="fa fa-file-text"></i>待处理流程
            </el-menu-item>
            <el-menu-item
              index="/work-flow/index"
              @click="goToUrl('/work-flow/index')"
            >
              <i class="fa fa-file-text"></i>我的流程
            </el-menu-item>
          </el-submenu>
          <el-submenu index="2-2" v-if="oaRoleCode">
            <template slot="title">
              <i class="fa fa-file-text"></i>
              <span>流程设计</span>
            </template>

            <el-menu-item
              index="/work-flow/workflow-design"
              @click="goToUrl('/work-flow/workflow-design')"
            >
              <i class="fa fa-file-text"></i>流程设计
            </el-menu-item>
          </el-submenu>
          <el-submenu index="2-3" v-if="oaRoleCode">
            <template slot="title">
              <i class="fa fa-file-text"></i>
              <span>表单设计</span>
            </template>
            <el-menu-item index="/work-flow/form-design" @click="goToUrl('/work-flow/form-design')">
              <i class="fa fa-file-text"></i>表单设计
            </el-menu-item>
          </el-submenu>
        </el-submenu>
        <el-submenu index="3">
          <template slot="title">
            <i class="fa fa-tasks"></i>
            <span>知识管理</span>
          </template>
          <el-menu-item index="/publicFile/list" @click="goToUrl('/publicFile/list')">
            <i class="fa fa-file-text"></i> 公共文件柜
          </el-menu-item>
          <el-menu-item index="/publicFile/root" @click="goToUrl('/publicFile/root')">
            <i class="fa fa-file-text"></i> 公共文件柜设置
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </div>
  </el-aside>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Left',
  data () {
    return {
      activeOn: '/index/add-exam',
      roleCode: false,
      oaRoleCode: false
    }
  },
  mounted () {
    this.activeOn = this.$route.path
    if (this.cookiesObj && this.cookiesObj.roleCode == 'SchoolAdmin') {
      this.roleCode = true
    }
    if (this.cookiesObj && this.cookiesObj.roleCode == 'SchoolAdmin') {
      this.oaRoleCode = true
    }
    if (this.cookiesObj && this.cookiesObj.roleCode == 'Admin') {
      this.oaRoleCode = true
    }
  },
  methods: {
    goUrl (path) {
      // 页面缓存配置
      var index = this.keepAlivePath.indexOf(path)
      if (this.activeIndex != path && index > -1) {
        var arr = JSON.parse(JSON.stringify(this.keepAlivePage))
        arr[index] = ''
        this.$store.commit('common/KEEP_ALIVE', arr)
        // console.log(this.keepAlive)
      }
      this.$router.push(path)
    },
    getMenuData () {
      this.$store.dispatch('user/GetMenu').then(res => {
        if (res.success) {
          this.menu = res.data
          // this.filterMenu()
        } else {
          console.log(res.message)
        }
      })
    },
    filterMenu () {
      var menuList = this.menu
      var result = []
      var obj = {}
      for (let i = 0; i < menuList.length; i++) {
        obj = menuList[i]
        var arr = []
        for (let j = 0; j < menuList[i].children.length; j++) {
          if (menuList[i].children[j].show) {
            arr.push(menuList[i].children[j])
          }
        }
        obj.children = arr
        result.push(obj)
      }
      this.menuList = result
    },
    goToUrl (path, type) {
      this.activeOn = path
      if (type === 2) {
        location.href = path
      } else {
        this.$router.push(path)
      }
    },
    getCookie (name) {
      var strCookie = document.cookie
      var arrCookie = strCookie.split('; ')
      for (var i = 0; i < arrCookie.length; i++) {
        var arr = arrCookie[i].split('=')
        if (arr[0] == name) {
          return arr[1]
        }
      }
      return null
    }
  },
  computed: {
    ...mapGetters(['isCollapse', 'menu', 'keepAlive', 'keepAlivePage', 'keepAlivePath', 'cookiesObj']),
    activeIndex () {
      return this.$route.path
    }
  }
}
</script>
<style lang="scss">
.logo {
  width: 100%;
  height: 60px;
  line-height: 60px;
  background: #22a7f0;
}
.title {
  background: url(./images/113.png) no-repeat left center;
  margin: 0 21px;
  color: #fff;
  font-size: 16px;
  padding-left: 30px;
}
.el-menu {
  border-right: none !important;
}
.isCollapse .el-menu-item span,
.isCollapse .el-submenu span {
  opacity: 0;
  transition: all 0.3s ease;
}
.c_left_t h1 {
  background: url(./images/113.png) no-repeat left center;
  margin: 21px;
  color: #fff;
  font-size: 16px;
  padding-left: 30px;
}
.c_left_c li {
  overflow: hidden;
  padding: 16px 21px;
  cursor: pointer;
}

.c_left_c a.c1 {
  background: url(./images/home.png) no-repeat left center;
  color: #fff;
  padding-left: 20px;
  display: inline-block;
}

.c_left_c a.c2 {
  background: url(./images/wifi-b.png) no-repeat left center;
  color: #fff;
  padding-left: 20px;
  display: inline-block;
}

.c_left_c a.c3 {
  background: url(./images/dw-b.png) no-repeat left center;
  color: #fff;
  padding-left: 20px;
  display: inline-block;
}

.c_left_c a.c4 {
  background: url(./images/kq-b.png) no-repeat left center;
  color: #fff;
  padding-left: 20px;
  display: inline-block;
}

.c_left_c a.c5 {
  background: url(./images/sb-b.png) no-repeat left center;
  color: #fff;
  padding-left: 20px;
  display: inline-block;
}
.c_left_c a.c6 {
  background: url(./images/dw-b.png) no-repeat left center;
  color: #fff;
  padding-left: 20px;
  display: inline-block;
}
.c_left_c a.c7 {
  background: url(./images/sb-b.png) no-repeat left center;
  color: #fff;
  padding-left: 20px;
  display: inline-block;
}
.c_left_c a.c8 {
  background: url(./images/dw-b.png) no-repeat left center;
  color: #fff;
  padding-left: 20px;
  display: inline-block;
}
.c_left_c a.c9 {
  background: url(./images/dw-b.png) no-repeat left center;
  color: #fff;
  padding-left: 20px;
  display: inline-block;
}
.c_left_c a.c10 {
  background: url(./images/dw-b.png) no-repeat left center;
  color: #fff;
  padding-left: 20px;
  display: inline-block;
}
.c_left_c li.on {
  background: #fff;
}

.c_left_c .on a.c1 {
  background: url(./images/home_l.png) no-repeat left center;
  color: #22a7f0;
}

.c_left_c .on a.c2 {
  background: url(./images/wifi-l.png) no-repeat left center;
  color: #22a7f0;
}

.c_left_c .on a.c3 {
  background: url(./images/dw-l.png) no-repeat left center;
  color: #22a7f0;
}

.c_left_c .on a.c4 {
  background: url(./images/kq-l.png) no-repeat left center;
  color: #22a7f0;
}

.c_left_c .on a.c5 {
  background: url(./images/sb-l.png) no-repeat left center;
  color: #22a7f0;
}
.c_left_c .on a.c6 {
  background: url(./images/dw-l.png) no-repeat left center;
  color: #22a7f0;
}
.c_left_c .on a.c7 {
  background: url(./images/sb-l.png) no-repeat left center;
  color: #22a7f0;
}
.c_left_c .on a.c8 {
  background: url(./images/dw-l.png) no-repeat left center;
  color: #22a7f0;
}
.c_left_c .on a.c9 {
  background: url(./images/dw-l.png) no-repeat left center;
  color: #22a7f0;
}
.c_left_c .on a.c10 {
  background: url(./images/dw-l.png) no-repeat left center;
  color: #22a7f0;
}
.el-menu-item i.fa {
  margin-top: -3px;
  margin-right: 4px;
}
</style>
