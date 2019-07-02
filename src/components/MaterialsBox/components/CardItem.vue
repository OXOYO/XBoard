/**
* Created by OXOYO on 2019/7/1.
*
* CardItem
*/

<style scoped lang="less" rel="stylesheet/less">
  .card-item {
    display: inline-block;
    width: 100%;
    height: 200px;
    position: relative;
    border-top: 1px solid rgba(0, 0, 0, .1);
    border-bottom: 1px solid rgba(0, 0, 0, .1);
  }
</style>

<template>
  <div class="card-item">
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: 'CardItem'
  }
</script>
