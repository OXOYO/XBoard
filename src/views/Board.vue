/**
* Created by OXOYO on 2019/5/17.
*
* Board
*/

<style lang="less" rel="stylesheet/less">
  .board {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    /*box-shadow: 0 0 5px 2px rgba(0, 0, 0, .1);*/
    background: #fff;

    .header {
      position: absolute;
      top: 10px;
      display: inline-block;
      text-align: center;
      z-index: 2000;
      background: transparent;
      cursor: default;
    }
    .body {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: 1000;
    }
    .footer {
      position: absolute;
      bottom: 0;
      display: inline-block;
      text-align: center;
      z-index: 2000;
      background: transparent;
      width: 100%;
      cursor: default;
    }
  }
  .theme-label {
    display: inline-block;
    width: 30px;
    height: 30px;
    border-radius: 50%;
  }
  .theme-item {
    flex: 1 1 auto;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    margin: 5px;

    &:hover {
      box-shadow: 0 0 2px 2px rgba(0, 0, 0, .5);
    }
  }
</style>

<template>
  <div class="board" @click="handleBoardClick">
    <div
      class="body"
      @dblclick="handleBoardBodyDbClick"
      @contextmenu.stop.prevent="handleBoardBodyRightClick($event)"
    >
      <SignaturePad
        ref="signaturePad"
        :options="padOptions"
        :style="padStyle"
      >
      </SignaturePad>
      <ContextMenu></ContextMenu>
    </div>
    <div class="footer" v-show="status.footer" @mousedown="handleBoardFooterMouseDown" @contextmenu.stop.prevent>
      <ToolBox style="margin: 0 auto;">
        <template v-for="(item, index) in tools.common.filter(item => item.enable)">
          <ToolItem
            :key="index"
            :active="activeTool.name === item.name"
            @click.native="handleToolClick(item)"
          >
            <template v-slot:label>
              <!--<XTooltip :content="item.label">
                <XIcon :type="item.icon"></XIcon>
              </XTooltip>-->
              <Tooltip :content="item.label">
                <XIcon :type="item.icon"></XIcon>
              </Tooltip>
            </template>
          </ToolItem>
        </template>
        <!-- 撤销 -->
        <ToolItem v-if="tools.undo.enable" @click.native="handleUndoClick">
          <template v-slot:label>
            <XTooltip :content="tools.undo.label">
              <XIcon :type="tools.undo.icon"></XIcon>
            </XTooltip>
          </template>
        </ToolItem>
        <!-- 全屏 -->
        <ToolItem v-if="tools.fullScreen.enable" @click.native="handleFullScreenClick">
          <template v-slot:label>
            <XTooltip :content="tools.fullScreen.label">
              <XIcon :type="tools.fullScreen.icon"></XIcon>
            </XTooltip>
          </template>
        </ToolItem>
        <!-- 颜色 -->
        <ToolItem v-if="tools.penColor.enable" style="opacity: 1;">
          <template v-slot:label>
            <XTooltip :content="tools.penColor.label">
              <ColorPicker v-model="formData.penColor" recommend alpha size="small" @on-change="(val) => handleFormChange('penColor', val)"/>
            </XTooltip>
          </template>
        </ToolItem>
        <!-- 背景色 -->
        <ToolItem v-if="tools.backgroundColor.enable" style="opacity: 1;">
          <template v-slot:label>
            <XTooltip :content="tools.backgroundColor.label">
              <!-- FIXME 使用:value形式进行绑定 -->
              <ColorPicker :value="formData.backgroundColor" recommend alpha size="small" @on-change="(val) => handleFormChange('backgroundColor', val)"/>
            </XTooltip>
          </template>
        </ToolItem>
        <!-- 画笔大小 -->
        <ToolItem v-if="tools.dotSize.enable" style="opacity: 1;">
          <template v-slot:label>
            <XTooltip :content="tools.dotSize.label">
              <InputNumber v-model="formData.dotSize" :max="10" :min="1" size="small" @on-change="(val) => handleFormChange('dotSize', val)"></InputNumber>
            </XTooltip>
          </template>
        </ToolItem>
      </ToolBox>
    </div>
  </div>
