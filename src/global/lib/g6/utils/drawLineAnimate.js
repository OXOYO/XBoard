/**
 * Created by OXOYO on 2019/7/11.
 *
 * 绘制线动画
 */

import config from '../config/index'

export default function (cfg, group) {
  let shape = group.get('children')[0]
  let startPoint = shape.getPoint(0)
  // 添加红色圆点
  let circle = group.addShape('circle', {
    attrs: {
      x: startPoint.x,
      y: startPoint.y,
      ...config.lineAnimate.style.default
    }
  })

  // 对红色圆点添加动画
  circle.animate({
    onFrame (ratio) {
      let tmpPoint = shape.getPoint(ratio)
      return {
        x: tmpPoint.x,
        y: tmpPoint.y
      }
    },
    repeat: true
  }, config.lineAnimate.delay)
}
