/**
* Created by OXOYO on 2019/5/27.
*
* SignaturePad
*/

<style scoped lang="less" rel="stylesheet/less">
  .pad-box {
    width: 100%;
    height: 100%;
    display: inline-block;

    .pad-canvas {
      width: 100%;
      height: 100%;
    }
  }
</style>

<template>
  <div class="pad-box">
    <canvas class="pad-canvas" ref="padCanvas"></canvas>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  // import SignaturePad from 'signature_pad'
  import SignaturePad from '@/global/lib/signature_pad.js'

  // 擦除
  SignaturePad.prototype.eraser = function () {
    this._ctx.globalCompositeOperation = 'destination-out'
  }
  // 画
  SignaturePad.prototype.draw = function () {
    this._ctx.globalCompositeOperation = 'source-over'
  }

  export default {
    name: 'SignaturePad',
    props: {
      saveType: {
        type: String,
        default: 'image/png'
      },
      options: {
        type: Object,
        default: () => {}
      },
      images: {
        type: Array,
        default: () => []
      }
    },
    data () {
      return {
        signaturePad: {},
        cacheImages: [],
        signatureData: '',
        onResizeHandler: null,
        // 默认配置
        defOptions: {
          dotSize: 1,
          minWidth: 1 * 0.3,
          maxWidth: 1 * 1.7,
          throttle: 16,
          minDistance: 5,
          backgroundColor: 'rgba(0, 0, 0, 0)',
          penColor: 'black',
          velocityFilterWeight: 0.7,
          onBegin: () => {},
          onEnd: () => {}
        },
        // 透明图片
        transparentPng: {
          src:
            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
          x: 0,
          y: 0
        },
        // 图片类型
        imageTypes: ['image/png', 'image/jpeg', 'image/svg+xml']
      }
    },
    computed: {
      ...mapGetters([
        'activeBoardIndex',
        'boardList'
      ]),
      undoHistory () {
        let _t = this
        return _t.boardList[_t.activeBoardIndex].signaturePad.undoHistory
      }
    },
    watch: {
      activeBoardIndex (newVal, oldVal) {
        let _t = this
        _t.handlePad(newVal, oldVal)
      }
    },
    methods: {
      setOption (key, val) {
        let _t = this
        if (_t.signaturePad && key) {
          _t.signaturePad[key] = val
          // 更新padOption
          _t.$store.commit('board/signaturePad/options/update', {
            index: _t.activeBoardIndex,
            data: {
              key,
              val
            }
          })
        }
      },
      resizeCanvas () {
        let _t = this
        const canvas = _t.$refs.padCanvas
        const data = _t.signaturePad.toData()
        const ratio = Math.max(window.devicePixelRatio || 1, 1)
        canvas.width = canvas.offsetWidth * ratio
        canvas.height = canvas.offsetHeight * ratio
        canvas.getContext('2d').scale(ratio, ratio)
        _t.signaturePad.clear()
        _t.signatureData = _t.transparentPng
        _t.signaturePad.fromData(data)
      },
      // 保存
      save () {
        let _t = this
        if (!_t.imageTypes.includes(_t.saveType)) {
          throw new Error('Image type is incorrect!')
        }

        if (_t.signaturePad.isEmpty()) {
          return {
            isEmpty: true,
            data: null
          }
        } else {
          _t.signatureData = _t.signaturePad.toDataURL(_t.saveType)
          return {
            isEmpty: false,
            data: _t.signatureData
          }
        }
      },
      // 撤销
      undo () {
        let _t = this
        let data = _t.signaturePad.toData()
        let last = data.pop()
        if (last) {
          _t.$store.commit('board/signaturePad/undoHistory/update', {
            index: _t.activeBoardIndex,
            data: [
              ..._t.undoHistory,
              last
            ]
          })
          return _t.signaturePad.fromData(data)
        }
      },
      // 撤回
      redo () {
        let _t = this
        let data = _t.signaturePad.toData()
        let last = _t.undoHistory.pop()
        _t.$store.commit('board/signaturePad/undoHistory/update', {
          index: _t.activeBoardIndex,
          data: _t.undoHistory
        })
        if (last) {
          return _t.signaturePad.fromData([
            ...data,
            last
          ])
        }
      },
      // 将签名图像作为点组数组返回
      toData () {
        return this.signaturePad.toData()
      },
      // 从点组数组中绘制签名图像
      fromData (data) {
        return this.signaturePad.fromData(data)
      },
      // 将签名图像作为 DataURL 返回
      toDataURL (type) {
        return this.signaturePad.toDataURL(type)
      },
      // 从 DataURL 中绘制签名图像
      fromDataURL (data) {
        return this.signaturePad.fromDataURL(data)
      },
      // 画
      draw () {
        this.signaturePad.draw()
      },
      // 清除画布
      clear () {
        this.signaturePad.clear()
      },
      // 擦除
      eraser () {
        this.signaturePad.eraser()
      },
      // 解除绑定所有事件处理程序
      off () {
        return this.signaturePad.off()
      },
      // 重新绑定所有事件处理程序
      on () {
        return this.signaturePad.on()
      },
      // 如果canvas为空，则返回true，否则返回false
      isEmpty () {
        return this.signaturePad.isEmpty()
      },
      handleOnBegin () {
        let _t = this
        // 清空撤销历史
        _t.$store.commit('board/signaturePad/undoHistory/update', {
          index: _t.activeBoardIndex,
          data: []
        })
      },
      handlePad (newVal, oldVal) {
        let _t = this
        // 更新旧画板
        if (_t.boardList[oldVal]) {
          _t.$store.commit('board/signaturePad/data/update', {
            index: oldVal,
            data: _t.toData()
          })
        }
        // 更新当前画板
        if (_t.boardList[newVal]) {
          // 更新options
          let padOptions = _t.boardList[newVal].signaturePad.options
          let keys = Object.keys(padOptions)
          for (let i = 0, len = keys.length; i < len; i++) {
            let key = keys[i]
            let val = padOptions[key]
            _t.setOption(key, val)
          }
          // 清除画布
          _t.clear()
          _t.fromData(_t.boardList[newVal].signaturePad.data)
        }
      }
    },
    mounted () {
      let _t = this
      let canvas = _t.$refs.padCanvas
      // 创建画板实例
      _t.signaturePad = new SignaturePad(canvas, {
        ..._t.defOptions,
        ..._t.options,
        onBegin: _t.handleOnBegin
      })

      // 绑定resize事件
      _t.onResizeHandler = _t.resizeCanvas.bind(_t)
      window.addEventListener('resize', _t.onResizeHandler, false)
      // 触发resize事件
      _t.resizeCanvas()
      // 监听事件
      _t.$X.utils.bus.$on('board/list/remove', function () {
        _t.handlePad(0)
      })
    },
    beforeDestroy () {
      let _t = this
      // 解绑resize事件
      if (_t.onResizeHandler) {
        window.removeEventListener('resize', _t.onResizeHandler, false)
      }
    }
  }
</script>
