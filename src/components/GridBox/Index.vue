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
        border: 2px solid #ffffff;
        text-align: center;
        overflow: hidden;
        box-shadow: 0 4px 12px rgba(0, 0, 0, .15);

        &:hover {
          box-shadow: 0 0 1px 1px rgba(255, 255, 255, 1);

          .close {
            top: 0;
          }
        }

        &.block-add {
          background: transparent;
          font-size: 50px;
          color: #ffffff;
        }

        &.block-active {
          /*border-color: #19be6b;*/

          &:hover {
            /*box-shadow: 0 0 1px 1px #19be6b;*/
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

        .img {
          width: 100%;
          height: 100%;

          img {
            width: 100%;
            height: 100%;
            margin: 0;
          }
        }
      }
    }
  }
</style>

<template>
  <div class="grid-box" v-show="isShow">
    <div class="close" @click.stop.prevent="doClose">
      <Icon type="md-close" />
    </div>
    <div class="block-box">
      <div
        v-for="(item, index) in boardList"
        :key="index"
        :class="{ 'block-item': true, 'block-active': activeIndex === index }"
        @click.stop.prevent="doTrigger(index)"
      >
        <div class="close" @click.stop.prevent="doRemoveBoard(index)">
          <Icon type="md-close" />
        </div>
        <div class="active">
          <Icon type="md-checkmark" />
        </div>
        <div class="img">
          <img :src="item.screenshot" alt="">
        </div>
      </div>
      <div class="block-item block-add" @click.stop.prevent="doAddBoard">
        <Icon type="md-add" />
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'GridBox',
    data () {
      return {
        isShow: false,
        activeIndex: 0
      }
    },
    computed: {
      ...mapGetters([
        'activeBoardIndex',
        'boardList'
      ])
    },
    watch: {
      activeBoardIndex (val) {
        let _t = this
        _t.activeIndex = val
      }
    },
    methods: {
      doAddBoard () {
        let _t = this
        // 更新激活项
        _t.activeIndex = _t.boardList.length
        // 分发mutation，新增画板
        _t.$store.commit('board/list/add', {
          id: new Date().getTime(),
          screenshot: ''
        })
      },
      doRemoveBoard (index) {
        let _t = this
        _t.$Modal.confirm({
          title: _t.$t('L10101'),
          content: _t.$t('L10107'),
          onOk: function () {
            // 删除一项
            _t.$store.commit('board/list/remove', index)
            _t.$nextTick(function () {
              // 处理激活项
              if (_t.activeIndex >= index) {
                if (_t.activeIndex > 0) {
                  _t.activeIndex--
                } else {
                  _t.activeIndex = 0
                  // 广播事件
                  _t.$X.utils.bus.$emit('board/list/remove')
                }
              }
              _t.$store.commit('board/activeBoardIndex/update', _t.activeIndex)
            })
          }
        })
      },
      doTrigger (index) {
        let _t = this
        _t.activeIndex = index
      },
      doClose () {
        let _t = this
        _t.isShow = false
        _t.$store.commit('board/activeBoardIndex/update', _t.activeIndex)
        _t.$emit('close')
      },
      doShow (data) {
        let _t = this
        _t.isShow = true
        _t.$store.commit('board/screenshot/update', {
          index: _t.activeIndex || 0,
          screenshot: data
        })
      },
      doHide () {
        let _t = this
        _t.isShow = false
      }
    }
  }
</script>
