/**
* Created by OXOYO on 2019/5/17.
*
* Board
*/

<style scoped lang="less" rel="stylesheet/less">
  .board {
    position: absolute;
    top: 10px;
    right: 10px;
    bottom: 10px;
    left: 10px;
    box-shadow: 0 0 5px 2px rgba(0, 0, 0, .1);
    background: bisque;

    .header {
      position: absolute;
      top: 10px;
      right: 10px;
      left: 10px;
      display: inline-block;
      text-align: center;
      z-index: 2000;
      background: transparent;
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
  <div class="board" :style="boardStyle" @click="handleBoardClick">
    <div class="header" v-show="status.header" @mousedown="handleBoardHeaderMouseDown" @contextmenu.stop.prevent>
      <ToolBox style="margin: 0 auto;">
        <template v-for="(item, index) in tools.filter(item => item.enable)">
          <!--<ToolItem :key="index" :label="item.label"></ToolItem>-->
          <ToolItem :key="index" :value="item">
            <template v-slot:label>
              <span class="icon iconfont" :class="[item.icon ? 'icon-' + item.icon : '']"></span>
            </template>
          </ToolItem>
        </template>
      </ToolBox>
    </div>
    <div
      class="body"
      @dblclick="handleBoardBodyDbClick"
      @contextmenu.stop.prevent="handleBoardBodyRightClick($event)"
    >
      <SignaturePad :options="padOptions"></SignaturePad>
      <ContextMenu></ContextMenu>
    </div>
  </div>
</template>

<script>
  import ToolBox from '../components/ToolBox/Index'
  import ToolItem from '../components/ToolBox/ToolItem'
  import SignaturePad from '../components/SignaturePad/Index'
  import ContextMenu from '../components/ContextMenu/Index'

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
          header: true
        },
        currentTheme: '#DEF0F0',
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
        tools: [
          {
            name: 'pencil',
            label: 'Pencil',
            icon: 'pencil',
            enable: true
          },
          {
            name: 'line',
            label: 'Line',
            icon: 'line',
            enable: true
          },
          {
            name: 'text',
            label: 'Text',
            icon: 'text',
            enable: true
          },
          {
            name: 'eraser',
            label: 'Eraser',
            icon: 'eraser',
            enable: true
          },
          {
            name: 'color',
            label: 'Color',
            icon: 'color',
            enable: true
          }
        ],
        // 画板配置
        padOptions: {}
      }
    },
    computed: {
      boardStyle () {
        return {
          background: this.currentTheme
        }
      }
    },
    methods: {
      handleThemeClick (item) {
        this.currentTheme = item.color
        console.log('handleThemeClick', item)
      },
      handleBoardClick () {
        // 广播事件
        this.$X.utils.bus.$emit('platform/contextMenu/hide')
      },
      handleBoardHeaderMouseDown () {
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
    }
  }
</script>
