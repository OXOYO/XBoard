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
          <ToolItem
            :key="'tool_' + type + '_item_' + index"
            :active="item.active"
            :disabled="item.disabled"
            @click.native="handleToolClick(item, type)"
          >
            <template v-slot:label>
              <XIcon :type="item.icon" :title="$t(item.lang)"></XIcon>
            </template>
          </ToolItem>
          <Divider :key="'tool_' + type + '_divider_' + index" v-if="item.divider" type="vertical" />
        </template>
      </ToolBox>
    </template>
  </div>
</template>

<script>
  import ToolBox from '../../ToolBox/Index'
  import ToolItem from '../../ToolBox/ToolItem'

  export default {
    name: 'ToolBar',
    components: {
      ToolBox,
      ToolItem
    },
    data () {
      return {
        toolMap: {
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
              divider: false
            },
            {
              name: 'redo',
              label: 'Redo',
              lang: 'L10008',
              icon: 'redo',
              enable: true,
              divider: true
            },
            {
              name: 'copy',
              label: 'Copy',
              lang: '',
              icon: 'copy',
              enable: true,
              divider: false
            },
            {
              name: 'paste',
              label: 'Paste',
              lang: '',
              icon: 'paste',
              enable: true,
              divider: false
            },
            {
              name: 'clear',
              label: 'Clear',
              lang: '',
              icon: 'clear',
              enable: true,
              divider: true
            },
            {
              name: 'zoomIn',
              label: 'Zoom In',
              lang: '',
              icon: 'zoom-in',
              enable: true,
              divider: false
            },
            {
              name: 'zoomOut',
              label: 'Zoom Out',
              lang: '',
              icon: 'zoom-out',
              enable: true,
              divider: false
            },
            {
              name: 'fit',
              label: 'Fit',
              lang: '',
              icon: 'fit',
              enable: true,
              divider: false
            },
            {
              name: 'actualSize',
              label: 'Actual Size',
              lang: '',
              icon: 'actual-size',
              enable: true,
              divider: true
            },
            {
              name: 'toBack',
              label: 'To Back',
              lang: '',
              icon: 'to-back',
              enable: true,
              divider: false
            },
            {
              name: 'toFront',
              label: 'To Front',
              lang: '',
              icon: 'to-front',
              enable: true,
              divider: true
            },
            {
              name: 'marquee',
              label: 'Marquee',
              lang: 'L10002',
              icon: 'marquee',
              enable: true,
              divider: false
            },
            {
              name: 'group',
              label: 'Group',
              lang: '',
              icon: 'group',
              enable: true,
              divider: false
            },
            {
              name: 'ungroup',
              label: 'Ungroup',
              lang: '',
              icon: 'ungroup',
              enable: true,
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
      handleToolClick (item, type) {
        let _t = this
        console.log('MaterialsEditor tool click', item.name)
        if (type === 'center') {
          _t.$X.utils.bus.$emit('board/materials/editor/tool/trigger', item.name)
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
