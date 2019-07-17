/**
 * Created by OXOYO on 2019/7/17.
 *
 * 节点控制
 */

import G6 from '@antv/g6'
import config from '../config/index'
import utils from '../utils/index'

export default {
  name: 'node-control',
  options: {
    getEvents () {
      return {
        'editor:addnode': 'startAddNode',
        'node:mousedown': 'onNodeMousedown',
        'node:mouseup': 'onNodeMouseup',
        'mousemove': 'onMousemove',
        'canvas:mouseenter': 'onCanvasMouseenter',
        'mouseup': 'onCanvasMouseup',
        'canvas:mouseleave': 'onCanvasMouseleave',
        'edge:mouseup': 'onEdgeMouseup'
      }
    },
    onNodeMousedown (event) {
      let _t = this
      // 初始化数据
      _t.info = {
        type: null,
        node: event.item,
        target: event.target
      }
      console.log('_t.info.target._attrs.name', _t.info.target._attrs.name)
      if (_t.info.target && _t.info.target._attrs.name) {
        switch (_t.info.target._attrs.name) {
          case 'anchor':
            _t.info.type = 'drawLine'
            break
          case 'shapeControlPoint':
            _t.info.type = 'shapeControl'
            break
        }
      } else {
        _t.info.type = 'dragNode'
      }
      if (_t.info && _t.info.type) {
        _t[_t.info.type].start.call(_t, event)
      }
    },
    onMousemove (event) {
      let _t = this
      console.log('onMousemove')
      if (_t.info && _t.info.type) {
        _t[_t.info.type].move.call(_t, event)
      }
    },
    onCanvasMouseenter (event) {
      let _t = this
      console.log('onCanvasMouseenter')
      if (_t.info && _t.info.type === 'dragNode') {
        _t[_t.info.type].createDottedNode.call(_t, event)
      }
    },
    onCanvasMouseup (event) {
      let _t = this
      console.log('onCanvasMouseup')
      if (_t.info && _t.info.type === 'dragNode') {
        if (_t.dragNode.status === 'dragNodeToEditor') {
          _t[_t.info.type].createNode.call(_t, event)
        // } else if (_t.dragNode.status === 'dragNode') {
        //   _t[_t.info.type].updateNode.call(_t, event)
        }
      }
    },
    onCanvasMouseleave (event) {
      let _t = this
      console.log('onCanvasMouseleave')
      if (_t.info && _t.info.type === 'dragNode') {
        _t[_t.info.type].stop.call(_t, event)
      }
    },
    onNodeMouseup (event) {
      let _t = this
      console.log('onNodeMouseup')
      if (_t.info && _t.info.type) {
        _t[_t.info.type].stop.call(_t, event)
      }
    },
    onEdgeMouseup (event) {
      let _t = this
      if (_t.info && _t.info.type === 'drawLine') {
        _t[_t.info.type].stop.call(_t, event)
      }
    },
    startAddNode (node) {
      let _t = this
      // 初始化数据
      _t.info = {
        type: 'dragNode',
        node: node,
        target: null
      }
      _t.dragNode.status = 'dragNodeToEditor'
    },
    drawLine: {
      isMoving: false,
      currentLine: null,
      start: function (event) {
        let _t = this
        let target
        // 锚点数据
        let anchorPoints = _t.info.node.getAnchorPoints()
        // 处理线条目标点
        if (anchorPoints && anchorPoints.length) {
          // 获取距离指定坐标最近的一个锚点
          target = _t.info.node.getLinkPoint({ x: event.x, y: event.y })
        } else {
          target = _t.info.node
        }
        _t.drawLine.currentLine = _t.graph.addItem('edge', {
          // 起始节点
          source: target,
          // 终止节点/位置
          target: {
            x: event.x,
            y: event.y
          },
          // FIXME 边的形式需要与工具栏联动
          shape: _t.graph.$X.lineType || 'line',
          startArrow: _t.graph.$X.startArrow || false,
          endArrow: _t.graph.$X.endArrow || false
        })
        _t.drawLine.isMoving = true
      },
      move (event) {
        let _t = this
        if (_t.drawLine.isMoving && _t.drawLine.currentLine) {
          _t.graph.updateItem(_t.drawLine.currentLine, {
            target: {
              x: event.x,
              y: event.y
            }
          })
        }
      },
      stop (event) {
        let _t = this
        if (_t.drawLine.isMoving) {
          if (_t.drawLine.currentLine === event.item) {
            // 画线过程中点击则移除当前画线
            _t.graph.removeItem(event.item)
          } else {
            let stopNode = event.item
            let target
            // 锚点数据
            let anchorPoints = stopNode.getAnchorPoints()
            // 处理线条目标点
            if (anchorPoints && anchorPoints.length) {
              // 获取距离指定坐标最近的一个锚点
              target = stopNode.getLinkPoint({ x: event.x, y: event.y })
            } else {
              target = stopNode
            }
            _t.graph.updateItem(_t.drawLine.currentLine, {
              target: target
            })
          }
        }
        _t.drawLine.currentLine = null
        _t.drawLine.isMoving = false
        _t.info = null
      }
    },
    shapeControl: {
      isMoving: false,
      startPoint: null,
      start (event) {
        let _t = this
        let model = _t.info.node.getModel()
        _t.shapeControl.startPoint = {
          x: model.x,
          y: model.y,
          size: model.size || []
        }
        _t.shapeControl.isMoving = true
      },
      move (event) {
        let _t = this
        if (_t.info.node && _t.info.target && _t.shapeControl.startPoint && _t.shapeControl.isMoving) {
          let model = _t.info.node.getModel()
          // 判断位置
          let targetAttrs = _t.info.target._attrs
          let position = targetAttrs.position
          let attrs = {
            x: _t.shapeControl.startPoint.x,
            y: _t.shapeControl.startPoint.y,
            size: model.size || []
          }
          let width = model.width
          let height = model.height
          if (position) {
            // 参照点，及当前controller的对角点
            let referencePoint = {}
            if (position.x === 0) {
              if (position.y === 0) {
                referencePoint = {
                  x: _t.shapeControl.startPoint.x + width / 2,
                  y: _t.shapeControl.startPoint.y + height / 2
                }
                // 计算宽、高
                attrs.size[0] = Math.abs(referencePoint.x - event.x)
                attrs.size[1] = Math.abs(referencePoint.y - event.y)
                // 计算中心点坐标
                attrs.x = event.x + attrs.size[0] / 2
                attrs.y = event.y + attrs.size[1] / 2
              } else if (position.y === 1) {
                referencePoint = {
                  x: _t.shapeControl.startPoint.x + width / 2,
                  y: _t.shapeControl.startPoint.y - height / 2
                }
                // 计算宽、高
                attrs.size[0] = Math.abs(referencePoint.x - event.x)
                attrs.size[1] = Math.abs(referencePoint.y - event.y)
                // 计算中心点坐标
                attrs.x = event.x + attrs.size[0] / 2
                attrs.y = event.y - attrs.size[1] / 2
              }
            } else if (position.x === 1) {
              if (position.y === 0) {
                referencePoint = {
                  x: _t.shapeControl.startPoint.x - width / 2,
                  y: _t.shapeControl.startPoint.y + height / 2
                }
                // 计算宽、高
                attrs.size[0] = Math.abs(referencePoint.x - event.x)
                attrs.size[1] = Math.abs(referencePoint.y - event.y)
                // 计算中心点坐标
                attrs.x = event.x - attrs.size[0] / 2
                attrs.y = event.y + attrs.size[1] / 2
              } else if (position.y === 1) {
                referencePoint = {
                  x: _t.shapeControl.startPoint.x - width / 2,
                  y: _t.shapeControl.startPoint.y - height / 2
                }
                // 计算宽、高
                attrs.size[0] = Math.abs(referencePoint.x - event.x)
                attrs.size[1] = Math.abs(referencePoint.y - event.y)
                // 计算中心点坐标
                attrs.x = event.x - attrs.size[0] / 2
                attrs.y = event.y - attrs.size[1] / 2
              }
            }
          }
          if (attrs.size[0] < _t.minWidth || attrs.size[1] < _t.minHeight) {
            return
          }
          // 当前节点容器
          let group = _t.info.node.getContainer()
          // 更新锚点
          utils.updateAnchor({
            ..._t.info.node.getModel(),
            width: attrs.size[0],
            height: attrs.size[1]
          }, group)
          // 更新shapeControl
          utils.updateShapeControl({
            ..._t.info.node.getModel(),
            width: attrs.size[0],
            height: attrs.size[1]
          }, group)
          _t.info.node.update(attrs)
          // 绘制
          _t.graph.paint()
        }
      },
      stop (event) {
        let _t = this
        _t.shapeControl.startPoint = null
        _t.shapeControl.isMoving = false
        _t.info = null
      }
    },
    dragNode: {
      dottedNode: null,
      status: null,
      // 虚线框节点样式
      dottedNodeStyle: {
        ...config.dottedNode.style.default
      },
      createDottedNode (event) {
        let _t = this
        if (!_t.dragNode.dottedNode && _t.info.node) {
          let { width, height } = _t.info.node
          let group = _t.graph.get('group')
          _t.dragNode.dottedNode = group.addShape('rect', {
            attrs: {
              ..._t.dragNode.dottedNodeStyle,
              width,
              height,
              x: event.x - width / 2,
              y: event.y - height / 2,
              fill: 'green'
            }
          })
          _t.graph.paint()
        }
      },
      createNode (event) {
        let _t = this
        if (_t.dragNode.dottedNode && _t.info.node) {
          let { width, height } = _t.info.node
          let node = {
            ..._t.info.node,
            id: G6.Util.uniqueId(),
            x: event.x,
            y: event.y,
            size: [width, height]
          }
          _t.graph.addItem('node', node)
          _t.dragNode.clear.call(_t)
          _t.graph.paint()
        }
      },
      updateNode (event) {
        let _t = this
        if (_t.info.node) {
          let node = {
            x: event.x,
            y: event.y
          }
          _t.info.node.updatePosition(node)
          _t.dragNode.clear.call(_t)
          _t.graph.paint()
        }
      },
      start (event) {
        let _t = this
        console.log('dragNode Start...', _t.dragNode.dottedNode)
        _t.dragNode.createDottedNode.call(_t, event)
        _t.dragNode.status = 'dragNode'
      },
      move (event) {
        let _t = this
        if (_t.dragNode.status === 'dragNodeToEditor') {
          if (_t.dragNode.dottedNode && _t.info.node) {
            console.log('dragNode Move...', _t.dragNode.dottedNode)
            let { width, height } = _t.info.node
            _t.dragNode.dottedNode.attr({
              x: event.x - width / 2,
              y: event.y - height / 2,
              fill: 'red'
            })
            _t.graph.paint()
          }
        } else if (_t.dragNode.status === 'dragNode') {
          if (_t.info.node) {
            let node = {
              x: event.x,
              y: event.y
            }
            _t.info.node.updatePosition(node)
            _t.graph.paint()
          }
        }
      },
      stop (event) {
        let _t = this
        _t.dragNode.clear.call(_t)
        _t.graph.paint()
      },
      clear () {
        let _t = this
        if (_t.dragNode.dottedNode) {
          _t.dragNode.dottedNode.remove()
          _t.dragNode.dottedNode = null
        }
        _t.dragNode.status = null
        _t.info = null
      }
    }
  }
}
