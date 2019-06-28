/**
* Created by yangfan9244 on 2019/6/28.
*
* MaterialsBox
*/

<style scoped lang="less" rel="stylesheet/less">
  .materials-box {
    display: inline-block;
    position: absolute;
    top: 0;
    right: -999px;
    bottom: 0;
    z-index: 600;
    width: 300px;
    box-shadow: -2px 0 2px 2px rgba(0, 0, 0, .1);
    background: #ffffff;
    transition: all .5s ease-in-out;

    &.editor {
      right: 0;
      left: 0;
      width: 100%;
    }
    &.selector {
      right: 0;
      width: 300px;
    }
  }
</style>

<template>
  <div :class="['materials-box', mode]">
    <!-- 物料编辑器 -->
    <MaterialsEditor v-if="mode === 'editor'"></MaterialsEditor>
    <!-- 物料选择器 -->
    <MaterialsSelector v-if="mode === 'selector'" @close="handleSelectorClose"></MaterialsSelector>
  </div>
</template>

<script>
  import MaterialsEditor from './MaterialsEditor'
  import MaterialsSelector from './MaterialsSelector'

  export default {
    name: 'MaterialsBox',
    components: {
      MaterialsEditor,
      MaterialsSelector
    },
    data () {
      return {
        isShow: false,
        // 模式 editor || selector
        mode: null
      }
    },
    methods: {
      doToggle (data) {
        let _t = this
        if (_t.isShow) {
          _t.doHide()
        } else {
          _t.doShow(data)
        }
      },
      doShow (data) {
        let _t = this
        _t.isShow = true
        _t.mode = data || 'selector'
      },
      doHide () {
        let _t = this
        _t.isShow = false
        _t.mode = null
      },
      handleSelectorClose () {
        let _t = this
        _t.doHide()
      }
    }
  }
</script>
