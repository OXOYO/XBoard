/**
* Created by OXOYO on 2019/7/1.
*
* CardItem
*/

<style scoped lang="less" rel="stylesheet/less">
  .card-item {
    display: inline-block;
    width: 100%;
    /*height: 200px;*/
    position: relative;
    border-top: 1px solid rgba(0, 0, 0, .1);
    border-bottom: 1px solid rgba(0, 0, 0, .1);

    .header {
      display: inline-block;
      width: 100%;

      .title {
        width: 100%;
        padding: 0 10px;
        height: 25px;
        line-height: 25px;
        border-bottom: 1px solid rgba(0, 0, 0, .1);
      }
    }
    .body {
      display: inline-block;
      width: 100%;
    }
  }
</style>

<template>
  <div class="card-item">
    <div class="header">
      <div class="title" v-if="title">{{ title }}</div>
    </div>
    <div class="body">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'CardItem',
    props: {
      title: String
    }
  }
</script>
