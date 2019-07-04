/**
 * Created by OXOYO on 2019/7/4.
 *
 * 注册边
 */

import customEdge from './customEdge'

const obj = {
  customEdge
}

export default function (G6) {
  Object.values(obj).map(item => {
    G6.registerEdge(item.name, item.options, item.extendName)
  })
}
