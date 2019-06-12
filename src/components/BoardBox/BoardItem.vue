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
    z-index: 100;
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
      z-index: 500;
      background: transparent;
      cursor: default;
      transition: all .5s ease-in-out;

      &.show {
        bottom: 5px;
      }
    }
  }
</style>

<template>
  <div class="board" :style="boardStyle" @click="handleBoardClick">
    <div
      class="body"
      ref="boardBody"
      @click="handleBoardBodyClick"
      @dblclick="handleBoardBodyDbClick"
      @contextmenu.stop.prevent="handleBoardBodyRightClick"
    >
      <!-- 画板 -->
      <SignaturePad
        ref="signaturePad"
        :options="padOptions"
        :style="padStyle"
      >
      </SignaturePad>
      <!-- 文本 -->
      <TextPad
        v-for="(item, index) in textList"
        :key="'text_pad_' + index"
        :info="item"
        :disabled="actionType !== 'text'"
        :active="activePad && activePad.name === 'text' && activePad.index === index"
        @close="() => handleTextPadClose(index)"
        @blur="() => handleTextPadBlur(index)"
        @focus="() => handleTextPadFocus(index)"
        @click="() => handleTextPadClick(index)"
      >
      </TextPad>
      <!-- 便签 -->
      <NotePad
        v-for="(item, index) in noteList"
        :key="'note_pad_' + index"
        :info="item"
        :disabled="actionType !== 'note'"
        :active="activePad && activePad.name === 'note' && activePad.index === index"
        @close="() => handleNotePadClose(index)"
        @blur="() => handleNotePadBlur(index)"
        @focus="() => handleNotePadFocus(index)"
        @click="() => handleNotePadClick(index)"
      >
      </NotePad>
    </div>
    <div
      :class="{ footer: true, show: status.footer }"
      ref="boardFooter"
      :style="footerStyle"
      @mousedown="handleBoardFooterMouseDown"
      @contextmenu.stop.prevent
    >
      <ToolBox style="margin: 0 auto;">
        <template v-for="(item, index) in tools.common.filter(item => item.enable)">
          <ToolItem
            :key="'tool_item_' + index"
            :active="activeTool && activeTool.name === item.name"
            :disabled="!item.types.includes(actionType)"
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
        <ToolItem
          v-if="tools.undo.enable"
          :disabled="!tools.undo.types.includes(actionType)"
          @click.native="handleToolClick(tools.undo)"
        >
          <template v-slot:label>
            <Tooltip :content="$t(tools.undo.lang)">
              <XIcon :type="tools.undo.icon"></XIcon>
            </Tooltip>
          </template>
        </ToolItem>
        <!-- 撤回 -->
        <ToolItem
          v-if="tools.redo.enable"
          :disabled="!tools.redo.types.includes(actionType) || (tools.redo.types.includes(actionType) && disabled.redo)"
          @click.native="handleToolClick(tools.redo)"
        >
          <template v-slot:label>
            <Tooltip :content="$t(tools.redo.lang)">
              <XIcon :type="tools.redo.icon"></XIcon>
            </Tooltip>
          </template>
        </ToolItem>
        <Divider type="vertical" />
        <!-- 图片上传 -->
        <ToolItem
          v-if="tools.image.enable"
          :disabled="!tools.image.types.includes(actionType)"
          @click.native="handleToolClick(tools.image)"
        >
          <template v-slot:label>
            <Tooltip :content="$t(tools.image.lang)">
              <XIcon :type="tools.image.icon"></XIcon>
            </Tooltip>
          </template>
        </ToolItem>
        <!-- 清空画板 -->
        <ToolItem
          v-if="tools.clear.enable"
          :disabled="!tools.clear.types.includes(actionType)"
          @click.native="handleToolClick(tools.clear)"
        >
          <template v-slot:label>
            <Tooltip :content="$t(tools.clear.lang)">
              <XIcon :type="tools.clear.icon"></XIcon>
            </Tooltip>
          </template>
        </ToolItem>
        <!-- 保存 -->
        <ToolItem
          v-if="tools.download.enable"
          :disabled="!tools.download.types.includes(actionType)"
          @click.native="handleToolClick(tools.download)"
        >
          <template v-slot:label>
            <Tooltip :content="$t(tools.download.lang)">
              <XIcon :type="tools.download.icon"></XIcon>
            </Tooltip>
          </template>
        </ToolItem>
        <!-- 全屏 -->
        <ToolItem
          v-if="tools.fullScreen.enable"
          :disabled="!tools.fullScreen.types.includes(actionType)"
          @click.native="handleToolClick(tools.fullScreen)"
        >
          <template v-slot:label>
            <Tooltip :content="$t(tools.fullScreen.lang)">
              <XIcon :type="tools.fullScreen.icon"></XIcon>
            </Tooltip>
          </template>
        </ToolItem>
        <!-- 栅格 -->
        <ToolItem
          v-if="tools.grid.enable"
          :disabled="!tools.grid.types.includes(actionType)"
          @click.native="handleToolClick(tools.grid)"
        >
          <template v-slot:label>
            <Tooltip :content="$t(tools.grid.lang)">
              <XIcon :type="tools.grid.icon"></XIcon>
            </Tooltip>
          </template>
        </ToolItem>
        <Divider type="vertical" />
        <!-- 颜色 -->
        <ToolItem
          v-if="tools.penColor.enable"
          :disabled="!tools.penColor.types.includes(actionType)"
          style="opacity: 1;"
        >
          <template v-slot:label>
            <Tooltip :content="$t(tools.penColor.lang)">
              <ColorPicker
                v-model="formData.penColor"
                :disabled="!tools.penColor.types.includes(actionType)"
                recommend
                alpha
                size="small"
                @on-change="(val) => handleToolClick(tools.penColor, val)"
              />
            </Tooltip>
          </template>
        </ToolItem>
        <!-- 背景色 -->
        <ToolItem
          v-if="tools.backgroundColor.enable"
          :disabled="!tools.backgroundColor.types.includes(actionType)"
          style="opacity: 1;"
        >
          <template v-slot:label>
            <Tooltip :content="$t(tools.backgroundColor.lang)">
              <!-- FIXME 使用:value形式进行绑定 -->
              <ColorPicker
                :value="formData.backgroundColor"
                :disabled="!tools.backgroundColor.types.includes(actionType)"
                recommend
                alpha
                size="small"
                @on-change="(val) => handleToolClick(tools.backgroundColor, val)"
              />
            </Tooltip>
          </template>
        </ToolItem>
        <!-- 画笔大小 -->
        <ToolItem
          v-if="tools.dotSize.enable"
          :disabled="!tools.dotSize.types.includes(actionType)"
          style="opacity: 1;"
        >
          <template v-slot:label>
            <Tooltip :content="$t(tools.dotSize.lang)">
              <InputNumber
                v-model="formData.dotSize"
                :disabled="!tools.dotSize.types.includes(actionType)"
                :max="10"
                :min="1"
                size="small"
                @on-change="(val) => handleToolClick(tools.dotSize, val)"
              >
              </InputNumber>
            </Tooltip>
          </template>
        </ToolItem>
        <Divider type="vertical" />
        <!-- 多语言 -->
        <ToolItem
          v-if="tools.language.enable"
          :disabled="!tools.language.types.includes(actionType)"
          style="opacity: 1;"
        >
          <template v-slot:label>
            <Dropdown trigger="click" @on-click="handleLocaleChange">
              <a href="javascript: void(0);" style="color: #808695;">
                <img :src="$X.langs.icon[locale]" :alt="$X.langs.label[locale]" style="width: auto; height: 15px; margin-right: 5px; vertical-align: middle;">
                <Icon type="ios-arrow-down"></Icon>
              </a>
              <DropdownMenu slot="list">
                <DropdownItem
                  v-for="(lang, index) in Object.keys($X.langs.data)"
                  :key="'dropdown_item_' + index"
                  :name="lang"
                >
                  <img :src="$X.langs.icon[lang]" :alt="$X.langs.label[lang]" style="width: auto; height: 20px; vertical-align: middle;">
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </template>
        </ToolItem>
        <Divider type="vertical" />
        <!-- Github -->
        <ToolItem
          v-if="tools.github.enable"
          :disabled="!tools.github.types.includes(actionType)"
          style="opacity: 1;"
        >
          <template v-slot:label>
            <Tooltip :content="$t(tools.github.lang)">
              <a :href="$X.config.system.github" target="_blank" style="color: #333333;">
                <XIcon :type="tools.github.icon"></XIcon>
              </a>
            </Tooltip>
          </template>
        </ToolItem>
        <!-- Feedback -->
        <ToolItem
          v-if="tools.feedback.enable"
          :disabled="!tools.feedback.types.includes(actionType)"
          style="opacity: 1;"
        >
          <template v-slot:label>
            <Tooltip :content="$t(tools.feedback.lang)">
              <a :href="$X.config.system.feedback" target="_blank" style="color: #333333;">
                <XIcon :type="tools.feedback.icon"></XIcon>
              </a>
            </Tooltip>
          </template>
        </ToolItem>
      </ToolBox>
    </div>
    <!-- 右键菜单 -->
    <ContextMenu>
      <Menu :active-name="activeMenu" @on-select="handleContextMenuChange">
        <MenuItem
          v-for="(item, index) in contextMenuList.filter(item => item.types.includes(actionType))"
          :key="'menu_item_' + index"
          :name="item.fullName"
        >
          <XIcon :type="item.icon"></XIcon>
          {{ $t(item.lang) }}
        </MenuItem>
      </Menu>
    </ContextMenu>
    <!-- 栅格 -->
    <GridBox ref="gridBox" :active="active" @close="handleGridBoxClose"></GridBox>
  </div>
