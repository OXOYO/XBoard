/**
 * Created by OXOYO on 2019/5/29.
 *
 * 全局组件
 */

import Icon from './Icon/Index'
import Tooltip from './Tooltip/Index'
// 前缀
const PREFIX = 'X'

const obj = {
  Icon,
  Tooltip
}

const components = {}
components.install = function (Vue, options) {
  for (let name in obj) {
    if (name && obj[name]) {
      Vue.component(`${PREFIX}${name}`, obj[name])
    }
  }
}

export default components
