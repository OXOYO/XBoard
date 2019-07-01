/**
* Created by OXOYO on 2019/7/1.
*
* Sketchpad 画板
*/

<style scoped lang="less" rel="stylesheet/less">
  .sketchpad {
    display: inline-block;
    width: 100%;
    position: absolute;
    top: 40px;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 100;
  }
</style>

<template>
  <div class="sketchpad">
    <h1>TODO Sketchpad</h1>
  </div>
</template>

<script>
  export default {
    name: 'Sketchpad'
  }
</script>
