/**
* Created by OXOYO on 2019/6/5.
*
* TextPad
*/

<style lang="less" rel="stylesheet/less">
  .text-pad {
    position: absolute;
    min-width: 100px;
    width: 200px;
    background: #fff;
    box-sizing: border-box;

    .text-pad-header {
      position: absolute;
      top: -40px;
      width: 100%;
      height: 40px;
      line-height: 40px;
      cursor: default;

      &:hover {}

      .text-pad-title {
        padding: 0 15px;
        text-align: left;
        height: 100%;
        cursor: default;
        background: rgba(255, 255, 255, .3);

        &.disabled {
          cursor: not-allowed !important;
        }
      }
      .tools {
        position: absolute;
        top: 0;
        right: 5px;

        .tool-item {
          display: inline-block;
          position: relative;
          min-width: 25px;
          height: 30px;
          line-height: 30px;
          vertical-align: middle;
          text-align: center;
          opacity: .6;
          margin: 0 2px;
          font-size: 18px;
          color: #000000;

          &.disabled {
            cursor: not-allowed;
          }

          &:hover {
            opacity: 1;
          }
        }
      }
      .color-picker {
        position: absolute;
        display: flex;
        width: 100%;
        top: 0;
        left: 0;
        right: 0;

        .color-item {
          flex: 1 1 auto;
          height: 40px;
          line-height: 40px;
          text-align: center;
          font-size: 20px;
        }
      }
    }
    .text-pad-body {
      padding: 1px;
      overflow: auto;
      height: 100%;
    }
  }

  .x-drag-start,
  .x-drag-move {
    transition: none;
    opacity: .7;

    .text-pad-header {
      .text-pad-title {
        cursor: move !important;
      }
    }
    .text-pad-body {

    }
  }

  .text-pad-resize {
    width: 20px;
    height: 20px;
    position: absolute;
    background: transparent;
    z-index: 10;

    &.disabled {
      cursor: not-allowed !important;
    }

    &.resize-top-left {
      cursor: nw-resize;
      top: 0;
      left: 0;
      z-index: 20;
    }
    &.resize-top-right {
      cursor: ne-resize;
      top: 0;
      right: 0;
      z-index: 20;
    }
    &.resize-bottom-left {
      cursor: sw-resize;
      bottom: 0;
      left: 0;
      z-index: 20;
    }
    &.resize-bottom-right {
      cursor: se-resize;
      bottom: 0;
      right: 0;
      z-index: 20;
    }
    &.resize-top-border {
      cursor: ns-resize;
      top: 0;
      width: 100%;
      height: 10px;
    }
    &.resize-right-border {
      cursor: ew-resize;
      right: 0;
      width: 10px;
      height: 100%;
    }
    &.resize-bottom-border {
      cursor: ns-resize;
      bottom: 0;
      width: 100%;
      height: 10px;
    }
    &.resize-left-border {
      cursor: ew-resize;
      left: 0;
      width: 10px;
      height: 100%;
    }
  }

  .text-editor {
    &.disabled {
      cursor: not-allowed !important;

      * {
        cursor: not-allowed !important;
      }
    }
  }
</style>

<template>
  <div
    class="text-pad"
    v-x-drag="dragConfig"
    :disabled-drag="disabled"
    :disabled-resize="disabled"
    :style="padStyle"
    @click.stop.prevent="handleClick"
    @dblclick.stop.prevent
  >
    <div :class="{ 'text-pad-resize': true, 'resize-right-border': true, 'disabled': disabled }"></div>
    <div :class="{ 'text-pad-resize': true, 'resize-left-border': true, 'disabled': disabled }"></div>
    <div class="text-pad-header" :style="padHeaderStyle" v-show="!disabled">
      <div :class="{ 'text-pad-title': true, 'disabled': disabled }">
        <!--
        <Input
          v-model="formData.title"
          size="small"
          placeholder="Enter Title..."
        />
        -->
      </div>
      <div class="tools">
        <div :class="{ 'tool-item': true, 'disabled': disabled }" @click.stop.prevent="handleToolClick('color')">
          <Icon type="md-more" />
        </div>
        <div :class="{ 'tool-item': true, 'disabled': disabled }" @click.stop.prevent="handleToolClick('close')">
          <Icon type="md-close" />
        </div>
      </div>
      <div class="color-picker" v-show="showColorPicker">
        <div
          v-for="(item, index) in colorList"
          :class="{ 'color-item': true, 'active': formData.backgroundColor === item }"
          :key="index"
          :style="{ background: item }"
          @click="handleColorPickerChange(item)"
        >
          <Icon v-if="formData.backgroundColor === item" type="md-checkmark" />
        </div>
      </div>
    </div>
    <div class="text-pad-body">
      <Input
        ref="editor"
        :class="{ 'text-editor': true, 'disabled': disabled }"
        v-model="formData.content"
        :readonly="disabled"
        :autofocus="true"
        :style="inputStyle"
        placeholder="Enter something..."
        @on-focus="onEditorFocus"
        @on-blur="onEditorBlur"
      />
    </div>
  </div>