</template>

<script>
  import ToolBox from '../ToolBox/Index'
  import ToolItem from '../ToolBox/ToolItem'
  import SignaturePad from '../SignaturePad/Index'
  import ContextMenu from '../ContextMenu/Index'
  import TextPad from '../TextPad/Index'
  import NotePad from '../NotePad/Index'
  import GridBox from '../GridBox/Index'
  // 热键
  import Mousetrap from 'mousetrap'
  import html2canvas from 'html2canvas'

  export default {
    name: 'Board',
    components: {
      ToolBox,
      ToolItem,
      SignaturePad,
      ContextMenu,
      TextPad,
      NotePad,
      GridBox
    },
    props: {
      info: Object,
      active: {
        type: Boolean,
        default: false
      }
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
              contextmenu: false,
              type: '',
              types: ['draw']
            },
            {
              name: 'marquee',
              label: 'Marquee (M)',
              lang: 'L10002',
              icon: 'marquee',
              shortcuts: 'm',
              cursor: '',
              enable: false,
              contextmenu: false,
              type: '',
              types: ['draw']
            },
            {
              name: 'preview',
              label: 'Preview (Ctrl + P)',
              lang: 'L10018',
              icon: 'cursor',
              shortcuts: 'ctrl+p',
              cursor: '',
              enable: true,
              contextmenu: true,
              type: 'preview',
              types: ['draw', 'text', 'note', 'preview']
            },
            {
              name: 'pencil',
              label: 'Pencil (P)',
              lang: 'L10003',
              icon: 'pencil',
              shortcuts: 'p',
              cursor: '',
              enable: true,
              contextmenu: true,
              type: 'draw',
              types: ['draw', 'text', 'note', 'preview']
            },
            {
              name: 'line',
              label: 'Line (L)',
              lang: 'L10004',
              icon: 'line',
              shortcuts: 'l',
              cursor: '',
              enable: false,
              contextmenu: false,
              type: 'line',
              types: ['draw']
            },
            {
              name: 'text',
              label: 'Text (T)',
              lang: 'L10005',
              icon: 'text',
              shortcuts: 't',
              cursor: 'text',
              enable: true,
              contextmenu: true,
              type: 'text',
              types: ['draw', 'text', 'note', 'preview']
            },
            {
              name: 'note',
              label: 'Note (N)',
              lang: 'L10020',
              icon: 'note',
              shortcuts: 'n',
              cursor: 'text',
              enable: true,
              contextmenu: true,
              type: 'note',
              types: ['draw', 'text', 'note', 'preview']
            },
            {
              name: 'eraser',
              label: 'Eraser (E)',
              lang: 'L10006',
              icon: 'eraser',
              shortcuts: 'e',
              cursor: '',
              enable: true,
              contextmenu: true,
              type: '',
              types: ['draw']
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
            contextmenu: true,
            type: '',
            types: ['draw']
          },
          redo: {
            name: 'redo',
            label: 'Redo (Ctrl + Shift + Z)',
            lang: 'L10008',
            icon: 'redo',
            shortcuts: 'ctrl+shift+z',
            cursor: '',
            enable: true,
            contextmenu: true,
            type: '',
            types: ['draw']
          },
          image: {
            name: 'image',
            label: 'Upload Image (U)',
            lang: 'L10009',
            icon: 'image',
            shortcuts: 'u',
            cursor: '',
            enable: false,
            contextmenu: false,
            type: '',
            types: ['draw', 'text', 'note']
          },
          clear: {
            name: 'clear',
            label: 'Clear (C)',
            lang: 'L10010',
            icon: 'clear',
            shortcuts: 'c',
            cursor: '',
            enable: true,
            contextmenu: true,
            type: '',
            types: ['draw', 'text', 'note']
          },
          download: {
            name: 'download',
            label: 'Download (Ctrl + S)',
            lang: 'L10011',
            icon: 'download',
            shortcuts: 'ctrl+s',
            cursor: '',
            enable: true,
            contextmenu: true,
            type: '',
            types: ['draw', 'text', 'note', 'preview']
          },
          fullScreen: {
            name: 'fullScreen',
            label: 'Full Screen',
            lang: 'L10012',
            icon: 'full-screen',
            shortcuts: '',
            cursor: '',
            enable: true,
            contextmenu: false,
            type: '',
            types: ['draw', 'text', 'note', 'preview']
          },
          grid: {
            name: 'grid',
            label: 'grid',
            lang: 'L10021',
            icon: 'grid',
            shortcuts: 'g',
            cursor: '',
            enable: true,
            contextmenu: false,
            type: '',
            types: ['draw', 'text', 'note', 'preview']
          },
          penColor: {
            name: 'penColor',
            label: 'Pencil color',
            lang: 'L10013',
            icon: '',
            shortcuts: '',
            cursor: '',
            enable: true,
            contextmenu: false,
            type: '',
            types: ['draw']
          },
          backgroundColor: {
            name: 'backgroundColor',
            label: 'Canvas color',
            lang: 'L10014',
            icon: '',
            shortcuts: '',
            cursor: '',
            enable: true,
            contextmenu: false,
            type: '',
            types: ['draw']
          },
          dotSize: {
            name: 'dotSize',
            label: 'Pencil size',
            lang: 'L10015',
            icon: '',
            shortcuts: '',
            cursor: '',
            enable: true,
            contextmenu: false,
            type: '',
            types: ['draw']
          },
          language: {
            name: 'language',
            label: 'Language',
            lang: 'L10016',
            icon: '',
            shortcuts: '',
            cursor: '',
            enable: true,
            contextmenu: false,
            type: '',
            types: ['draw', 'text', 'note', 'preview']
          },
          github: {
            name: 'github',
            label: 'Github',
            lang: 'L10017',
            icon: 'github',
            shortcuts: '',
            cursor: '',
            enable: true,
            contextmenu: false,
            type: '',
            types: ['draw', 'text', 'note', 'preview']
          },
          feedback: {
            name: 'feedback',
            label: 'Feedback',
            lang: 'L10019',
            icon: 'feedback',
            shortcuts: '',
            cursor: '',
            enable: true,
            contextmenu: false,
            type: '',
            types: ['draw', 'text', 'note', 'preview']
          }
        },
        // 当前激活工具
        activeTool: null,
        // 当前操作类型 draw: 绘画 note 便签 preview 预览
        actionType: null,
        // 操作状态
        actionStatus: null,
        // 画板配置
        padOptions: {},
        // 右键菜单列表
        contextMenuList: [],
        // 当前激活的菜单
        activeMenu: null,
        // 是否全屏
        isFullScreen: false,
        // 禁用
        disabled: {
          redo: false
        },
        // 文本列表
        textList: [],
        // 便签列表
        noteList: [],
        footerStyle: {},
        // 当前激活的面板
        activePad: {}
      }
    },
    computed: {
      boardBody () {
        return this.$refs.boardBody
      },
      boardFooter () {
        return this.$refs.boardFooter
      },
      signaturePad () {
        return this.$refs.signaturePad
      },
      boardStyle () {
        let _t = this
        let style = {}
        if (_t.active) {
          style = {
            zIndex: 200
          }
        } else {
          style = {
            zIndex: 100
          }
        }
        return style
      },
      padStyle () {
        let _t = this
        let style = {
          cursor: 'auto'
        }
        if (_t.activeTool) {
          if (['pencil', 'eraser'].includes(_t.activeTool.name)) {
            let png = require('@/assets/images/64/' + _t.activeTool.name + '.png')
            style = {
              cursor: `url(${png}) 32 32, auto`
            }
          } else if (_t.activeTool.cursor) {
            style = {
              cursor: _t.activeTool.cursor
            }
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
        // 绑定unload
        _t.bindUnload()
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
        let item = _t.tools.common.find(target => target.name === name && target.enable)
        if (item) {
          _t.activeTool = item
          _t.actionType = item.type
          _t.activeMenu = `common_${name}`
        }
      },
      initContextMenuList () {
        let _t = this
        let handler = function (list, key, item) {
          if (item.enable && item.contextmenu) {
            list.push({
              ...item,
              fullName: `${key}_${item.name}`
            })
          }
          return list
        }
        let list = []
        let keys = Object.keys(_t.tools)
        for (let i = 0, iLen = keys.length; i < iLen; i++) {
          let key = keys[i]
          if (Array.isArray(_t.tools[key])) {
            for (let j = 0, jLen = _t.tools[key].length; j < jLen; j++) {
              list = handler(list, key, _t.tools[key][j])
            }
          } else {
            list = handler(list, key, _t.tools[key])
          }
        }
        _t.contextMenuList = list
      },
      bindShortcuts () {
        let _t = this
        let handler = function (item) {
          if (item.enable && item.shortcuts) {
            Mousetrap.bind(item.shortcuts, function () {
              _t.handleToolClick(item)
              return false
            })
          }
        }
        let keys = Object.keys(_t.tools)
        for (let i = 0, iLen = keys.length; i < iLen; i++) {
          let key = keys[i]
          if (Array.isArray(_t.tools[key])) {
            for (let j = 0, jLen = _t.tools[key].length; j < jLen; j++) {
              handler(_t.tools[key][j])
            }
          } else {
            handler(_t.tools[key])
          }
        }
        // 绑定esc
        Mousetrap.bind('escape', function () {
          if (_t.isFullScreen) {
            _t.isFullScreen = false
          }
        })
      },
      bindUnload () {
        window.onbeforeunload = function (event) {
          event.returnValue = false
          return false
        }
      },
      handleFooterStyle () {
        let _t = this
        let style = {}
        let el = _t.boardFooter
        if (el) {
          style = {
            left: '50%',
            marginLeft: el.clientWidth / -2 + 'px'
          }
        }
        _t.footerStyle = style
      },
      handleBoardClick () {
        this.doHideContextMenu()
      },
      handleContextMenuChange (fullName) {
        let _t = this
        _t.doHideContextMenu()
        let [type, name] = fullName.split('_')
        if (type === 'common') {
          let target = _t.tools.common.find(item => item.name === name)
          if (target) {
            _t.handleToolClick(target)
          }
        } else if (['undo', 'redo', 'image', 'clear', 'download'].includes(name)) {
          _t.handleToolClick(_t.tools[name])
        } else {
          _t.activeTool = null
          _t.activeMenu = null
        }
      },
      handleBoardFooterMouseDown () {
        this.doHideContextMenu()
      },
      handleBoardBodyClick (event) {
        let _t = this
        switch (_t.actionType) {
          case 'text':
            // 新增文本
            _t.doAddText({
              x: event.clientX,
              y: event.clientY
            })
            break
          case 'note':
            // 新增便签
            _t.doAddNote({
              x: event.clientX,
              y: event.clientY
            })
            break
        }
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
        let contextMenu = _t.$refs.contextMenu
        if (contextMenu && contextMenu.doShow) {
          contextMenu.doShow(options)
        }
      },
      handleToolClick (item, val) {
        let _t = this
        let el = _t.signaturePad
        if (!item.types.includes(_t.actionType)) {
          console.log('XBoard tool disabled!')
          return false
        }
        if (_t.tools.common.find(target => target.name === item.name)) {
          _t.activeTool = item
          _t.activeMenu = `common_${item.name}`
        } else {
          _t.activeTool = null
          _t.activeMenu = null
        }
        switch (item.name) {
          case 'preview':
            _t.actionType = 'preview'
            el.off()
            break
          case 'pencil':
            _t.actionType = 'draw'
            el.on()
            el.setOption('dotSize', _t.formData.dotSize)
            el.setOption('minWidth', _t.formData.dotSize * 0.3)
            el.setOption('maxWidth', _t.formData.dotSize * 1.7)
            el.setOption('penColor', _t.formData.penColor)
            el.draw()
            break
          case 'text':
            _t.actionType = 'text'
            _t.actionStatus = 'text-add'
            el.off()
            break
          case 'note':
            _t.actionType = 'note'
            _t.actionStatus = 'note-add'
            el.off()
            break
          case 'eraser':
            _t.actionType = 'draw'
            el.on()
            el.setOption('dotSize', 18)
            el.setOption('minWidth', 18)
            el.setOption('maxWidth', 18)
            // FIXME 【BUG】设置画笔为背景色，但是并有没有什么用
            el.setOption('penColor', _t.formData.backgroundColor)
            el.eraser()
            break
          case 'undo':
            el.undo()
            break
          case 'redo':
            el.redo()
            break
          case 'image':
            console.log('XBoard Tool image trigger!')
            break
          case 'clear':
            _t.$Modal.confirm({
              title: _t.$t('L10101'),
              content: _t.$t('L10102'),
              onOk: function () {
                // 清除画布
                el.clear()
                // 清除文本
                _t.textList = []
                // 清除便签
                _t.noteList = []
              }
            })
            break
          case 'download':
            html2canvas(_t.boardBody, {
              backgroundColor: null,
              imageTimeout: 0
            }).then(function (canvas) {
              let data = canvas.toDataURL('image/png')
              let fileName = _t.$X.config.system.name + '_' + _t.$X.utils.filters.formatDate(new Date(), 'YYYYMMDDhhmmss')
              _t.$X.utils.file.downloadFile(fileName, data)
            }).catch(function (error) {
              console.warn('html2canvas render error!', error)
            })
            // let res = el.save()
            // if (res.isEmpty) {
            //   _t.$Message.info(_t.$t('L10104'))
            // } else {
            //   let fileName = _t.$X.config.system.name + '_' + _t.$X.utils.filters.formatDate(new Date(), 'YYYYMMDDhhmmss')
            //   _t.$X.utils.file.downloadFile(fileName, res.data)
            // }
            break
          case 'fullScreen':
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
            break
          case 'penColor':
            el.setOption('penColor', val)
            break
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
                // 清除文本
                _t.textList = []
                // 清除便签
                _t.noteList = []
              }
            })
            break
          case 'grid':
            // 切换状态
            _t.switchStatus(false)
            // 截图
            html2canvas(_t.boardBody, {
              backgroundColor: null,
              imageTimeout: 0
            }).then(function (canvas) {
              let data = canvas.toDataURL('image/png')
              let gridBox = _t.$refs.gridBox
              if (gridBox && gridBox.doShow) {
                gridBox.doShow(data)
              }
            }).catch(function (error) {
              console.warn('html2canvas render error!', error)
            })
            break
        }
        // 非便签输入模式时清除鼠标移动事件
        if (!['text', 'note'].includes(_t.actionType)) {
          document.onmouseup = null
          document.onmousemove = null
        }
        return false
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
        // 处理样式
        _t.handleFooterStyle()
      },
      doAddText (info) {
        let _t = this
        if (_t.actionStatus === 'text-add') {
          _t.textList.push({
            ...info
          })
          _t.handleTextPadClick(_t.textList.length - 1)
        }
      },
      doRemoveText (index) {
        let _t = this
        _t.textList.splice(index, 1)
        _t.actionStatus = 'text-add'
      },
      handleTextPadClose (index) {
        let _t = this
        _t.$Modal.confirm({
          title: _t.$t('L10101'),
          content: _t.$t('L10106'),
          onOk: function () {
            // 删除文本
            _t.doRemoveText(index)
          }
        })
      },
      handleTextPadBlur (index) {
        let _t = this
        _t.actionStatus = 'text-add'
      },
      handleTextPadFocus (index) {
        let _t = this
        _t.actionStatus = 'text-editing'
      },
      handleTextPadClick (index) {
        let _t = this
        _t.activePad = {
          name: 'text',
          index: index
        }
      },
      doAddNote (info) {
        let _t = this
        if (_t.actionStatus === 'note-add') {
          _t.noteList.push({
            ...info
          })
          _t.handleNotePadClick(_t.noteList.length - 1)
        }
      },
      doRemoveNote (index) {
        let _t = this
        _t.noteList.splice(index, 1)
        _t.actionStatus = 'note-add'
      },
      handleNotePadClose (index) {
        let _t = this
        _t.$Modal.confirm({
          title: _t.$t('L10101'),
          content: _t.$t('L10105'),
          onOk: function () {
            // 删除便签
            _t.doRemoveNote(index)
          }
        })
      },
      handleNotePadBlur (index) {
        let _t = this
        _t.actionStatus = 'note-add'
      },
      handleNotePadFocus (index) {
        let _t = this
        _t.actionStatus = 'note-editing'
      },
      handleNotePadClick (index) {
        let _t = this
        _t.activePad = {
          name: 'note',
          index: index
        }
      },
      handleGridBoxClose () {
        let _t = this
        // 切换状态
        _t.switchStatus(true)
      },
      doHideContextMenu () {
        let _t = this
        let contextMenu = _t.$refs.contextMenu
        if (contextMenu && contextMenu.doHide) {
          contextMenu.doHide()
        }
      }
    },
    created () {
      let _t = this
      _t.init()
    },
    mounted () {
      let _t = this
      _t.$nextTick(function () {
        // 处理样式
        _t.handleFooterStyle()
      })
    }
  }
</script>
