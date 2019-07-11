/**
 * Created by OXOYO on 2019/7/11.
 *
 * 绘制图形控制
 */

import config from '../config/index'

export default function (cfg, group) {
  let node = group.getFirst()
  console.log('drawShapeControl', node)

  let { shapeControl, width, height, id } = cfg
  if (shapeControl && shapeControl.hasOwnProperty('controllers') && shapeControl.controllers.length) {
    for (let i = 0, len = shapeControl.controllers.length; i < len; i++) {
      let [x, y, cursor] = shapeControl.controllers[i]
      // 计算Marker中心点坐标
      let originX = -width / 2
      let originY = -height / 2
      let anchorX = x * width + originX
      let anchorY = y * height + originY
      // 添加Marker形状
      group.addShape('marker', {
        id: id + '_shape_control_anchor' + i,
        index: i,
        attrs: {
          name: 'shapeControlAnchor',
          x: anchorX,
          y: anchorY,
          cursor: cursor || 'pointer',
          // 锚点默认样式
          ...config.shapeControl.style.default.points
        }
      })
    }
    // FIXME 边框绘制存在BUG
    // 绘制边框
    let edge = group.addShape('rect', {
      id: id + '_shape_control_edge',
      attrs: {
        name: 'shapeControlEdge',
        x: node.x,
        y: node.y,
        width,
        height,
        // 锚点默认样式
        ...config.shapeControl.style.default.edge
      }
    })
    // 前置
    edge.toFront()
  }
}
