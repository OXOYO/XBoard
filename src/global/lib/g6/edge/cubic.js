/**
 * Created by OXOYO on 2019/7/11.
 *
 * 曲线
 */

import utils from '../utils/index'

export default {
  name: 'x-cubic',
  extendName: 'cubic',
  options: {
    afterDraw (cfg, group) {
      // 绘制线条动画
      utils.drawLineAnimate(cfg, group)
    }
  }
}
