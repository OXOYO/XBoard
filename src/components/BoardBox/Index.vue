/**
* Created by OXOYO on 2019/6/12.
*
* BoardBox
*/

<style scoped lang="less" rel="stylesheet/less">
  .board-box {
    display: inline-block;
    width: 100%;
    height: 100%;
  }
</style>

<template>
  <div class="board-box">
    <BoardItem
      v-for="(item, index) in boardList"
      :key="index"
      :info="item"
      :active="activeBoardIndex === index"
    >
    </BoardItem>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  import BoardItem from './BoardItem'

  export default {
    name: 'BoardBox',
    components: {
      BoardItem
    },
    computed: {
      ...mapGetters([
        'activeBoardIndex',
        'boardList'
      ])
    }
  }
</script>
