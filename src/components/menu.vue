<template>
  <div class="menu" ref="menu">
    <div class="menu-collapse" @click="isCollapse = !isCollapse">
      <i class="fa fa-bars" aria-hidden="true"></i>
    </div>
    <el-menu default-active="/" class="el-menu-vertical-demo menu-style" @open="handleOpen" @close="handleClose" :collapse="isCollapse" :router='true' :unique-opened="true">
      <el-menu-item index="/">
        <i class="fa fa-home fa-style" aria-hidden="true"></i>
        <span slot="title">首页</span>
      </el-menu-item>
      <!-- index 放路由地址 -->
      <el-submenu :index="'el-submenu-' + index" :key="'el-submenu-' + index" v-for="(item, index) in data">
        <template slot="title">
          <i :class="item.icon" aria-hidden="true"></i>
          <span slot="title">{{item.name}}{{item.url.split('.')[1]}}</span>
        </template>
        <el-menu-item :index="'el-submenu-son-' + index + '-' + sindex" :route="{path: '/' + itemChild.url.split('.')[1]}" :key="itemChild.FunctionId" v-for="(itemChild, sindex) in item.children">
          {{itemChild.name}}
        </el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isCollapse: false,
      data: [],
      IsCenter: ''
    }
  },
  created() {
    var userInfos = JSON.parse(sessionStorage.getItem('userInfo'))
    this.IsCenter = userInfos.IsCenter
    // console.log(this.IsCenter, 'this.IsCenter')
    let funlist = JSON.parse(this.$store.state.userInfo.FunctionList)
    // funlist = funlist.sort(sortFn)
    // console.log(funlist, '菜单')
    funlist = window._.sortBy(funlist, 'Rank')
    // console.log(funlist, '排序后')
    let icons = {
      '代理商管理': 'fa fa-user-o',
      '订单管理': 'fa fa-pencil-square',
      '发票管理': 'fa fa-file-text-o',
      '财务管理': 'fa fa-money',
      '做账数据管理': 'fa fa-bar-chart',
      '业绩数据管理': 'fa fa-bar-chart',
      '外勤数据管理': 'fa fa-bar-chart',
      '续费数据管理': 'fa fa-bar-chart',
      '流转数据管理': 'fa fa-bar-chart',
      '渠道返点': 'fa fa-reply-all',
      '管理中心': 'fa fa-arrows',
      '客户管理': 'fa fa-address-book',
      '外勤系统': 'fa fa-file-text-o'
    }
    // if (this.IsCenter === 1) {
    //   icons = ['fa fa-user-o', 'fa fa-file-text-o', 'fa fa-file-text-o', 'fa fa-file-text-o', 'fa fa-bar-chart', 'fa fa-bar-chart', 'fa fa-bar-chart', 'fa fa-bar-chart', 'fa fa-bar-chart', 'fa fa-reply-all', 'fa fa-arrows']
    // } else {
    //   icons = ['fa fa-user-o', 'fa fa-file-text-o', 'fa fa-file-text-o', 'fa fa-file-text-o', 'fa fa-bar-chart', 'fa fa-bar-chart', 'fa fa-bar-chart', 'fa fa-bar-chart', 'fa fa-bar-chart', 'fa fa-arrows']
    // }
    funlist.forEach(function(item, i) {
      // let icon = icons[i]
      item.icon = icons[item.name]
      item.children = item.children.sort(sortFn)
    })

    function sortFn(a, b) {
      return a.Rank - b.Rank
    }
    this.data = $.extend(true, [], funlist)
  },
  mounted() {
    this.setMenuShowPosition()
  },
  updated() {
    setTimeout(() => {
      this.setMenuShowPosition()
    }, 350)
  },
  methods: {
    setMenuShowPosition() { // 设置hover时菜单位置
      const $el = $(this.$refs.menu)
      console.log($el)
      // console.log($el.children('.el-menu--collapse'))
      // // // $el.
      $el.children('.el-menu--collapse').children('li').hover((e) => {
        const curEl = $(e.currentTarget)
        const target = curEl.children('ul')
        if (!target.offset()) return
        setTimeout(() => {
          // console.log(target.offset().top, target.height(), $(window).height())
          if (target.offset().top + target.height() > $(window).height()) {
            target.css({
              bottom: 0,
              top: 'auto'
            })
          } else {
            target.css({
              bottom: 'auto',
              top: 0
            })
          }
        }, 350)
      })
    },
    handleOpen(key, keyPath) {
      // console.log(key, keyPath)
    },
    handleClose(key, keyPath) {
      // console.log(key, keyPath)
    }
  }
}
</script>

<style>
.menu .menu-style {
  background-color: #f1f1f1;
}
.el-submenu .el-menu {
  background-color: #f1f1f1;
}
.menu .el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
.menu .menu-collapse {
  font-size: 20px;
  text-align: center;
  height: 35px;
  line-height: 35px;
  cursor: pointer;
  background: #f1f1f1;
}
.menu .fa-style {
  font-size: 18px;
}
</style>
