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
      const shape = group.addShape('path', {
        attrs: {
          path: [
            [ 'M', startPoint.x, startPoint.y ],
            [ 'L', endPoint.x, endPoint.y ]
          ],
          stroke: '#00F',
          lineWidth: 1,
          startArrow: {
            path: 'M 10,0 L -10,-10 L -10,10 Z',
            d: 10
          },
          endArrow: {
            path: 'M 10,0 L -10,-10 L -10,10 Z',
            d: 10
          }
        }
      })
      return shape
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
