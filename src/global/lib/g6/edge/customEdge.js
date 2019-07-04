/**
 * Created by OXOYO on 2019/7/4.
 *
 * 自定义边
 */

export default {
  name: 'custom-edge',
  extendName: '',
  options: {
    draw (cfg, group) {
      console.log('cfg', cfg, group)
      let startPoint = cfg.startPoint
      let endPoint = cfg.endPoint
      console.log(startPoint, endPoint)
      // const group = item.getGraphicGroup()
      let p1 = [startPoint.x, startPoint.y]
      let p4 = [endPoint.x, endPoint.y]
      let p2 = [p1[0], p1[1] - 20]
      let p3 = [p4[0], p2[1]]
      console.log(p1, p2, p3, p4)
      group.addShape('polyline', {
        attrs: {
          points: [p1, p2, p3, p4],
          stroke: 'red'
        }
      })
      return group
    }
  }
}
