/**
* Created by OXOYO on 2019/7/1.
*
* ToolBar 工具栏
*/

<style scoped lang="less" rel="stylesheet/less">
  .tool-bar {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-content: flex-start;
    width: 100%;
    height: 40px;
    padding: 0 20px;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    box-shadow: 0 0 2px 2px rgba(0, 0, 0, .1);
    background: #ffffff;
    z-index: 500;

    .tool-box {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;
      align-content: flex-start;
      flex: 1 1 auto;

      &.left {
        justify-content: flex-start;
      }
      &.center {
        justify-content: center;
      }
      &.right {
        justify-content: flex-end;
      }
      .tool-item {
        display: inline-block;
      }
    }
  }
</style>

<template>
  <div class="tool-bar">
    <template v-for="(type, typeIndex) in Object.keys(toolMap)">
      <ToolBox :key="typeIndex" :class="type">
        <template v-for="(item, index) in toolMap[type].filter(target => target.enable)">
          <!-- 颜色 -->
          <ToolItem
            v-if="['fill', 'lineColor'].includes(item.name)"
            :key="'tool_' + type + '_item_' + index"
            :active="item.active"
            :disabled="item.disabled"
          >
            <template v-slot:label>
              <template v-if="item.disabled">
                <div>
                  <XIcon
                    :type="item.icon"
                    :title="$t(item.lang)"
                    style="vertical-align: middle;"
                  >
                  </XIcon>
                  <Icon type="ios-arrow-down"></Icon>
                </div>
              </template>
              <template v-else>
                <Dropdown trigger="click" @on-click="(name) => handleDropdownClick(item, type, name)">
                  <div>
                    <XIcon
                      :type="item.icon"
                      :title="$t(item.lang)"
                      style="vertical-align: middle;"
                    >
                    </XIcon>
                    <Icon type="ios-arrow-down"></Icon>
                  </div>
                  <SketchPicker slot="list" :value="formData[item.name]" @input="(val) => handleToolClick(item, type, val)"></SketchPicker>
                </Dropdown>
              </template>
            </template>
          </ToolItem>
          <ToolItem
            v-else-if="item.children"
            :key="'tool_' + type + '_item_' + index"
            :active="item.active"
            :disabled="item.disabled"
          >
            <template v-slot:label>
              <template v-if="item.disabled">
                <div>
                  <XIcon
                    :type="item.children[item.selected].icon"
                    :title="$t(item.children[item.selected].lang)"
                    style="vertical-align: middle;"
                  >
                  </XIcon>
                  <Icon type="ios-arrow-down"></Icon>
                </div>
              </template>
              <template v-else>
                <Dropdown trigger="click" @on-click="(name) => handleDropdownClick(item, type, name)">
                  <div>
                    <XIcon
                      :type="item.children[item.selected].icon || item.icon"
                      :title="$t(item.children[item.selected].lang)"
                      style="vertical-align: middle;"
                    >
                    </XIcon>
                    <Icon type="ios-arrow-down"></Icon>
                  </div>
                  <DropdownMenu slot="list">
                    <DropdownItem
                      v-for="(child, childIndex) in item.children"
                      :key="childIndex"
                      :name="childIndex"
                      :disabled="child.disabled"
                      :divided="child.divided"
                      :selected="item.selected === childIndex"
                    >
                      <template v-if="child.icon">
                        <XIcon :type="child.icon" :title="$t(child.lang)"></XIcon>
                      </template>
                      <template v-else>
                        <span>{{ child.lang ? $t(child.lang) : child.label }}</span>
                      </template>
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </template>
            </template>
          </ToolItem>
          <ToolItem
            v-else
            :key="'tool_' + type + '_item_' + index"
            :active="item.active"
            :disabled="item.disabled"
            @click.native="handleToolClick(item, type)"
          >
            <template v-slot:label>
              <XIcon :type="item.icon" :title="$t(item.lang)"></XIcon>
            </template>
          </ToolItem>
          <Divider :key="'tool_' + type + '_divider_' + index" v-if="item.divider" type="vertical" style="height: 100%;" />
        </template>
      </ToolBox>
    </template>
  </div>
</template>

