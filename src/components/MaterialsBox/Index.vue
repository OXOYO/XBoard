/**
* Created by OXOYO on 2019/6/28.
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
    box-shadow: 0 0 2px 2px rgba(0, 0, 0, .1);
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
    <MaterialsSelector v-if="mode === 'selector'"></MaterialsSelector>
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
    watch: {
      mode (val) {
        let _t = this
        if (val && val === 'editor') {
          _t.$nextTick(function () {
            _t.$X.utils.bus.$emit('board/materials/editor/create')
          })
        }
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
      }
    },
    created () {
      let _t = this
      _t.$X.utils.bus.$on('board/materials/editor/close', function (data) {
        _t.doHide()
      })
      _t.$X.utils.bus.$on('board/materials/editor/back', function (data) {
        _t.doShow('selector')
      })
      _t.$X.utils.bus.$on('board/materials/editor/trigger', function (data) {
        _t.doShow('editor')
      })
      _t.$X.utils.bus.$on('board/materials/selector/close', function (data) {
        _t.doHide()
      })
    }
  }
</script>
