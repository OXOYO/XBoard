/**
* Created by OXOYO on 2019/5/18.
*
*/

<style scoped lang="less" rel="stylesheet/less">
  .tool-item {
    display: inline-block;
    position: relative;
    width: 30px;
    height: 30px;
    line-height: 30px;
    /*padding: 10px;*/
    vertical-align: middle;
    opacity: .3;

    &:hover {
      opacity: 1;
    }
    &.active {
      opacity: 1;
    }

    .label {

    }
  }
</style>

<template>
  <div :class="{ 'tool-item': true, 'active': active }">
    <slot name="label" class="label">{{ label }}</slot>
  </div>
</template>

<script>
  export default {
    name: 'ToolItem',
    props: {
      label: String,
      active: Boolean
    },
    data () {
      return {
        visible: false
      }
    },
    methods: {
      handleOver () {
        this.visible = true
      },
      handleOut () {
        this.visible = false
      },
      handleClick (val) {
        this.$emit('click', val)
      }
    }
  }
</script>
