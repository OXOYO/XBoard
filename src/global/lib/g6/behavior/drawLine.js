/**
 * Created by OXOYO on 2019/7/4.
 *
 * 连线
 */

export default {
  name: 'draw-line',
  options: {
    getDefaultCfg () {
      return {
        isDrawing: false,
        currentEdge: null
      }
    },
    getEvents () {
      return {
        'node:click': 'onNodeClick',
        'canvas:mousemove': 'onMousemove',
        'edge:click': 'onEdgeClick'
      }
    },
    onNodeClick (event) {
      let _t = this
      let node = event.item
      let target = event.target
      console.log('_t.editor.$X', _t.graph.$X)
      // 获取元素的数据模型
      // let model = node.getModel()
      let model = target._cfg
      console.log('node', node, model, target)
      if (_t.isDrawing && _t.currentEdge) {
        _t.graph.updateItem(_t.currentEdge, {
          target: model.id
        })

        _t.currentEdge = null
        _t.isDrawing = false
      } else {
        _t.currentEdge = _t.graph.addItem('edge', {
          // 起始节点
          source: model.id,
          // 终止节点/位置
          target: {
            x: event.x,
            y: event.y
          },
          // FIXME 边的形式需要与工具栏联动
          shape: _t.graph.$X.lineType || 'line'
        })
        _t.isDrawing = true
      }
    },
    onMousemove (event) {
      let _t = this
      if (_t.isDrawing && _t.currentEdge) {
        _t.graph.updateItem(_t.currentEdge, {
          target: {
            x: event.x,
            y: event.y
          }
        })
      }
    },
    onEdgeClick (event) {
      let _t = this
      let currentEdge = event.item
      if (_t.isDrawing && _t.currentEdge === currentEdge) {
        // 画线过程中点击则移除当前画线
        _t.graph.removeItem(_t.currentEdge)

        _t.currentEdge = null
        _t.isDrawing = false
      }
    }
  }
}
