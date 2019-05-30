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
  import SignaturePad from 'signature_pad'

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
    methods: {
      setOption (key, val) {
        let _t = this
        if (_t.signaturePad && key) {
          _t.signaturePad[key] = val
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

        if (data) {
          data.pop()
          return _t.signaturePad.fromData(data)
        }
      },
      // 将签名图像作为点组数组返回
      toData (type) {
        return this.signaturePad.toData(type)
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
        console.log('this.signaturePad', this.signaturePad)
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
      }
    },
    mounted () {
      let _t = this
      let canvas = _t.$refs.padCanvas
      // 创建画板实例
      _t.signaturePad = new SignaturePad(canvas, {
        ..._t.defOptions,
        ..._t.options
      })

      // 绑定resize事件
      _t.onResizeHandler = _t.resizeCanvas.bind(_t)
      window.addEventListener('resize', _t.onResizeHandler, false)
      // 触发resize事件
      _t.resizeCanvas()
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
