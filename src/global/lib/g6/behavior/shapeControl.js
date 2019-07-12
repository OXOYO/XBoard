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
        status: false
      }
    },
    getEvents() {
      return {
        'node:mousedown': 'onNodeMousedown'
        // ,
        // 'canvas:mousemove': 'onMousemove',
        // 'canvas:mouseup': 'onMouseup',
      }
    },
    onNodeMousedown(event) {
      let _t = this
      let node = event.item
      let model = node.getModel()
      if (!_t.graph.$X.shapeControl.activeNodes.includes(model.id)) {
        _t.graph.$X.shapeControl.activeNodes.push(model.id)
      }
      console.log('shape-control node', node, _t.graph.$X)
    },
    onMousemove (event) {
      console.log()
    },
    onMouseup (event) {

    }
  }
}
