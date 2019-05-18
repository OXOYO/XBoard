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
  <div class="board" :style="boardStyle">
    <transition name="x-fade">
      <div class="header" v-show="status.header">
      <ToolBox style="margin: 0 auto;">
        <ToolItem :value="currentTheme">
          <template v-slot:label>
            <div class="theme-label" :style="{ background: currentTheme }"></div>
          </template>
          <template v-slot:content>
            <div
              v-for="(item, index) in themes.filter(target => target.enable)"
              :key="index"
              class="theme-item"
              @click="handleThemeClick(item)"
              :style="{ background: item.color }"
            >
            </div>
          </template>
        </ToolItem>
      </ToolBox>
    </div>
    </transition>
    <div class="body" @dblclick="handleDbClick"></div>
  </div>
</template>

<script>
  import ToolBox from '../components/ToolBox/Index'
  import ToolItem from '../components/ToolBox/ToolItem'

  export default {
    name: 'Board',
    components: {
      ToolBox,
      ToolItem
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
        ]
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
      handleDbClick () {
        let _t = this
        _t.switchStatus()
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
