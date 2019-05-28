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
    padding: 10px;
    vertical-align: middle;

    .label {
      height: 40px;
    }

    .content {
      position: absolute;
      top: 41px;
      display: flex;
      padding: 5px;
      background: #fff;
      box-shadow: 0 0 5px 2px rgba(0, 0, 0, .1);

      .content-item {
        flex: 1 1 auto;
        padding: 5px;
        margin: 5px;
      }
    }
  }
</style>

<template>
  <div class="tool-item" @mouseover="handleOver" @mouseout="handleOut">
    <slot name="label" class="label">{{ label }}</slot>
    <div class="content" v-show="visible">
      <slot name="content">
        <div
          v-for="(val, index) in content"
          :key="index"
          class="content-item"
          @click="handleClick(val)"
        >
          {{ val }}
        </div>
      </slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'ToolItem',
    props: {
      label: String,
      // value: String,
      content: Array
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
