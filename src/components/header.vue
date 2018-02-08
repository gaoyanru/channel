<template lang="html">
  <div class="header">
  	<el-menu class="el-menu-demo menu-style" mode="horizontal" @select="handleSelect">
      <div class="pull-right">
      	<el-submenu index="1">
          <template slot="title">{{userInfo.RealName || userInfo.RoleName}}</template>
          <el-menu-item index="1-1">修改密码</el-menu-item>
          <el-menu-item index="1-2">退出登陆</el-menu-item>
        </el-submenu>
      </div>
      <!-- <div class="pull-right info">
        <span>欢迎 {{userInfo.RoleName}}：</span>
        <span>{{userInfo.RealName}} 进入！</span>
      </div> -->
      <h4 @click="goMainHtml" class="bg" style="width: 250px">
        渠道管理系统
      </h4>
    </el-menu>
  </div>
</template>
<script>
import Dialog from '../service/dialog.js'
import ModifyPwd from './modifyPwd'
import {
  logout
} from '../api/api'
export default {
  props: ['userInfo'],
  data() {
    return {
      activeIndex2: '1',
      msg: 'Welcome to Your Vue.js App'
    }
  },
  methods: {
    handleSelect(key, keyPath) {
      // console.log(key, keyPath)
      if (key === '1-1') { // 修改密码
        Dialog(ModifyPwd)
      } else if (key === '1-2') { // 退出登录
        logout().then((res) => {
          if (res.status) {
            location.href = '/#login'
            window.location.reload()
          }
        })
      }
    },
    goMainHtml() {
      this.$router.push({name: 'main.home'})
    }
  }
}
</script>
<style lang='stylus'>
h1,
h2,
h4 {
  font-weight: normal;
  margin: 12px;
}

ul {
  list-style-type: none;
  padding: 0;
}

a {
  color: #42b983;
}

.info {
  height: 42px;
  line-height: 42px;
  font-size: 14px;
}
.header
  .el-menu--horizontal
    .el-submenu
      .el-menu
        width: 100px
        overflow: hidden
      .el-submenu__title
        color: white
        height: 42px;
        line-height: 42px;
        margin-right: 20px
        i
          color: white
        &:hover
          background: none
  .bg
    float: left;
    margin: 0;
    height: 40px;
    margin-left: 20px;
    align-items: center;
    display: flex;
    padding-left: 120px;
    background: url('../assets/images/logo1.png')
    background-repeat: no-repeat
    background-position-y: center;

.el-menu--horizontal .el-submenu>.el-menu {
  top: auto;
}
.header h4 {
  cursor: pointer;
}
.header .menu-style {
  background: #4a4949;
  color: #fff;
}
</style>
