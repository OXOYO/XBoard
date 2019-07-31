/**
 * Created by OXOYO on 2019/7/11.
 *
 * 直线
 */

import utils from '../utils/index'

export default {
  name: 'x-line',
  extendName: 'line',
  options: {
    draw (cfg, group) {
      const { startPoint, endPoint } = cfg
      const keyShape = group.addShape('path', {
        className: 'edge-shape',
        attrs: {
          ...cfg,
          path: [
            [ 'M', startPoint.x, startPoint.y ],
            [ 'L', endPoint.x, endPoint.y ]
          ]
        }
      })
      return keyShape
    },
    setState (name, value, item) {
      // 设置线条激活
      utils.setLineActive(name, value, item)
    },
    afterDraw (cfg, group) {
      // 绘制线条动画
      // utils.drawLineAnimate(cfg, group)
    }
  }
}
