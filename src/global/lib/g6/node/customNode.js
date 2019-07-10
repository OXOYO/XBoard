/**
 * Created by OXOYO on 2019/7/4.
 *
 * 自定义节点
 */

import utils from '../utils/index'

export default {
  name: 'custom-node',
  extendName: 'node',
  options: {
    anchor: {
      type: 'circle',
      points: [
        [0.5, 0],
        [1, 0.5],
        [0.5, 1],
        [0, 0.5]
      ]
    },
    setState (name, value, item) {
      // 设置锚点激活
      utils.setAnchorActive(name, value, item)
    },
    draw (cfg, group) {
      console.log('cfg', cfg)
      let x = 0
      let y = 0
      let width = 100
      let height = 100
      let r = 6
      // 激活状态
      group.addShape('rect', {
        attrs: {
          x: x,
          y: y,
          width: width,
          height: width,
          stroke: 'black',
          fill: '#FFFFFF'
        }
      })
      // 上
      group.addShape('circle', {
        attrs: {
          x: (width - r) / 2,
          y: y,
          r: r,
          name: 'anchor',
          fill: '#91d5ff',
          fillOpacity: 0,
          strokeOpacity: 0
        }
      })
      // 右
      group.addShape('circle', {
        attrs: {
          x: width,
          y: (height - r) / 2,
          r: r,
          name: 'anchor',
          fill: '#91d5ff'
        }
      })
      // 下
      group.addShape('circle', {
        attrs: {
          x: (width - r) / 2,
          y: height,
          r: r,
          name: 'anchor',
          fill: '#91d5ff'
        }
      })
      // 左
      group.addShape('circle', {
        attrs: {
          x: x,
          y: (height - y) / 2,
          r: r,
          name: 'anchor',
          fill: '#91d5ff'
        }
      })
      return group
    }
  }
}
