/**
 * Created by OXOYO on 2019/7/4.
 *
 * 自定义节点
 */

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
    draw (cfg, group) {
      console.log('cfg', cfg)
      let x = 0
      let y = 0
      let width = 100
      let height = 100
      let r = 6
      group.addShape('image', {
        attrs: {
          x: x + 5,
          y: x + 5,
          width: width - 10,
          height: width - 10,
          img: './ecs.svg'
        }
      })
      // 激活状态
      group.addShape('rect', {
        attrs: {
          x: x,
          y: y,
          width: width,
          height: width,
          stroke: 'black'
        }
      })
      // 上
      group.addShape('circle', {
        attrs: {
          x: (width - r) / 2,
          y: y,
          r: r,
          fill: '#91d5ff'
        }
      })
      // 右
      group.addShape('circle', {
        attrs: {
          x: width,
          y: (height - r) / 2,
          r: r,
          fill: '#91d5ff'
        }
      })
      // 下
      group.addShape('circle', {
        attrs: {
          x: (width - r) / 2,
          y: height,
          r: r,
          fill: '#91d5ff'
        }
      })
      // 左
      group.addShape('circle', {
        attrs: {
          x: x,
          y: (height - y) / 2,
          r: r,
          fill: '#91d5ff'
        }
      })
      return group
    }
  }
}
