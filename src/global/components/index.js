/**
 * Created by OXOYO on 2019/5/29.
 *
 * 全局组件
 */

import {
  Menu,
  MenuItem,
  Tooltip,
  Divider,
  ColorPicker,
  InputNumber,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Icon,
  Message,
  Modal
} from 'iview'

import XIcon from './Icon/Index'
import XTooltip from './Tooltip/Index'

const obj = {
  // ui组件
  Menu,
  MenuItem,
  Tooltip,
  Divider,
  ColorPicker,
  InputNumber,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Icon,
  Message,
  Modal,
  // 自定义组件
  XIcon,
  XTooltip
}

const components = {}
components.install = function (Vue, options) {
  for (let name in obj) {
    if (name && obj[name]) {
      Vue.component(name, obj[name])
      if (['Message', 'Modal'].includes(name)) {
        console.log('name', name, `$${name}`)
        Vue.prototype[`$${name}`] = obj[name]
      }
    }
  }
}

export default components
