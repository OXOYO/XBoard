/**
 * Created by OXOYO on 2019/7/4.
 *
 * 注册节点
 */

import anchorNode from './anchorNode'
// import customNode from './customNode'
// import jumpNode from './jumpNode'

const obj = {
  anchorNode
  // ,
  // customNode,
  // jumpNode
}

export default function (G6) {
  Object.values(obj).map(item => {
    G6.registerNode(item.name, item.options, item.extendName)
  })
}
