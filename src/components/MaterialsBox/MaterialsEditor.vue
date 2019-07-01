/**
* Created by OXOYO on 2019/6/28.
*
* MaterialsEditor 物料编辑器
*/

<style scoped lang="less" rel="stylesheet/less">
  .materials-editor {
    display: inline-block;
    width: 100%;
    height: 100%;
  }
</style>

<template>
  <div class="materials-editor">
    <ToolBar @close="doClose"></ToolBar>
    <Sketchpad></Sketchpad>
    <CardBox>
      <CardItem>
        <Options></Options>
      </CardItem>
      <CardItem>
        <Navigator></Navigator>
      </CardItem>
    </CardBox>
    <!--<ContextMenu></ContextMenu>-->
  </div>
</template>

<script>
  import ToolBar from './components/ToolBar'
  import Sketchpad from './components/Sketchpad'
  import CardBox from './components/CardBox'
  import CardItem from './components/CardItem'
  import Options from './components/Options'
  import Navigator from './components/Navigator'
  // import ContextMenu from './components/ContextMenu'

  export default {
    name: 'MaterialsEditor',
    components: {
      ToolBar,
      Sketchpad,
      CardBox,
      CardItem,
      Options,
      Navigator
      // ,
      // ContextMenu
    },
    data () {
      return {
        isShow: false,
        editorInfo: {},
        defInfo: {
          // 编辑器状态：add || edit || preview
          status: 'add'
        }
      }
    },
    methods: {
      init (data = {}) {
        let _t = this
        _t.editorInfo = {
          ..._t.defInfo,
          ...data
        }
      },
      doShow () {
        let _t = this
        _t.isShow = true
      },
      doHide () {
        let _t = this
        _t.isShow = false
      },
      doClose () {
        let _t = this
        _t.$emit('close')
      }
    },
    created () {
      let _t = this
      _t.init()
      // 监听事件
      _t.$X.utils.bus.$on('board/materials/editor/show', function (data) {
        _t.doShow()
        // 处理操作类型，初始化编辑器
        _t.init(data)
      })
    }
  }
</script>
