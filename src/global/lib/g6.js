/**
 * Created by OXOYO on 2019/7/3.
 *
 * 封装G6
 */

import G6 from '@antv/g6'
// 注册连线交互
G6.registerBehavior('draw-line', {
  getEvents () {
    return {
      'node:click': 'onClick',
      'mousemove': 'onMousemove',
      'edge:click': 'onEdgeClick' // 点击空白处，取消边
    }
  },
  onClick (ev) {
    const node = ev.item
    const graph = this.graph
    const point = { x: ev.x, y: ev.y }
    const model = node.getModel()
    if (this.addingEdge && this.edge) {
      graph.updateItem(this.edge, {
        target: model.id
      })

      this.edge = null
      this.addingEdge = false
    } else {
      this.edge = graph.addItem('edge', {
        source: model.id,
        target: point
      })
      this.addingEdge = true
    }
  },
  onMousemove (ev) {
    const point = { x: ev.x, y: ev.y }
    if (this.addingEdge && this.edge) {
      this.graph.updateItem(this.edge, {
        target: point
      })
    }
  },
  onEdgeClick (ev) {
    const graph = this.graph
    const currentEdge = ev.item
    // 拖拽过程中，点击会点击到新增的边上
    if (this.addingEdge && this.edge === currentEdge) {
      graph.removeItem(this.edge)
      this.edge = null
      this.addingEdge = false
    }
  }
})

// 定义拖动节点到画布
G6.registerBehavior('drag-node-to-editor', {
  getDefaultCfg () {
    return {
      delegateShapeStyle: {
        fill: '#F3F9FF',
        fillOpacity: 0.5,
        stroke: '#1890FF',
        strokeOpacity: 0.9,
        lineDash: [ 5, 5 ]
      },
      defaultNodeStyle: {
        stroke: '#CED4D9',
        shadowOffsetX: 0,
        shadowOffsetY: 4,
        shadowBlur: 10,
        shadowColor: 'rgba(13, 26, 38, 0.08)',
        lineWidth: 1,
        radius: 4,
        fillOpacity: 0.92
      }
    }
  },
  getEvents () {
    return {
      'flow:addnode': 'startAddNode',
      // 移入 canvas，创建一个代理矩形
      'canvas:mouseenter': 'onMouseenter',
      // 更新代理矩形位置
      'canvas:mousemove': 'onMousemove',
      // 移除代理矩形，新增配置节点
      'canvas:mouseup': 'onMouseup',
      // 移除canvas，移除代理矩形
      'canvas:mouseleave': 'onMouseleave'
    }
  },
  // 开始添加
  startAddNode (node) {
    this.addingNode = node
  },
  onMouseenter (ev) {
    const { x, y } = ev
    if (!this.delegateShape && this.addingNode) {
      const { width, height } = this.addingNode
      const parent = this.graph.get('group')
      this.delegateShape = parent.addShape('rect', {
        attrs: {
          width,
          height,
          x: x - width / 2,
          y: y - height / 2,
          ...this.delegateShapeStyle
        }
      })
      this.delegateShape.set('capture', false)
    }
  },
  onMousemove (ev) {
    const { x, y } = ev
    if (this.delegateShape && this.addingNode) {
      const { width, height } = this.addingNode
      this.delegateShape.attr({ x: x - width / 2, y: y - height / 2 })
      this.graph.paint()
    }
  },
  onMouseup (ev) {
    const { x, y } = ev
    if (this.delegateShape && this.addingNode) {
      const model = {
        id: G6.Util.uniqueId(),
        isShowAnchor: true,
        x,
        y,
        size: [this.addingNode.width, this.addingNode.height],
        style: this.defaultNodeStyle,
        anchorPoints: [[0.5, 0]],
        ...this.addingNode
      }
      this.graph.add('node', model)
      this.delegateShape.remove()
      this.delegateShape = undefined
      this.addingNode = undefined
      this.graph.paint()
    }
  },
  onMouseleave () {
    if (this.delegateShape && this.addingNode) {
      this.delegateShape.remove()
      this.delegateShape = undefined
      this.addingNode = undefined
      this.graph.paint()
    }
  }
})

G6.registerEdge('customEdge', {
  draw (item) {
    console.log(item)
    let source = item.source.getAnchorPoints()
    let target = item.target.getAnchorPoints()
    console.log(source, target)
    const group = item.getGraphicGroup()
    let p1 = [source[0].x, source[0].y]
    let p4 = [target[0].x, target[0].y]
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
})

G6.registerNode('customNode', {
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
})

export default G6
