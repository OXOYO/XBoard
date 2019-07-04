/**
 * Created by OXOYO on 2019/7/4.
 *
 * 跳转节点
 */
const OPERATION = {
  // 编辑
  'EDIT': 'EDIT',
  // 删除
  'DEL': 'DEL'
}

const operationList = [
  {
    name: OPERATION.DEL,
    iconUrl: 'https://img.alicdn.com/tfs/TB1vaomoQvoK1RjSZFDXXXY3pXa-14-15.svg',
    size: 14
  },
  {
    name: OPERATION.EDIT,
    iconUrl: 'https://img.alicdn.com/tfs/TB1rNAloHrpK1RjSZTEXXcWAVXa-14-14.svg',
    size: 14
  }
]

const uiConfig = {
  keyShapeStyle: {
    // 默认卡片宽
    width: 200,
    // 固定头部高度
    headerHeight: 34,
    // 固定内容高度
    bodyHeight: 46,
    // 固定底部高度
    footerHeight: 20,
    fill: '#fff',
    stroke: '#CED4D9',
    radius: 2,
    shadowOffsetX: 0,
    shadowOffsetY: 4,
    shadowBlur: 10,
    shadowColor: 'rgba(13, 26, 38, 0.08)'
  },
  textStyle: {
    textAlign: 'start',
    textBaseline: 'top'
  }
}

export default {
  name: 'jump-node',
  extendName: 'anchor-node',
  options: {
    draw (cfg, group) {
      this.mainGroup = group
      this.model = cfg
      const { width, headerHeight, bodyHeight, footerHeight } = uiConfig.keyShapeStyle
      // 最小宽度
      this.width = width
      // 固定高度
      this.height = headerHeight + bodyHeight + footerHeight
      // 原点为矩形中心，所以要做偏移，偏移后x,y为左上角点，后续所有计算基于此点
      this.originX = -this.width / 2
      this.originY = -this.height / 2
      this.keyShape = this._drawKeyShape()
      this.headerShape = this._drawHeaderShape()
      this.bodyShape = this._drawBodyShape()
      this.footerShape = this._drawFooterShape()
      cfg.anchorPoints = [[0.5, 0, { type: 'in' }]]
      return this.keyShape
    },
    _drawKeyShape () {
      return this.mainGroup.addShape('rect', {
        attrs: {
          x: this.originX,
          y: this.originY,
          width: this.width,
          height: this.height,
          ...uiConfig.keyShapeStyle
        }
      })
    },
    // 绘制头部，两个icon
    _drawHeaderShape () {
      const headerShape = this.mainGroup.addGroup()
      // 画头部 icon
      // 在最右边
      let offsetX = this.originX + this.width - 10
      const copyOperationList = operationList.slice()
      copyOperationList.forEach((operation) => {
        headerShape.addShape('image', {
          name: operation.name,
          attrs: {
            img: operation.iconUrl,
            x: offsetX - operation.size,
            y: this.originY + 10,
            width: operation.size,
            height: operation.size
          }
        })
        offsetX = offsetX - 10 - operation.size
      })
      return headerShape
    },
    _drawBodyShape () {
      const bodyShape = this.mainGroup.addGroup()
      const { content, label } = this.model
      const { headerHeight, bodyHeight } = uiConfig.keyShapeStyle
      console.log('bodyHeight', bodyHeight)
      if (content) {
        const dialogTextShape = bodyShape.addShape('text', {
          attrs: {
            x: this.originX + 10,
            y: this.originY + headerHeight,
            height: 30,
            text: content,
            ...uiConfig.textStyle,
            lineHeight: 18,
            fill: '#666666'
          }
        })
        // const fontWeight = dialogTextShape.attr('fontWeight')
        // const fontFamily = dialogTextShape.attr('fontFamily')
        // const fontSize = dialogTextShape.attr('fontSize')
        // const fontStyle = dialogTextShape.attr('fontStyle')
        // const fontVariant = dialogTextShape.attr('fontVariant')
        // const font = `${fontStyle} ${fontVariant} ${fontWeight} ${fontSize}px ${fontFamily}`
        dialogTextShape.attr({ text: content })
      } else {
        bodyShape.addShape('text', {
          attrs: {
            x: this.originX + 10,
            y: this.originY + headerHeight,
            text: label,
            ...uiConfig.textStyle,
            fill: '#00C1DE'
          }
        })
      }
      return bodyShape
    },
    _drawFooterShape () {
      const footerShape = this.mainGroup.addGroup()
      const { actionText } = this.model
      const { headerHeight, bodyHeight } = uiConfig.keyShapeStyle
      if (actionText) {
        this._drawImage(footerShape, this._getImageUrl('active'))
        footerShape.addShape('text', {
          attrs: {
            x: this.originX + 28,
            y: this.originY + headerHeight + bodyHeight - 2,
            text: actionText,
            ...uiConfig.textStyle,
            fill: '#00C1DE'
          }
        })
      } else {
        this._drawImage(footerShape, this._getImageUrl('default'))
      }
      return footerShape
    },
    _drawImage (group, url) {
      const { headerHeight, bodyHeight } = uiConfig.keyShapeStyle
      group.addShape('image', {
        attrs: {
          x: this.originX + 10,
          y: this.originY + headerHeight + bodyHeight,
          img: url,
          width: 12,
          height: 9
        }
      })
    },
    _getImageUrl (type) {
      switch (type) {
        case 'default':
          return 'https://img.alicdn.com/tfs/TB1vK0asVYqK1RjSZLeXXbXppXa-12-9.svg'
        case 'active':
          return 'https://img.alicdn.com/tfs/TB138BbtbvpK1RjSZFqXXcXUVXa-12-9.svg'
        default:
          break
      }
    }
  }
}
