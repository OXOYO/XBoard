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