</template>

<script>

export default {
  name: 'TextPad',
  props: {
    info: Object,
    disabled: {
      type: Boolean,
      default: false
    },
    active: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      formData: {
        // 标题
        title: '',
        // 内容
        content: '',
        backgroundColor: '#FFE66E'
      },
      dragConfig: {
        // 拖拽配置
        drag: {
          // 是否启用拖拽
          enable: true,
          // 指定拖拽把手元素，支持一个或多个把手
          handler: ['.text-pad-title'],
          // 拖拽不同阶段 className
          class: {
            start: 'x-drag-start',
            move: 'x-drag-move',
            done: 'x-drag-done',
            main: 'x-drag'
          },
          // 回调
          callback: {
            start: null,
            move: null,
            done: (style) => {
              console.log('drag done', style)
            }
          }
        },
        // 缩放配置
        resize: {
          // 是否启用缩放
          enable: true,
          // 指定缩放把手元素，支持一个或多个把手
          handler: {
            'right-border': '.resize-right-border',
            'left-border': '.resize-left-border'
          },
          // 缩放不同阶段 className
          class: {
            start: 'x-resize-start',
            move: 'x-resize-move',
            done: 'x-resize-done',
            main: 'x-resize'
          },
          // 回调
          callback: {
            start: null,
            move: null,
            done: (style) => {
              console.log('resize done', style)
            }
          }
        }
      },
      showColorPicker: false,
      colorList: ['#FFE66E', '#A1EF9B', '#FFAFDF', '#D7AFFF', '#9EDFFF', '#E0E0E0', '#767676']
    }
  },
  computed: {
    padStyle () {
      let _t = this
      let style = {}
      if (_t.info) {
        style = {
          left: _t.info.x + 'px',
          top: _t.info.y + 'px',
          backgroundColor: _t.formData.backgroundColor,
          zIndex: _t.active ? 500 : 200
        }
      }
      return style
    },
    padHeaderStyle () {
      let _t = this
      return {
        backgroundColor: _t.formData.backgroundColor
      }
    },
    inputStyle () {
      let _t = this
      let style = {}
      if (_t.info) {
        style = {
          color: _t.formData.backgroundColor
        }
      }
      return style
    }
  },
  methods: {
    handleToolClick (name) {
      let _t = this
      if (_t.disabled) {
        return
      }
      switch (name) {
        case 'color':
          // 显示颜色选择器
          _t.showColorPicker = true
          break
        case 'close':
          _t.$emit('close')
          break
      }
    },
    handleColorPickerChange (val) {
      let _t = this
      _t.formData.backgroundColor = val
      _t.showColorPicker = false
    },
    onEditorBlur () {
      let _t = this
      if (_t.disabled) {
        return
      }
      _t.$emit('blur')
    },
    onEditorFocus () {
      let _t = this
      if (_t.disabled) {
        return
      }
      _t.$emit('focus')
    },
    handleClick () {
      let _t = this
      if (_t.disabled) {
        return
      }
      _t.$emit('click')
      _t.doFocus()
    },
    doFocus () {
      let _t = this
      if (_t.disabled) {
        return
      }
      _t.$refs.editor.focus()
    }
  },
  created () {
    let _t = this
    _t.$nextTick(() => {
      _t.doFocus()
    })
  }
}
</script>
