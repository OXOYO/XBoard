/**
 * Created by OXOYO on 2019/7/12.
 *
 *
 */

export default {
  name: 'shape-control',
  options: {
    getDefaultCfg() {
      return {
        status: false,
        currentNode: null,
        currentTarget: null,
        minHeight: 20,
        minWidth: 20
      }
    },
    getEvents() {
      return {
        'node:mousedown': 'onNodeMousedown',
        'node:mouseup': 'onNodeMouseup',
        'canvas:mousemove': 'onMousemove',
        'canvas:mouseup': 'onMouseup'
      }
    },
    onNodeMousedown (event) {
      let _t = this
      let node = event.item
      let model = node.getModel()
      let target = event.target
      _t.currentNode = node
      _t.currentTarget = target
      if (!_t.graph.$X.shapeControl.activeNodes.includes(model.id)) {
        _t.graph.$X.shapeControl.activeNodes.push(model.id)
      }
      console.log('shape-control node', node, _t.graph.$X)
    },
    onNodeMouseup (event) {
      let _t = this
      _t.currentNode = null
      _t.currentTarget = null
    },
    onMousemove (event) {
      let _t = this
      if (_t.currentNode && _t.currentTarget) {
        let nodeModel = _t.currentNode.getModel()
        // 判断位置
        let targetAttrs = _t.currentTarget._attrs
        let position = targetAttrs.position
        let attrs = {
          x: nodeModel.x,
          y: nodeModel.y,
          size: nodeModel.size
        }
        let width = nodeModel.width
        let height = nodeModel.height
        console.log('position', position)
        if (position) {
          let originX = -width / 2
          let originY = -height / 2
          let anchorX = x * width + originX
          let anchorY = y * height + originY

          if (position.x === 0) {
            attrs.x = event.x
            if (position.y === 0) {
              attrs.y = event.y
              attrs.size[0] = anchorX - event.x + width
              attrs.size[1] = anchorY - event.y + height
            } else if (position.y === 1) {
              attrs.size[0] = anchorX - event.x + width
              attrs.size[1] = event.y - anchorY + height
            }
          } else if (position.x === 1) {
            if (position.y === 0) {
              attrs.size[0] = event.x - anchorX + width
              attrs.size[1] = anchorY - event.y + height
            } else if (position.y === 1) {
              attrs.size[0] = event.x - anchorX + width
              attrs.size[1] = event.y - anchorY + height
            }
          }
        }
        if (attrs.size[0] < 20) {
          attrs.size[0] = 20
        }
        if (attrs.size[1] < 20) {
          attrs.size[1] = 20
        }
        console.log('attrs', JSON.stringify(attrs))
        _t.currentNode.update(attrs)
        _t.graph.paint()
      }
    },
    onMouseup (event) {
      let _t = this
      _t.currentNode = null
      _t.currentTarget = null
    }
  }
}
