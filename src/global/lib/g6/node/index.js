/**
 * Created by OXOYO on 2019/7/4.
 *
 * 注册节点
 */

// import anchorNode from './anchorNode'
// import customNode from './customNode'
// import jumpNode from './jumpNode'

import anchorRect from './anchorRect'
import anchorCircle from './anchorCircle'

const obj = {
  // anchorNode
  // customNode,
  // jumpNode
  anchorRect,
  anchorCircle
}

export default function (G6) {
  // 再注册其他常规节点
  Object.values(obj).map(item => {
    G6.registerNode(item.name, item.options, item.extendName)
  })
}
