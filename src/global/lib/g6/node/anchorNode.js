/**
 * Created by OXOYO on 2019/7/4.
 *
 * 锚点节点
 */

// 继承 node，新增画锚点
export default {
  name: 'anchor-node',
  extendName: 'node',
  options: {
    // setState (name, value, item) {
    //   let group = item.getContainer()
    //   console.log('setState', name)
    //   if (name === 'hover') {
    //     let children = group.get('children')
    //     console.log('children', children)
    //     let marker = children[2]
    //     console.log('marker', marker, value)
    //     if (value) {
    //       marker.attr({
    //         fill: 'red'
    //       })
    //     } else {
    //       marker.attr({
    //         fill: 'green'
    //       })
    //     }
    //   }
    // },
    // 绘制后附加锚点
    afterDraw (cfg, group) {
      const { anchorPoints, width, height, id } = cfg
      anchorPoints.forEach((points, index) => {
        const [x, y, anchorCfg] = points
        // 把原点置为图形左上角
        const originX = -width / 2
        const originY = -height / 2
        const anchorPointX = x * width + originX
        const anchorPointY = y * height + originY
        group.addShape('marker', {
          // 临时解决无法监听 anchor 事件的问题
          name: 'anchor',
          anchorCfg,
          id,
          index,
          attrs: {
            symbol: 'circle',
            radius: 3.5,
            fill: '#fff',
            stroke: '#1890FF',
            lineAppendWidth: 12,
            fillOpacity: 1,
            x: anchorPointX,
            y: anchorPointY
          }
        })
      })
    }
  }
}
