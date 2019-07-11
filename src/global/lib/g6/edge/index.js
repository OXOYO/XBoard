/**
 * Created by OXOYO on 2019/7/4.
 *
 * 注册边
 */

import line from './line'
import cubic from './cubic'

const obj = {
  line,
  cubic
}

export default function (G6) {
  Object.values(obj).map(item => {
    G6.registerEdge(item.name, item.options, item.extendName)
  })
}
