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
  import Minimap from '@antv/g6/build/minimap'

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
        const minimap = new Minimap()
        // 生成编辑器实例
        _t.editor = new G6.Graph({
          plugins: [
            minimap
          ],
          container: el,
          width: el.clientWidth,
          height: el.clientHeight,
          fitViewPadding: 20,
          // 模式
          modes: {
            default: [
              'zoom-canvas',
              'drag-canvas',
              'drag-node',
              'click-select',
              // 'tooltip',
              // 'edge-tooltip',
              'activate-relations'
              // ,
              // {
              //   type: 'brush-select',
              //   onSelect (nodes) { console.log('selected:', nodes) },
              //   onDeselect (nodes) { console.log('deselect', nodes) }
              // }
              // ,
              // 只适用于树图，展开或收起节点
              // 'collapse-expand'
            ],
            // 只读，
            preview: ['drag-canvas', 'zoom-canvas']
          },
          nodeStyle: {
            default: {
              fill: '#40a9ff',
              stroke: '#096dd9'
            },
            // 当节点在 selected 状态下的样式
            hover: {
              lineWidth: 2,
              fillOpacity: 0.8
            }
          },
          edgeStyle: {
            default: { stroke: '#A3B1BF' }
          }
        })
        // 绑定事件
        // _t.editor.on('click', _t._editorClick)
        // _t.editor.on('node:click', _t._nodeClick)
        // _t.editor.on('node:mouseover', _t._nodeHover)
        // _t.editor.on('node:mouseleave', _t._nodeLeave)
        // _t.editor.on('node:contextmenu', _t._nodeContextmenu)
      },
      _editorClick (event) {
        console.log('_editorClick', event)
      },
      _nodeClick (event) {
        console.log('_nodeClick', event)
      },
      _nodeHover (event) {
        let _t = this
        console.log('_nodeHover', event)
        _t.editor.setItemState(event.item, 'hover', true)
      },
      _nodeLeave (event) {
        let _t = this
        console.log('_nodeLeave', event)
        _t.editor.setItemState(event.item, 'hover', false)
      },
      _nodeContextmenu (event) {
        console.log('_nodeContextmenu', event)
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
          case 'actualSize':
            _t._zoom(toolName)
            break
          case 'fit':
            _t.editor.fitView()
            break
          case 'preview':
            _t.editor.setMode('preview')
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
