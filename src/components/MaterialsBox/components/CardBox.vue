/**
* Created by OXOYO on 2019/7/1.
*
* CardBox 卡片盒子
*/

<style scoped lang="less" rel="stylesheet/less">
  .card-box {
    display: inline-block;
    width: 400px;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    padding-top: 40px;
    box-shadow: 0 0 2px 2px rgba(0, 0, 0, .1);
    background: #ffffff;
    z-index: 200;
  }
</style>

<template>
  <div class="card-box">
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: 'CardBox'
  }
</script>
