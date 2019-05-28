/**
* Created by OXOYO on 2019/5/28.
*
* ContextMenu
*/

<style scoped lang="less" rel="stylesheet/less">
  .context-menu-box {
    position: absolute;
    min-width: 120px;
    width: auto !important;
    z-index: 9999;
    background: #FFF;
    box-shadow: 2px 2px 1px 1px rgba(0, 0, 0, .1);
    padding: 5px 0;

    .menu-item {

    }
  }
</style>

<template>
  <div class="context-menu-box" v-show="isShow" :style="contextMenuStyle">
    <div class="menu-item">
      <h1>TODO ContextMenu</h1>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'ContextMenu',
    data () {
      return {
        isShow: false,
        options: {}
      }
    },
    computed: {
      contextMenuStyle: function () {
        let _t = this
        let x = _t.options.x !== undefined ? (parseInt(_t.options.x) > 0 ? parseInt(_t.options.x) : 0) : 0
        let y = _t.options.y !== undefined ? (parseInt(_t.options.y) > 0 ? parseInt(_t.options.y) : 0) : 0
        let style = {}
        // 判断是否超出边界
        if (document.documentElement && document.documentElement.clientHeight && document.documentElement.clientWidth) {
          let winHeight = document.documentElement.clientHeight
          let winWidth = document.documentElement.clientWidth
          if (x + 200 > winWidth) {
            style['right'] = '10px'
          } else {
            style['left'] = x + 'px'
          }
          if (y + 100 > winHeight) {
            style['bottom'] = '42px'
          } else {
            style['top'] = y + 'px'
          }
        }
        return style
      }
    },
    methods: {
      init () {
        let _t = this
        _t.initOptions()
      },
      initOptions () {
        let _t = this
        _t.options = {
          x: 0,
          y: 0
        }
      }
    },
    created: function () {
      let _t = this
      // 初始化
      _t.init()
      // 监听事件
      _t.$X.utils.bus.$on('platform/contextMenu/show', function (options) {
        _t.options = options
        _t.isShow = true
      })
      _t.$X.utils.bus.$on('platform/contextMenu/hide', function () {
        // 重置options
        _t.initOptions()
        _t.isShow = false
      })
    },
    beforeDestroy: function () {
      let _t = this
      // 注销事件
      _t.$X.utils.bus.$off([
        'platform/contextMenu/show',
        'platform/contextMenu/hide'
      ])
    }
  }
</script>
