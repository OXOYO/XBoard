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
  .color-swatch {
    .vue-swatches__container {
      bottom: 50px !important;
    }
  }
</style>

<template>
  <div class="board" :style="boardStyle" @click="handleBoardClick">
    <div
      class="body"
      @dblclick="handleBoardBodyDbClick"
      @contextmenu.stop.prevent="handleBoardBodyRightClick($event)"
    >
      <SignaturePad ref="signaturePad" :options="padOptions"></SignaturePad>
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
              <XTooltip :content="item.label">
                <XIcon :type="item.icon"></XIcon>
              </XTooltip>
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
        <ToolItem v-if="tools.color.enable" style="opacity: 1;">
          <template v-slot:label>
            <XTooltip :content="tools.color.label">
              <Swatches
                class="color-swatch"
                v-model="currentColor"
                shapes="circles"
                swatch-size="30"
                popover-to="right"
                show-fallback
                :trigger-style="{width: '30px', height: '30px'}"
              >
              </Swatches>
            </XTooltip>
          </template>
        </ToolItem>
      </ToolBox>
    </div>
  </div>
</template>

<script>
  import Swatches from 'vue-swatches'
  import 'vue-swatches/dist/vue-swatches.min.css'

  import ToolBox from '../components/ToolBox/Index'
  import ToolItem from '../components/ToolBox/ToolItem'
  import SignaturePad from '../components/SignaturePad/Index'
  import ContextMenu from '../components/ContextMenu/Index'
  // 热键
  import Mousetrap from 'mousetrap'

  export default {
    name: 'Board',
    components: {
      Swatches,
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
        currentColor: '#222F3D',
        themes: [
          {
            color: '#DEF0F0',
            enable: true
          },
          {
            color: '#357F5F',
            enable: true
          }
        ],
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
          color: {
            name: 'color',
            label: 'Color',
            icon: 'color',
            shortcuts: '',
            cursor: '',
            enable: true
          }
        },
        // 当前激活工具
        activeTool: null,
        // 画板配置
        padOptions: {
          penColor: '#222F3D'
        },
        // 是否全屏
        isFullScreen: false
      }
    },
    computed: {
      boardStyle () {
        let _t = this
        return {
          // background: _t.currentTheme
          cursor: _t.activeTool && _t.activeTool.cursor ? _t.activeTool.cursor : 'auto'
        }
      }
    },
    watch: {
      currentColor (val) {
        let _t = this
        let el = _t.$refs.signaturePad
        if (el) {
          el.setOption('penColor', val)
        }
      }
    },
    methods: {
      init () {
        let _t = this
        // 初始化激活项
        _t.initActiveTool('pencil')
        // 绑定热键
        _t.bindShortcuts()
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
              _t.activeTool = item
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
        _t.activeTool = item
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
