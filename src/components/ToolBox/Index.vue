/**
* Created by OXOYO on 2019/5/18.
*
*/

<style scoped lang="less" rel="stylesheet/less">
  .tool-box {
    display: inline-block;
    box-shadow: 0 0 5px 2px rgba(0, 0, 0, .1);
    padding: 5px;
    background: #fff;
    cursor: default;
  }
</style>

<template>
  <div class="tool-box" @contextmenu.stop.prevent>
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: 'Index',
    props: {
      tools: {
        type: Array
      }
    }
  }
</script>
