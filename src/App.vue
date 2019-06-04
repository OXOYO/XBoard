/**
* Created by OXOYO on 2019/5/17.
*
* App
*/

<style scoped lang="less" rel="stylesheet/less"></style>

<template>
  <router-view></router-view>
</template>

<script>
export default {
  name: 'App',
  created () {
    // 阻止浏览器默认右键菜单
    document.oncontextmenu = function (event) {
      if (event.stopPropagation) {
        event.stopPropagation()
      }
      if (event.preventDefault) {
        event.preventDefault()
      }
    }
  }
}
</script>
