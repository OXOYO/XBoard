/**
 * Created by OXOYO on 2019/7/16.
 *
 * 设置锚点激活
 */

import config from '../config/index'

export default function (name, value, item) {
  if (name === 'active') {
    let group = item.getContainer()
    let children = group.get('children')
    let line = children[0]
    // 处理线条状态
    if (line) {
      if (value) {
        line.attr(config.line.style.active)
      } else {
        line.attr(config.line.style.inactive)
      }
    }
  }
}
