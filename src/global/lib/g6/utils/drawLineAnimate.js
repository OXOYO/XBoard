/**
 * Created by OXOYO on 2019/7/11.
 *
 * 绘制线条动画
 */

import config from '../config/index'

export default function (cfg, group) {
  let node = group.getFirst()
  let startPoint = node.getPoint(0)
  if (!startPoint) {
    return
  }
  // 添加红色圆点
  let circle = group.addShape('circle', {
    id: cfg.id + '_edge_animate_point_',
    name: 'edgeAnimatePoint',
    attrs: {
      x: startPoint.x,
      y: startPoint.y,
      ...config.lineAnimate.style.default
    }
  })

  // 对红色圆点添加动画
  circle.animate({
    onFrame (ratio) {
      let tmpPoint = node.getPoint(ratio)
      if (tmpPoint) {
        return {
          x: tmpPoint.x,
          y: tmpPoint.y
        }
      }
    },
    repeat: true
  }, config.lineAnimate.delay)
}