</template>

<script>
  import ToolBox from '../components/ToolBox/Index'
  import ToolItem from '../components/ToolBox/ToolItem'
  import SignaturePad from '../components/SignaturePad/Index'
  import ContextMenu from '../components/ContextMenu/Index'
  // 热键
  import Mousetrap from 'mousetrap'

  export default {
    name: 'Board',
    components: {
      ToolBox,
      ToolItem,
      SignaturePad,
      ContextMenu
    },
    data () {
      return {
        status: {
          footer: true
        },
        formData: {
          penColor: '#222F3D',
          backgroundColor: 'rgba(255, 255, 255, 1)',
          dotSize: 1
        },
        tools: {
          common: [
            {
              name: 'move',
              label: 'Move (V)',
              icon: 'move',
              shortcuts: 'v',
              cursor: 'move',
              enable: true
            },
            {
              name: 'marquee',
              label: 'Marquee (M)',
              icon: 'marquee',
              shortcuts: 'm',
              cursor: '',
              enable: true
            },
            {
              name: 'pencil',
              label: 'Pencil (P)',
              icon: 'pencil',
              shortcuts: 'b',
              cursor: '',
              enable: true
            },
            {
              name: 'line',
              label: 'Line (L)',
              icon: 'line',
              shortcuts: 'l',
              cursor: '',
              enable: true
            },
            {
              name: 'text',
              label: 'Text (T)',
              icon: 'text',
              shortcuts: 't',
              cursor: 'text',
              enable: true
            },
            {
              name: 'eraser',
              label: 'Eraser (E)',
              icon: 'eraser',
              shortcuts: 'e',
              cursor: '',
              enable: true
            }
          ],
          undo: {
            name: 'undo',
            label: 'Undo (Ctrl + Z)',
            icon: 'undo',
            shortcuts: 'ctrl+z',
            cursor: '',
            enable: true
          },
          fullScreen: {
            name: 'fullScreen',
            label: 'Full Screen',
            icon: 'full-screen',
            shortcuts: '',
            cursor: '',
            enable: true
          },
          penColor: {
            name: 'penColor',
            label: 'Color',
            icon: '',
            shortcuts: '',
            cursor: '',
            enable: true
          },
          backgroundColor: {
            name: 'backgroundColor',
            label: 'Background Color',
            icon: '',
            shortcuts: '',
            cursor: '',
            enable: true
          },
          dotSize: {
            name: 'dotSize',
            label: 'Size',
            icon: '',
            shortcuts: '',
            cursor: '',
            enable: true
          }
        },
        // 当前激活工具
        activeTool: null,
        // 画板配置
        padOptions: {},
        // 是否全屏
        isFullScreen: false,
        // 光标
        cursorMap: {
          // pencil: require('../assets/images/pencil.png'),
          // eraser: require('../assets/images/eraser.png'),
        }
      }
    },
    computed: {
      padStyle () {
        let _t = this
        let style = {
          cursor: 'auto'
        }
        if (['pencil', 'eraser'].includes(_t.activeTool.name)) {
          let png = require('../assets/images/pencil/png/' + _t.formData.dotSize + '.png')
          let svg = require('../assets/images/pencil/svg/' + _t.formData.dotSize + '.svg')
          style = {
            cursor: `url(${png}) 5 5, url(${svg}) 5 5, auto`
          }
        } else if (_t.activeTool.cursor) {
          style = {
            cursor: _t.activeTool.cursor
          }
        }
        console.log('ddddddd', style)
        return style
      }
    },
    methods: {
      init () {
        let _t = this
        // 初始化option
        _t.initPadOptions()
        // 初始化激活项
        _t.initActiveTool('pencil')
        // 绑定热键
        _t.bindShortcuts()
      },
      initPadOptions () {
        let _t = this
        _t.padOptions = {
          dotSize: _t.formData.dotSize,
          minWidth: _t.formData.dotSize * 0.3,
          maxWidth: _t.formData.dotSize * 1.7,
          backgroundColor: _t.formData.backgroundColor,
          penColor: _t.formData.penColor
        }
      },
      initActiveTool (name) {
        let _t = this
        _t.activeTool = _t.tools.common.find(target => target.name === name && target.enable)
      },
      bindShortcuts () {
        let _t = this
        for (let i = 0, len = _t.tools.common.length; i < len; i++) {
          let item = _t.tools.common[i]
          if (item.enable) {
            Mousetrap.bind(item.shortcuts, function () {
              _t.handleToolClick(item)
            })
          }
        }
        // 绑定undo
        if (_t.tools.undo.enable) {
          Mousetrap.bind(_t.tools.undo.shortcuts, _t.handleUndoClick)
        }
        // 绑定esc
        Mousetrap.bind('escape', function () {
          if (_t.isFullScreen) {
            _t.isFullScreen = false
          }
        })
      },
      handleBoardClick () {
        // 广播事件
        this.$X.utils.bus.$emit('platform/contextMenu/hide')
      },
      handleBoardFooterMouseDown () {
        // 广播事件
        this.$X.utils.bus.$emit('platform/contextMenu/hide')
      },
      handleBoardBodyDbClick () {
        let _t = this
        _t.switchStatus()
      },
      handleBoardBodyRightClick: function (event) {
        let _t = this
        let xVal = parseInt(event.clientX)
        let yVal = parseInt(event.clientY)
        let options = {
          x: xVal,
          y: yVal
        }
        // 广播事件
        _t.$X.utils.bus.$emit('platform/contextMenu/show', options)
      },
      handleToolClick (item) {
        let _t = this
        let el = _t.$refs.signaturePad
        _t.activeTool = item
        switch (item.name) {
          case 'pencil':
            el.draw()
            break
          case 'eraser':
            el.eraser()
            break
        }
      },
      handleUndoClick () {
        let _t = this
        let el = _t.$refs.signaturePad
        if (el && el.undo) {
          el.undo()
        }
      },
      handleFullScreenClick () {
        let _t = this
        // 判断标识或是否退出全屏操作
        if (_t.isFullScreen) {
          // 退出全屏
          if (document.exitFullscreen) {
            document.exitFullscreen()
          } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen()
          } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen()
          } else if (document.msExitFullscreen) {
            document.msExitFullscreen()
          }
        } else {
          // 全屏
          let docElm = document.documentElement
          if (docElm.requestFullscreen) {
            docElm.requestFullscreen()
          } else if (docElm.mozRequestFullScreen) {
            docElm.mozRequestFullScreen()
          } else if (docElm.webkitRequestFullScreen) {
            docElm.webkitRequestFullScreen()
          } else if (docElm.msRequestFullscreen) {
            docElm.msRequestFullscreen()
          }
        }
        // 更新标识
        _t.isFullScreen = !_t.isFullScreen
      },
      handleFormChange (key, val) {
        console.log('handleFormChange', key, val)
        let _t = this
        let el = _t.$refs.signaturePad
        if (el) {
          switch (key) {
            case 'dotSize':
              el.setOption('dotSize', val)
              el.setOption('minWidth', val * 0.3)
              el.setOption('maxWidth', val * 1.7)
              break
            case 'backgroundColor':
              _t.$Modal.confirm({
                title: '提示',
                content: '切换背景色将清空当前画板，确认切换？',
                onOk: function () {
                  // 更新数据
                  _t.formData.backgroundColor = val
                  // 设置背景图
                  el.setOption('backgroundColor', val)
                  // 清除画布
                  el.clear()
                }
              })
              break
            default:
              el.setOption(key, val)
              break
          }
        }
      },
      // 切换状态
      switchStatus (val, key) {
        let _t = this
        if (key !== undefined) {
          _t.status[key] = val !== undefined ? val : !_t.status[key]
        } else {
          let keys = Object.keys(_t.status)
          for (let i = 0, len = keys.length; i < len; i++) {
            let k = keys[i]
            _t.status[k] = val !== undefined ? val : !_t.status[k]
          }
        }
      }
    },
    created () {
      let _t = this
      _t.init()
    }
  }
</script>