<script>
  import ToolBox from '../../ToolBox/Index'
  import ToolItem from '../../ToolBox/ToolItem'
  import config from '../config/index'

  export default {
    name: 'ToolBar',
    components: {
      ToolBox,
      ToolItem
    },
    data () {
      return {
        // 模式
        mode: 'edit',
        // 选中的值
        selected: {
          lineWidth: 0,
          lineType: 0
        },
        formData: {
          ...config.$X
        }
      }
    },
    computed: {
      toolMap () {
        let _t = this
        return {
          left: [
            {
              name: 'add',
              label: 'Add',
              lang: '',
              icon: 'add',
              enable: true,
              divider: false
            }
          ],
          center: [
            {
              name: 'undo',
              label: 'Undo',
              lang: 'L10007',
              icon: 'undo',
              enable: true,
              disabled: _t.mode === 'preview',
              divider: false
            },
            {
              name: 'redo',
              label: 'Redo',
              lang: 'L10008',
              icon: 'redo',
              enable: true,
              disabled: _t.mode === 'preview',
              divider: true
            },
            {
              name: 'copy',
              label: 'Copy',
              lang: '',
              icon: 'copy',
              enable: true,
              disabled: _t.mode === 'preview',
              divider: false
            },
            {
              name: 'paste',
              label: 'Paste',
              lang: '',
              icon: 'paste',
              enable: true,
              disabled: _t.mode === 'preview',
              divider: false
            },
            {
              name: 'clear',
              label: 'Clear',
              lang: '',
              icon: 'clear',
              enable: true,
              disabled: _t.mode === 'preview',
              divider: true
            },
            {
              name: 'zoomIn',
              label: 'Zoom In',
              lang: '',
              icon: 'zoom-in',
              enable: true,
              disabled: false,
              divider: false
            },
            {
              name: 'zoomOut',
              label: 'Zoom Out',
              lang: '',
              icon: 'zoom-out',
              enable: true,
              disabled: false,
              divider: false
            },
            {
              name: 'fit',
              label: 'Fit',
              lang: '',
              icon: 'fit',
              enable: true,
              disabled: false,
              divider: false
            },
            {
              name: 'actualSize',
              label: 'Actual Size',
              lang: '',
              icon: 'actual-size',
              enable: true,
              disabled: false,
              divider: true
            },
            {
              name: 'fill',
              label: 'fill',
              lang: '',
              icon: 'fill',
              enable: true,
              disabled: _t.mode === 'preview',
              divider: false
            },
            {
              name: 'lineColor',
              label: 'line color',
              lang: '',
              icon: 'line-color',
              enable: true,
              disabled: _t.mode === 'preview',
              divider: false
            },
            {
              name: 'lineWidth',
              label: 'line width',
              lang: '',
              icon: 'line-width',
              enable: true,
              disabled: _t.mode === 'preview',
              divider: false,
              // 默认选中项index
              selected: _t.selected.lineWidth,
              // 子节点
              children: [
                {
                  name: 1,
                  label: '1px',
                  lang: '',
                  icon: '',
                  enable: true,
                  disabled: false,
                  divider: false
                },
                {
                  name: 2,
                  label: '2px',
                  lang: '',
                  icon: '',
                  enable: true,
                  disabled: false,
                  divider: false
                },
                {
                  name: 3,
                  label: '3px',
                  lang: '',
                  icon: '',
                  enable: true,
                  disabled: false,
                  divider: false
                },
                {
                  name: 4,
                  label: '4px',
                  lang: '',
                  icon: '',
                  enable: true,
                  disabled: false,
                  divider: false
                },
                {
                  name: 5,
                  label: '5px',
                  lang: '',
                  icon: '',
                  enable: true,
                  disabled: false,
                  divider: false
                },
                {
                  name: 6,
                  label: '6px',
                  lang: '',
                  icon: '',
                  enable: true,
                  disabled: false,
                  divider: false
                },
                {
                  name: 7,
                  label: '7px',
                  lang: '',
                  icon: '',
                  enable: true,
                  disabled: false,
                  divider: false
                },
                {
                  name: 8,
                  label: '8px',
                  lang: '',
                  icon: '',
                  enable: true,
                  disabled: false,
                  divider: false
                },
                {
                  name: 9,
                  label: '9px',
                  lang: '',
                  icon: '',
                  enable: true,
                  disabled: false,
                  divider: false
                },
                {
                  name: 10,
                  label: '10px',
                  lang: '',
                  icon: '',
                  enable: true,
                  disabled: false,
                  divider: false
                }
              ]
            },
            {
              name: 'lineStyle',
              label: 'line style',
              lang: '',
              icon: 'line-style',
              enable: true,
              disabled: _t.mode === 'preview',
              divider: true
            },
            {
              name: 'lineType',
              label: 'line type',
              lang: '',
              icon: '',
              enable: true,
              disabled: _t.mode === 'preview',
              divider: true,
              // 默认选中项index
              selected: _t.selected.lineType,
              // 子节点
              children: [
                {
                  name: 'x-line',
                  label: 'line',
                  lang: '',
                  icon: 'flow-line',
                  enable: true,
                  disabled: false,
                  divider: false
                },
                {
                  name: 'x-broken',
                  label: 'broken',
                  lang: '',
                  icon: 'flow-broken',
                  enable: true,
                  disabled: false,
                  divider: false
                },
                {
                  name: 'x-cubic',
                  label: 'cubic',
                  lang: '',
                  icon: 'flow-curve',
                  enable: true,
                  disabled: false,
                  divider: false
                }
              ]
            },
            {
              name: 'toBack',
              label: 'To Back',
              lang: '',
              icon: 'to-back',
              enable: true,
              disabled: _t.mode === 'preview',
              divider: false
            },
            {
              name: 'toFront',
              label: 'To Front',
              lang: '',
              icon: 'to-front',
              enable: true,
              disabled: _t.mode === 'preview',
              divider: true
            },
            {
              name: 'marquee',
              label: 'Marquee',
              lang: 'L10002',
              icon: 'marquee',
              enable: true,
              disabled: _t.mode === 'preview',
              divider: false
            },
            {
              name: 'group',
              label: 'Group',
              lang: '',
              icon: 'group',
              enable: true,
              disabled: _t.mode === 'preview',
              divider: false
            },
            {
              name: 'ungroup',
              label: 'Ungroup',
              lang: '',
              icon: 'ungroup',
              enable: true,
              disabled: _t.mode === 'preview',
              divider: true
            },
            {
              name: 'edit',
              label: 'edit',
              lang: '',
              icon: 'edit',
              enable: _t.mode === 'preview',
              disabled: false,
              divider: false
            },
            {
              name: 'preview',
              label: 'preview',
              lang: '',
              icon: 'preview',
              enable: _t.mode === 'edit',
              disabled: false,
              divider: false
            }
          ],
          right: [
            {
              name: 'back',
              label: 'Back',
              lang: '',
              icon: 'back',
              enable: true,
              divider: false
            },
            {
              name: 'close',
              label: 'Close',
              lang: '',
              icon: 'close',
              enable: true,
              divider: false
            }
          ]
        }
      }
    },
    methods: {
      handleDropdownClick (item, type, name) {
        let _t = this
        console.log('item', item, type, name)
        switch (item.name) {
          case 'lineWidth':
          case 'lineType':
            _t.selected[item.name] = name
            let child = item.children[name]
            _t.formData[item.name] = child.name
            _t.$X.utils.bus.$emit('board/materials/editor/tool/trigger', {
              name: item.name,
              data: child.name
            })
            break
        }
      },
      handleToolClick (item, type, val) {
        let _t = this
        if (item.disabled) {
          return
        }
        console.log('MaterialsEditor tool click', item.name, type, val)
        if (type === 'center') {
          let data = {}
          switch (item.name) {
            case 'edit':
              _t.mode = 'edit'
              break
            case 'preview':
              _t.mode = 'preview'
              break
            case 'fill':
            case 'lineColor':
              let color = val.hex8
              _t.formData[item.name] = color
              data = color
              break
          }
          _t.$X.utils.bus.$emit('board/materials/editor/tool/trigger', {
            name: item.name,
            data: data
          })
        } else {
          switch (item.name) {
            case 'back':
              _t.$X.utils.bus.$emit('board/materials/editor/back')
              break
            case 'close':
              _t.$X.utils.bus.$emit('board/materials/editor/close')
              break
          }
        }
      }
    }
  }
</script>
