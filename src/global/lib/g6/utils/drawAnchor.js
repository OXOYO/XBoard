/**
 * Created by OXOYO on 2019/7/8.
 *
 * 绘制锚点
 */

import config from '../config/index'

export default function (cfg, group) {
  let { anchorPoints, width, height, id } = cfg
  anchorPoints.forEach((points, index) => {
    let [x, y] = points
    // 计算Marker中心点坐标
    let originX = -width / 2
    let originY = -height / 2
    let anchorPointX = x * width + originX
    let anchorPointY = y * height + originY
    // 添加Marker形状
    group.addShape('marker', {
      id: id + '_anchor_' + index,
      index: index,
      attrs: {
        name: 'anchor',
        x: anchorPointX,
        y: anchorPointY,
        // 形状半径
        radius: 5,
        // 指定形状
        symbol: 'circle',
        // 锚点默认样式
        ...config.anchor.style.default
      }
    })
  })
}
