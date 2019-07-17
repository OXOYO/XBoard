/**
 * Created by OXOYO on 2019/7/4.
 *
 * 注册交互
 */

import drawLine from './drawLine'
import dragNodeToEditor from './dragNodeToEditor'
import shapeControl from './shapeControl'
import nodeControl from './nodeControl'

const obj = {
  drawLine,
  dragNodeToEditor,
  shapeControl,
  nodeControl
}

export default function (G6) {
  Object.values(obj).map(item => {
    G6.registerBehavior(item.name, item.options)
  })
}
