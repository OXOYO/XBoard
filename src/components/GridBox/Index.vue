/**
* Created by OXOYO on 2019/6/11.
*
* GridBox
*/

<style scoped lang="less" rel="stylesheet/less">
  .grid-box {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 600;
    background: rgba(55, 55, 55, 0.6);
    overflow: auto;
    text-align: center;

    &:hover {
      .close {
        top: 0;
      }
    }

    .close {
      position: fixed;
      top: -80px;
      right: 20px;
      width: 50px;
      height: 50px;
      background: transparent;
      color: #000000;
      line-height: 50px;
      transition: all .5s ease-in-out;
      border-radius: 50%;
      z-index: 10;

      &:hover {
        background: #000000;
        color: #ffffff;
      }

      .ivu-icon {
        margin: 0;
        font-size: 30px;
      }
    }
    .block-box {
      position: relative;
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;
      align-content: flex-start;
      padding: 20px;

      .block-item {
        position: relative;
        flex: 0 0 auto;
        width: 400px;
        height: 250px;
        line-height: 250px;
        margin: 10px;
        background: #ffffff;
        color: #000000;
        border: 3px solid #ffffff;
        text-align: center;
        overflow: hidden;

        &:hover {
          box-shadow: 0 0 1px 1px rgba(255, 255, 255, 1);

          .close {
            top: 0;
          }
        }

        &.block-add {
          background: transparent;
          font-size: 50px;
        }

        &.block-active {
          border-color: #19be6b;

          &:hover {
            box-shadow: 0 0 1px 1px #19be6b;
          }

          .active {
            top: 0;
          }
        }

        .close {
          position: absolute;
          top: -50px;
          left: 50%;
          width: 30px;
          height: 30px;
          background: transparent;
          color: #000000;
          line-height: 1;
          transition: all .5s ease-in-out;
          border-radius: 50%;
          margin-left: -15px;

          &:hover {
            background: #000000;
            color: #ffffff;
          }

          .ivu-icon {
            margin: 0;
            font-size: 30px;
          }
        }

        .active {
          position: absolute;
          top: -50px;
          right: 0;
          width: 30px;
          height: 30px;
          background: #19be6b;
          color: #ffffff;
          line-height: 30px;
          transition: all .5s ease-in-out;

          .ivu-icon {
            margin: 0;
            font-size: 30px;
          }
        }
      }
    }
  }
</style>

<template>
  <div class="grid-box" v-show="isShow">
    <div class="close">
      <Icon type="md-close" />
    </div>
    <div class="block-box">
      <div
        v-for="(item, index) in boardList"
        :key="index"
        :class="{ 'block-item': true, 'block-active': activeBoardIndex === index }"
        @click.stop.prevent="doTrigger(index)"
      >
        {{ index }}
        <div class="close" @click.stop.prevent="doRemoveBoard(index)">
          <Icon type="md-close" />
        </div>
        <div class="active">
          <Icon type="md-checkmark" />
        </div>
        <div class="img"></div>
      </div>
      <div class="block-item block-add" @click.stop.prevent="doAddBoard">
        <Icon type="md-add" />
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'GridBox',
    data () {
      return {
        isShow: false,
        boardList: [
          {
            img: ''
          },
          {
            img: ''
          }
        ],
        activeBoardIndex: 0
      }
    },
    methods: {
      doAddBoard () {
        let _t = this
        _t.boardList.push({
          img: ''
        })
      },
      doRemoveBoard (index) {
        let _t = this
        _t.$Modal.confirm({
          title: _t.$t('L10101'),
          content: _t.$t('L10107'),
          onOk: function () {
            // 删除一项
            _t.boardList.splice(index, 1)
            // 至少有一个画板
            if (!_t.boardList.length) {
              _t.doAddBoard()
            }
            // 处理激活项
            if (_t.activeBoardIndex > index) {
              _t.activeBoardIndex--
            } else if (_t.activeBoardIndex === index) {
              _t.activeBoardIndex = index === _t.boardList.length ? index - 1 : index
            }
          }
        })
      },
      doTrigger (index) {
        let _t = this
        _t.activeBoardIndex = index
      },
      doClose () {
        let _t = this
        _t.$emit('close')
      }
    },
    created: function () {
      let _t = this
      // 监听事件
      _t.$X.utils.bus.$on('platform/gridBox/show', function () {
        _t.isShow = true
      })
      _t.$X.utils.bus.$on('platform/gridBox/hide', function () {
        _t.isShow = false
      })
    },
    beforeDestroy: function () {
      let _t = this
      // 注销事件
      _t.$X.utils.bus.$off([
        'platform/gridBox/show',
        'platform/gridBox/hide'
      ])
    }
  }
</script>
