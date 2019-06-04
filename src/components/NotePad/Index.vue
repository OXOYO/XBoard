/**
* Created by OXOYO on 2019/6/3.
*
* NotePad
*/

<style lang="less" rel="stylesheet/less">
  .note-pad {
    display: inline-block;
  }
  .x-window {
    position: absolute;
    min-width: 390px;
    min-height: 140px;
    height: 200px;
    /*border: 1px solid rgba(0, 0, 0, .3);*/
    background: #fff;
    box-sizing: border-box;
    overflow: hidden;

    .x-window-header {
      height: 40px;
      line-height: 40px;
      /*border-bottom: 1px solid rgba(0, 0, 0, .3);*/
      background: rgba(255, 255, 255, .3);
      cursor: default;

      &:hover {
        /*background: rgba(0, 0, 0, .1);*/
      }

      .x-window-title {
        padding: 0 10px;
        text-align: left;
        height: 100%;
        cursor: default;

        &.disabled {
          cursor: not-allowed !important;
        }
      }
      .tools {
        position: absolute;
        top: 0;
        right: 0;

        .tool-item {
          display: inline-block;
          position: relative;
          min-width: 25px;
          height: 30px;
          line-height: 30px;
          /*padding: 10px;*/
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
    }
    .x-window-body {
      padding: 10px;
      overflow: auto;
      height: calc(~"100% - 40px");
    }
  }

  .x-drag-start,
  .x-drag-move {
    transition: none;
    opacity: .7;

    .x-window-header {
      .x-window-title {
        cursor: move !important;
      }
    }
    .x-window-body {

    }
  }

  .app-window-resize {
    width: 20px;
    height: 20px;
    position: absolute;
    background: transparent;

    &.disabled {
      cursor: not-allowed !important;
    }

    &.resize-top-left {
      cursor: nw-resize;
      top: 0;
      left: 0;
    }
    &.resize-top-right {
      cursor: ne-resize;
      top: 0;
      right: 0;
    }
    &.resize-bottom-left {
      cursor: sw-resize;
      bottom: 0;
      left: 0;
    }
    &.resize-bottom-right {
      cursor: se-resize;
      bottom: 0;
      right: 0;
    }
    &.resize-top-border {
      cursor: ns-resize;
      top: 0;
      width: 100%;
      height: 2px;
    }
    &.resize-right-border {
      cursor: ew-resize;
      right: 0;
      width: 2px;
      height: 100%;
    }
    &.resize-bottom-border {
      cursor: ns-resize;
      bottom: 0;
      width: 100%;
      height: 2px;
    }
    &.resize-left-border {
      cursor: ew-resize;
      left: 0;
      width: 2px;
      height: 100%;
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

  .quill-editor {
    .ql-toolbar {
      border: none;
    }
    .ql-container {
      border: none;
    }
  }
  .note-editor {
    &.disabled {
      cursor: not-allowed !important;

      .ql-toolbar {
        visibility: hidden;
      }
    }
    visibility: visible;
  }
</style>

<template>
  <div
    class="x-window"
    v-x-drag="dragConfig"
    :disabled-drag="disabled"
    :disabled-resize="disabled"
    :style="windowStyle"
    @click.stop
    @dblclick.stop.prevent
  >
    <div :class="{ 'app-window-resize': true, 'resize-top-left': true, 'disabled': disabled }"></div>
    <div :class="{ 'app-window-resize': true, 'resize-top-right': true, 'disabled': disabled }"></div>
    <div :class="{ 'app-window-resize': true, 'resize-bottom-left': true, 'disabled': disabled }"></div>
    <div :class="{ 'app-window-resize': true, 'resize-bottom-right': true, 'disabled': disabled }"></div>
    <div :class="{ 'app-window-resize': true, 'resize-top-border': true, 'disabled': disabled }"></div>
    <div :class="{ 'app-window-resize': true, 'resize-right-border': true, 'disabled': disabled }"></div>
    <div :class="{ 'app-window-resize': true, 'resize-bottom-border': true, 'disabled': disabled }"></div>
    <div :class="{ 'app-window-resize': true, 'resize-left-border': true, 'disabled': disabled }"></div>
    <div class="x-window-header" v-show="!disabled">
      <div :class="{ 'x-window-title': true, 'disabled': disabled }">
        <!--
        <Input
          v-model="formData.title"
          size="small"
          placeholder="Enter Title..."
        />
        -->
      </div>
      <div class="tools">
        <div :class="{ 'tool-item': true, 'disabled': disabled }" @click.stop.prevent="handleToolClick('backgroundColor')">
          <Icon type="md-more" />
        </div>
        <div :class="{ 'tool-item': true, 'disabled': disabled }" @click.stop.prevent="handleToolClick('close')">
          <Icon type="md-close" />
        </div>
      </div>
    </div>
    <div class="x-window-body">
      <!--<Input
        v-model="formData.content"
        type="textarea"
        :autosize="true"
        :autofocus="true"
        placeholder="Enter something..."
      />-->
      <quill-editor
        ref="noteEditor"
        :class="{ 'note-editor': true, 'disabled': disabled }"
        v-model="formData.content"
        :options="editorOption"
        :disabled='disabled'
        @click.stop.prevent
        @blur="onEditorBlur($event)"
        @focus="onEditorFocus($event)"
      >
      </quill-editor>
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
</template>

<script>
  import hljs from 'highlight.js'

  export default {
    name: 'NotePad',
    props: {
      info: Object,
      disabled: Boolean
    },
    data () {
      return {
        // 状态 edit：编辑 preview：编辑
        status: 'edit',
        formData: {
          // 便签标题
          title: '',
          // 便签内容
          content: '',
          backgroundColor: '#FFE66E'
        },
        dragConfig: {
          // 拖拽配置
          drag: {
            // 是否启用拖拽
            enable: true,
            // 指定拖拽把手元素，支持一个或多个把手
            handler: ['.x-window-title'],
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
              'top-left': '.resize-top-left',
              'top-right': '.resize-top-right',
              'bottom-left': '.resize-bottom-left',
              'bottom-right': '.resize-bottom-right',
              'top-border': '.resize-top-border',
              'right-border': '.resize-right-border',
              'bottom-border': '.resize-bottom-border',
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
        editorOption: {
          modules: {
            toolbar: [
              [{ 'size': ['small', false, 'large'] }],
              ['bold', 'italic', 'underline', 'strike'],
              [
                { 'list': 'ordered' },
                { 'list': 'bullet' }
              ],
              ['image']
            ],
            syntax: {
              highlight: text => hljs.highlightAuto(text).value
            },
            imageDrop: true,
            imageResize: {
              displayStyles: {
                backgroundColor: 'black',
                border: 'none',
                color: 'white'
              },
              modules: [ 'Resize', 'DisplaySize', 'Toolbar' ]
            }
          }
        },
        showColorPicker: false,
        colorList: ['#FFE66E', '#A1EF9B', '#FFAFDF', '#D7AFFF', '#9EDFFF', '#E0E0E0', '#767676']
      }
    },
    computed: {
      windowStyle () {
        let _t = this
        let style = {}
        if (_t.info) {
          style = {
            left: _t.info.x + 'px',
            top: _t.info.y + 'px',
            background: _t.formData.backgroundColor
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
          case 'backgroundColor':
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
      onEditorBlur (editor) {
        this.$emit('blur')
      },
      onEditorFocus (editor) {
        this.$emit('focus')
      }
    }
  }
</script>
