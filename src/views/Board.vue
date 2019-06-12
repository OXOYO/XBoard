/**
* Created by OXOYO on 2019/6/12.
*
* Board
*/

<style scoped lang="less" rel="stylesheet/less"></style>

<template>
  <div class="view">
    <BoardBox></BoardBox>
  </div>
</template>

<script>
  import BoardBox from '../components/BoardBox/Index'

  export default {
    name: 'Board',
    components: {
      BoardBox
    },
    created () {
      let _t = this
      // 分发mutation，新增画板
      _t.$store.commit('board/list/add', {
        id: new Date().getTime(),
        screenshot: ''
      })
      _t.$store.commit('board/activeBoardIndex/update', 0)
    }
  }
</script>
