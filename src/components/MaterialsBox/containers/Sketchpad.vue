/**
* Created by OXOYO on 2019/7/1.
*
* Sketchpad 画板
*/

<style scoped lang="less" rel="stylesheet/less">
  .sketchpad {
    display: inline-block;
    width: 100%;
    position: absolute;
    top: 65px;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 100;
  }
</style>

<template>
  <div class="sketchpad" id="sketchpad" ref="sketchpad"></div>
</template>

<script>
  import G6 from '@antv/g6'
  export default {
    name: 'Sketchpad',
    data () {
      return {
        editor: null
      }
    },
    methods: {
      init () {
        let _t = this
        let el = _t.$refs.sketchpad
        console.log('el', el, el.clientWidth, el.clientHeight)
        // 生成编辑器实例
        _t.editor = new G6.Graph({
          container: el,
          width: el.clientWidth,
          height: el.clientHeight,
          modes: {
            default: ['zoom-canvas', 'drag-canvas']
          },
          nodeStyle: {
            default: {
              fill: '#40a9ff',
              stroke: '#096dd9'
            }
          },
          edgeStyle: {
            default: { stroke: '#A3B1BF' }
          }
        })
        // 绑定事件
        _t.editor.on('click', _t._editorClick)
        _t.editor.on('node:click', _t._nodeClick)
      },
      _editorClick (event) {
        console.log('_editorClick', event)
      },
      _nodeClick (event) {
        console.log('_nodeClick', event)
      },
      _zoom (toolName, position) {
        let _t = this
        let ratio = 1
        let center
        if (position) {
          center = position
        } else {
          let el = _t.$refs.sketchpad
          center = {
            x: el.clientWidth / 2,
            y: el.clientHeight / 2
          }
        }
        if (['zoomIn', 'zoomOut'].includes(toolName)) {
          ratio = toolName === 'zoomOut' ? 0.9 : 1.1
          _t.editor.zoom(ratio, center)
        } else if (toolName === 'actualSize') {
          ratio = 1
          _t.editor.zoomTo(ratio, center)
        }
      },
      doAddNode (info) {
        let _t = this
        console.log('doAddNode', info)
        let node = {
          id: info.shape + (new Date().getTime()),
          shape: info.shape,
          label: info.shape,
          x: parseInt(info.style.left) + 20,
          y: parseInt(info.style.top) + 20,
          anchorPoints: [[0, 0.5], [1, 0.5]]
        }
        _t.editor.addItem('node', node)
        console.log('getNodes', _t.editor.getNodes())
      },
      handleToolTrigger (toolName) {
        let _t = this
        switch (toolName) {
          case 'zoomIn':
          case 'zoomOut':
          case 'fit':
          case 'actualSize':
            _t._zoom(toolName)
            break
        }
      }
    },
    created () {
      let _t = this
      _t.$X.utils.bus.$on('board/materials/editor/create', function () {
        // FIXME 设置500ms延时，用于等待transition结束
        setTimeout(_t.init, 600)
      })
      _t.$X.utils.bus.$on('board/materials/editor/add/node', _t.doAddNode)
      _t.$X.utils.bus.$on('board/materials/editor/tool/trigger', _t.handleToolTrigger)
    }
  }
</script>
