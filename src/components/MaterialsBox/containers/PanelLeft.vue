/**
* Created by OXOYO on 2019/7/2.
*
* PanelLeft 左侧面板
*/

<style scoped lang="less" rel="stylesheet/less">
  .panel-left {
    .card-item {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;
      align-content: flex-start;
    }
  }
</style>

<template>
  <CardBox class="panel-left" placement="left" :width="250">
    <CardItem>
      <NodeElement shape="rect"></NodeElement>
      <NodeElement shape="circle"></NodeElement>
      <NodeElement shape="anchor-node"></NodeElement>
      <NodeElement shape="custom-node"></NodeElement>
      <NodeElement shape="jump-node"></NodeElement>
    </CardItem>
  </CardBox>
</template>

<script>
  import CardBox from '../components/CardBox'
  import CardItem from '../components/CardItem'
  import NodeElement from '../components/NodeElement'

  export default {
    name: 'PanelLeft',
    components: {
      CardBox,
      CardItem,
      NodeElement
    }
  }
</script>
