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
    user-select: none;
  }
</style>

<template>
  <div class="materials-editor">
    <ToolBar></ToolBar>
    <Sketchpad></Sketchpad>
    <PanelLeft></PanelLeft>
    <PanelRight></PanelRight>
    <!--<ContextMenu></ContextMenu>-->
  </div>
</template>

<script>
  import ToolBar from './containers/ToolBar'
  import Sketchpad from './containers/Sketchpad'
  import PanelLeft from './containers/PanelLeft'
  import PanelRight from './containers/PanelRight'
  // import ContextMenu from './components/ContextMenu'
  import G6 from '@/global/lib/g6/index'
  import Minimap from '@antv/g6/build/minimap'
  import Grid from '@antv/g6/build/grid'

  export default {
    name: 'MaterialsEditor',
    components: {
      ToolBar,
      Sketchpad,
      PanelLeft,
      PanelRight
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
        },
        editor: null
      }
    },
    methods: {
      init () {
        let _t = this
        let el = _t.$el
        let sketchpad = el.querySelector('#sketchpad')
        let navigator = el.querySelector('#navigator')
        console.log('sketchpad', sketchpad, sketchpad.clientWidth, sketchpad.clientHeight)
        console.log('navigator', navigator, navigator.clientWidth, navigator.clientHeight)
        let size = [navigator.clientWidth, parseInt(navigator.clientWidth * sketchpad.clientHeight / sketchpad.clientWidth)]
        console.log('size', size)
        const minimap = new Minimap({
          container: navigator,
          type: 'delegate',
          size: size
        })
        const grid = new Grid()
        // 生成编辑器实例
        _t.editor = new G6.Graph({
          plugins: [
            minimap,
            grid
          ],
          container: sketchpad,
          width: sketchpad.clientWidth,
          height: sketchpad.clientHeight,
          fitViewPadding: 20,
          // 模式
          modes: {
            edit: [
              'zoom-canvas',
              'drag-canvas',
              'drag-node',
              'click-select',
              'tooltip',
              'edge-tooltip',
              'activate-relations',
              // 自定义交互：画线
              'draw-line',
              // 自定义交互：拖拽节点到编辑器
              'drag-node-to-editor'
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
          // 节点样式
          nodeStyle: {
            // 默认样式
            default: {
              fill: '#FFFFFF',
              fillOpacity: 1,
              stroke: '#000000',
              strokeOpacity: 1,
              lineWidth: 2
            },
            // active 状态下的样式
            active: {},
            // selected 状态下的样式
            selected: {},
            // hover 状态下的样式
            hover: {}
          },
          edgeStyle: {
            default: {
              stroke: '#000000',
              strokeOpacity: 1
            }
          }
        })
        // 挂载全局命名空间
        _t.editor.$X = {}
        // 设置模式为编辑
        _t.editor.setMode('edit')
        console.log('_t.editor', _t.editor)
        // 绑定事件
        // _t.editor.on('click', _t._editorClick)
        // _t.editor.on('node:click', _t._nodeClick)
        _t.editor.on('node:mouseover', _t._nodeHover)
        _t.editor.on('node:mouseout', _t._nodeOut)
        // _t.editor.on('node:contextmenu', _t._nodeContextmenu)
      },
      _editorClick (event) {
        console.log('_editorClick', event)
      },
      _nodeClick (event) {
        let _t = this
        console.log('_nodeClick', event)
        _t.editor.setItemState(event.item, 'active', true)
      },
      _nodeHover (event) {
        let _t = this
        console.log('_nodeHover', event.item)
        _t.editor.setItemState(event.item, 'hover', true)
      },
      _nodeOut (event) {
        let _t = this
        console.log('_nodeOut', event.item)
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
          let el = _t.$el
          let sketchpad = el.querySelector('#sketchpad')
          center = {
            x: sketchpad.clientWidth / 2,
            y: sketchpad.clientHeight / 2
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
          id: G6.Util.uniqueId(),
          shape: info.shape,
          // shape: 'anchor-rect',
          label: info.shape,
          width: 40,
          height: 40,
          // FIXME 定义锚点坐标
          anchorPoints: [[0, 0], [0, 1], [1, 0], [1, 1]]
        }
        // 广播事件，通过自定义交互 drag-node-to-editor 添加节点
        _t.editor.emit('editor:addnode', node)
      },
      handleToolTrigger (info) {
        let _t = this
        switch (info.name) {
          case 'zoomIn':
          case 'zoomOut':
          case 'actualSize':
            _t._zoom(info.name)
            break
          case 'fit':
            _t.editor.fitView()
            break
          case 'preview':
            _t.editor.setMode('preview')
            break
          case 'edit':
            _t.editor.setMode('edit')
            break
          case 'lineType':
            console.log('lineType', info)
            _t.editor.$X.lineType = info
            break
        }
      },
      initInfo (data = {}) {
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
      }
    },
    created () {
      let _t = this
      // 监听事件
      _t.$X.utils.bus.$on('board/materials/editor/show', function (data) {
        _t.doShow()
        // 处理操作类型，初始化编辑器
        _t.initInfo(data)
      })
      _t.$X.utils.bus.$on('board/materials/editor/create', function () {
        // FIXME 设置500ms延时，用于等待transition结束
        setTimeout(_t.init, 600)
      })
      _t.$X.utils.bus.$on('board/materials/editor/add/node', _t.doAddNode)
      _t.$X.utils.bus.$on('board/materials/editor/tool/trigger', _t.handleToolTrigger)
    }
  }
</script>
