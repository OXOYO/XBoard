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
      z-index: 500;
      background: transparent;
      cursor: default;
    }
    .body {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: 100;
    }
    .footer {
      position: absolute;
      bottom: -50px;
      display: inline-block;
      text-align: center;
      z-index: 2000;
      background: transparent;
      width: 100%;
      cursor: default;
      transition: all .5s ease-in-out;

      &.show {
        bottom: 5px;
      }
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
      <ContextMenu>
        <Menu @on-select="handleContextMenuChange">
          <MenuItem
            v-for="(item, index) in contextMenuList"
            :key="index"
            :name="item.fullName"
          >
            <XIcon :type="item.icon"></XIcon>
            {{ $t(item.lang) }}
          </MenuItem>
        </Menu>
      </ContextMenu>
    </div>
    <div :class="{ footer: true, show: status.footer }" @mousedown="handleBoardFooterMouseDown" @contextmenu.stop.prevent>
      <ToolBox style="margin: 0 auto;">
        <template v-for="(item, index) in tools.common.filter(item => item.enable)">
          <ToolItem
            :key="index"
            :active="activeTool.name === item.name"
            @click.native="handleToolClick(item)"
          >
            <template v-slot:label>
              <Tooltip :content="$t(item.lang)">
                <XIcon :type="item.icon"></XIcon>
              </Tooltip>
            </template>
          </ToolItem>
        </template>
        <Divider type="vertical" />
        <!-- 撤销 -->
        <ToolItem v-if="tools.undo.enable" @click.native="handleUndoClick">
          <template v-slot:label>
            <Tooltip :content="$t(tools.undo.lang)">
              <XIcon :type="tools.undo.icon"></XIcon>
            </Tooltip>
          </template>
        </ToolItem>
        <!-- 撤回 -->
        <ToolItem v-if="tools.redo.enable" :disabled="disabled.redo" @click.native="handleRedoClick">
          <template v-slot:label>
            <Tooltip :content="$t(tools.redo.lang)">
              <XIcon :type="tools.redo.icon"></XIcon>
            </Tooltip>
          </template>
        </ToolItem>
        <Divider type="vertical" />
        <!-- 图片上传 -->
        <ToolItem v-if="tools.image.enable" @click.native="handleImageClick">
          <template v-slot:label>
            <Tooltip :content="$t(tools.image.lang)">
              <XIcon :type="tools.image.icon"></XIcon>
            </Tooltip>
          </template>
        </ToolItem>
        <!-- 清空画板 -->
        <ToolItem v-if="tools.clear.enable" @click.native="handleClearClick">
          <template v-slot:label>
            <Tooltip :content="$t(tools.clear.lang)">
              <XIcon :type="tools.clear.icon"></XIcon>
            </Tooltip>
          </template>
        </ToolItem>
        <!-- 保存 -->
        <ToolItem v-if="tools.download.enable" @click.native="handleDownloadClick">
          <template v-slot:label>
            <Tooltip :content="$t(tools.download.lang)">
              <XIcon :type="tools.download.icon"></XIcon>
            </Tooltip>
          </template>
        </ToolItem>
        <!-- 全屏 -->
        <ToolItem v-if="tools.fullScreen.enable" @click.native="handleFullScreenClick">
          <template v-slot:label>
            <Tooltip :content="$t(tools.fullScreen.lang)">
              <XIcon :type="tools.fullScreen.icon"></XIcon>
            </Tooltip>
          </template>
        </ToolItem>
        <Divider type="vertical" />
        <!-- 颜色 -->
        <ToolItem v-if="tools.penColor.enable" style="opacity: 1;">
          <template v-slot:label>
            <Tooltip :content="$t(tools.penColor.lang)">
              <ColorPicker v-model="formData.penColor" recommend alpha size="small" @on-change="(val) => handleFormChange('penColor', val)"/>
            </Tooltip>
          </template>
        </ToolItem>
        <!-- 背景色 -->
        <ToolItem v-if="tools.backgroundColor.enable" style="opacity: 1;">
          <template v-slot:label>
            <Tooltip :content="$t(tools.backgroundColor.lang)">
              <!-- FIXME 使用:value形式进行绑定 -->
              <ColorPicker :value="formData.backgroundColor" recommend alpha size="small" @on-change="(val) => handleFormChange('backgroundColor', val)"/>
            </Tooltip>
          </template>
        </ToolItem>
        <!-- 画笔大小 -->
        <ToolItem v-if="tools.dotSize.enable" style="opacity: 1;">
          <template v-slot:label>
            <Tooltip :content="$t(tools.dotSize.lang)">
              <InputNumber v-model="formData.dotSize" :max="10" :min="1" size="small" @on-change="(val) => handleFormChange('dotSize', val)"></InputNumber>
            </Tooltip>
          </template>
        </ToolItem>
        <Divider type="vertical" />
        <!-- 多语言 -->
        <ToolItem v-if="tools.language.enable" style="opacity: 1;">
          <template v-slot:label>
            <Tooltip :content="$t(tools.language.lang)">
              <Dropdown trigger="click" @on-click="handleLocaleChange">
                <a href="javascript: void(0);" style="color: #808695;">
                  <img :src="$X.langs.icon[locale]" :alt="$X.langs.label[locale]" style="width: auto; height: 20px; margin-right: 5px; vertical-align: middle;">
                  <Icon type="ios-arrow-down"></Icon>
                </a>
                <DropdownMenu slot="list">
                  <DropdownItem
                    v-for="(lang, index) in Object.keys($X.langs.data)"
                    :key="index"
                    :name="lang"
                  >
                    <img :src="$X.langs.icon[lang]" :alt="$X.langs.label[lang]" style="width: auto; height: 20px; vertical-align: middle;">
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </Tooltip>
          </template>
        </ToolItem>
        <Divider type="vertical" />
        <!-- Github -->
        <ToolItem v-if="tools.github.enable" style="opacity: 1;">
          <template v-slot:label>
            <Tooltip :content="$t(tools.github.lang)">
              <a :href="$X.config.system.github" target="_blank" style="color: #333333;">
                <XIcon :type="tools.github.icon"></XIcon>
              </a>
            </Tooltip>
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
        locale: this.$X.locale,
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
              lang: 'L10001',
              icon: 'move',
              shortcuts: 'v',
              cursor: 'move',
              enable: false,
              contextmenu: false
            },
            {
              name: 'marquee',
              label: 'Marquee (M)',
              lang: 'L10002',
              icon: 'marquee',
              shortcuts: 'm',
              cursor: '',
              enable: false,
              contextmenu: false
            },
            {
              name: 'pencil',
              label: 'Pencil (P)',
              lang: 'L10003',
              icon: 'pencil',
              shortcuts: 'b',
              cursor: '',
              enable: true,
              contextmenu: true
            },
            {
              name: 'line',
              label: 'Line (L)',
              lang: 'L10004',
              icon: 'line',
              shortcuts: 'l',
              cursor: '',
              enable: false,
              contextmenu: false
            },
            {
              name: 'text',
              label: 'Text (T)',
              lang: 'L10005',
              icon: 'text',
              shortcuts: 't',
              cursor: 'text',
              enable: false,
              contextmenu: false
            },
            {
              name: 'eraser',
              label: 'Eraser (E)',
              lang: 'L10006',
              icon: 'eraser',
              shortcuts: 'e',
              cursor: '',
              enable: true,
              contextmenu: true
            }
          ],
          undo: {
            name: 'undo',
            label: 'Undo (Ctrl + Z)',
            lang: 'L10007',
            icon: 'undo',
            shortcuts: 'ctrl+z',
            cursor: '',
            enable: true,
            contextmenu: true
          },
          redo: {
            name: 'redo',
            label: 'Redo (Ctrl + Shift + Z)',
            lang: 'L10008',
            icon: 'redo',
            shortcuts: 'ctrl+shift+z',
            cursor: '',
            enable: true,
            contextmenu: true
          },
          image: {
            name: 'image',
            label: 'Upload Image (U)',
            lang: 'L10009',
            icon: 'image',
            shortcuts: 'u',
            cursor: '',
            enable: false,
            contextmenu: false
          },
          clear: {
            name: 'clear',
            label: 'Clear (C)',
            lang: 'L10010',
            icon: 'clear',
            shortcuts: 'c',
            cursor: '',
            enable: true,
            contextmenu: true
          },
          download: {
            name: 'download',
            label: 'Download (Ctrl + S)',
            lang: 'L10011',
            icon: 'download',
            shortcuts: 'ctrl+s',
            cursor: '',
            enable: true,
            contextmenu: true
          },
          fullScreen: {
            name: 'fullScreen',
            label: 'Full Screen',
            lang: 'L10012',
            icon: 'full-screen',
            shortcuts: '',
            cursor: '',
            enable: true,
            contextmenu: false
          },
          penColor: {
            name: 'penColor',
            label: 'Pencil color',
            lang: 'L10013',
            icon: '',
            shortcuts: '',
            cursor: '',
            enable: true,
            contextmenu: false
          },
          backgroundColor: {
            name: 'backgroundColor',
            label: 'Canvas color',
            lang: 'L10014',
            icon: '',
            shortcuts: '',
            cursor: '',
            enable: true,
            contextmenu: false
          },
          dotSize: {
            name: 'dotSize',
            label: 'Pencil size',
            lang: 'L10015',
            icon: '',
            shortcuts: '',
            cursor: '',
            enable: true,
            contextmenu: false
          },
          language: {
            name: 'language',
            label: 'Language',
            lang: 'L10016',
            icon: '',
            shortcuts: '',
            cursor: '',
            enable: true,
            contextmenu: false
          },
          github: {
            name: 'github',
            label: 'Github',
            lang: 'L10017',
            icon: 'github',
            shortcuts: '',
            cursor: '',
            enable: true,
            contextmenu: false
          }
        },
        // 当前激活工具
        activeTool: null,
        // 画板配置
        padOptions: {},
        // 右键菜单列表
        contextMenuList: [],
        // 是否全屏
        isFullScreen: false,
        // 禁用
        disabled: {
          redo: false
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
          let png = require('../assets/images/64/' + _t.activeTool.name + '.png')
          style = {
            cursor: `url(${png}) 32 32, auto`
          }
        } else if (_t.activeTool.cursor) {
          style = {
            cursor: _t.activeTool.cursor
          }
        }
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
        // 初始化右键菜单
        _t.initContextMenuList()
        // 绑定热键
        _t.bindShortcuts()
      },
      initPadOptions () {
        let _t = this
        _t.padOptions = {
          dotSize: _t.formData.dotSize,
          minWidth: _t.formData.dotSize * 0.3,
          maxWidth: _t.formData.dotSize * 1.7,
          throttle: 1,
          minDistance: 1,
          backgroundColor: _t.formData.backgroundColor,
          penColor: _t.formData.penColor
        }
      },
      initActiveTool (name) {
        let _t = this
        _t.activeTool = _t.tools.common.find(target => target.name === name && target.enable)
      },
      initContextMenuList () {
        let _t = this
        let list = []
        let keys = Object.keys(_t.tools)
        for (let i = 0, iLen = keys.length; i < iLen; i++) {
          let key = keys[i]
          if (Array.isArray(_t.tools[key])) {
            for (let j = 0, jLen = _t.tools[key].length; j < jLen; j++) {
              let item = _t.tools[key][j]
              if (item.contextmenu) {
                list.push({
                  ...item,
                  fullName: `${key}_${item.name}`
                })
              }
            }
          } else {
            let item = _t.tools[key]
            if (item.contextmenu) {
              list.push({
                ...item,
                fullName: `${key}_${item.name}`
              })
            }
          }
        }
        _t.contextMenuList = list
      },
      bindShortcuts () {
        let _t = this
        for (let i = 0, len = _t.tools.common.length; i < len; i++) {
          let item = _t.tools.common[i]
          if (item.enable) {
            Mousetrap.bind(item.shortcuts, function () {
              _t.handleToolClick(item)
              return false
            })
          }
        }
        // 绑定undo
        if (_t.tools.undo.enable) {
          Mousetrap.bind(_t.tools.undo.shortcuts, _t.handleUndoClick)
        }
        // 绑定redo
        if (_t.tools.redo.enable) {
          Mousetrap.bind(_t.tools.redo.shortcuts, _t.handleRedoClick)
        }
        // 绑定image
        if (_t.tools.image.enable) {
          Mousetrap.bind(_t.tools.image.shortcuts, _t.handleImageClick)
        }
        // 绑定clear
        if (_t.tools.clear.enable) {
          Mousetrap.bind(_t.tools.clear.shortcuts, _t.handleClearClick)
        }
        // 绑定download
        if (_t.tools.download.enable) {
          Mousetrap.bind(_t.tools.download.shortcuts, _t.handleDownloadClick)
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
      handleContextMenuChange (fullName) {
        let _t = this
        // 广播事件
        _t.$X.utils.bus.$emit('platform/contextMenu/hide')
        let [type, name] = fullName.split('_')
        if (type === 'common') {
          let target = _t.tools.common.find(item => item.name === name)
          if (target) {
            _t.handleToolClick(target)
          }
        } else {
          switch (name) {
            case 'undo':
              _t.handleUndoClick()
              break
            case 'redo':
              _t.handleRedoClick()
              break
            case 'image':
              _t.handleImageClick()
              break
            case 'clear':
              _t.handleClearClick()
              break
          }
        }
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
            el.setOption('dotSize', _t.formData.dotSize)
            el.setOption('minWidth', _t.formData.dotSize * 0.3)
            el.setOption('maxWidth', _t.formData.dotSize * 1.7)
            el.setOption('penColor', _t.formData.penColor)
            el.draw()
            break
          case 'eraser':
            el.setOption('dotSize', 25)
            el.setOption('minWidth', 25)
            el.setOption('maxWidth', 25)
            // FIXME 【BUG】设置画笔为背景色，但是并有没有什么用
            el.setOption('penColor', _t.formData.backgroundColor)
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
        return false
      },
      handleRedoClick () {
        let _t = this
        let el = _t.$refs.signaturePad
        if (el && el.redo) {
          el.redo()
        }
        return false
      },
      handleImageClick () {
        return false
      },
      handleClearClick () {
        let _t = this
        let el = _t.$refs.signaturePad
        if (el && el.clear) {
          _t.$Modal.confirm({
            title: _t.$t('L10101'),
            content: _t.$t('L10102'),
            onOk: function () {
              // 清除画布
              el.clear()
            }
          })
        }
        return false
      },
      handleDownloadClick () {
        let _t = this
        let el = _t.$refs.signaturePad
        if (el) {
          let res = el.save()
          if (res.isEmpty) {
            _t.$Message.info(_t.$t('L10104'))
          } else {
            let fileName = _t.$X.config.system.name + '_' + _t.$X.utils.filters.formatDate(new Date(), 'YYYYMMDDhhmmss')
            _t.$X.utils.file.downloadFile(fileName, res.data)
          }
        }
        return false
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
                title: _t.$t('L10101'),
                content: _t.$t('L10103'),
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
      handleLocaleChange (name) {
        let _t = this
        // 更新cookie
        let key = _t.$X.config.cookie.getItem('locale')
        _t.$X.Cookies.set(key, name, {
          expires: 7,
          path: _t.$X.config.cookie.path
        })
        _t.$i18n.locale = _t.$X.langs.locale = _t.locale = name
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
