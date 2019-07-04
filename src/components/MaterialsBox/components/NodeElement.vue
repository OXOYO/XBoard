/**
* Created by OXOYO on 2019/7/2.
*
* NodeElement 节点元素
*/

<style scoped lang="less" rel="stylesheet/less">
  .node-element {
    display: inline-block;
    margin: 2px;
    border: 1px solid transparent;

    &:hover {
      border-color: rgba(0, 0, 0, .1);
      cursor: move;
    }
    .content {
      display: inline-block;
      width: 100%;
      height: 100%;
    }
  }
</style>

<template>
  <div
    class="node-element"
    :style="elementStyle"
    @mousedown="handleMouseDown"
  >
    <!-- v-x-drag="dragConfig" -->
    <div class="content">
      {{ shape }}
    </div>
  </div>
</template>

<script>
  export default {
    name: 'NodeElement',
    props: {
      shape: String,
      width: {
        type: Number,
        default: 40
      },
      height: {
        type: Number,
        default: 40
      }
    },
    data () {
      let _t = this
      return {
        dragConfig: {
          // 拖拽配置
          drag: {
            // 是否启用拖拽
            enable: true,
            // 指定拖拽把手元素，支持一个或多个把手
            handler: ['.content'],
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
              done: _t.handleDragDone
            }
          }
        }
      }
    },
    computed: {
      elementStyle () {
        let _t = this
        let style = {}
        if (_t.width) {
          style.width = _t.width + 'px'
        }
        if (_t.height) {
          style.height = _t.height + 'px'
        }
        return style
      }
    },
    methods: {
      handleDragDone (style) {
        let _t = this
        console.log('drag done', style)
        _t.$X.utils.bus.$emit('board/materials/editor/add/node', {
          style,
          shape: _t.shape
        })
      },
      handleMouseDown (event) {
        let _t = this
        _t.$X.utils.bus.$emit('board/materials/editor/add/node', {
          style: {
            left: event.clientX,
            top: event.clientY
          },
          shape: _t.shape
        })
      }
    }
  }
</script>
