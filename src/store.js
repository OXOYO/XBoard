import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const formData = {
  penColor: '#222F3D',
  backgroundColor: 'rgba(255, 255, 255, 1)',
  dotSize: 1
}

const defBoard = {
  id: '',
  screenshot: '',
  status: {
    footer: true,
    materialsBox: true
  },
  formData: formData,
  signaturePad: {
    // 画板配置
    options: {
      dotSize: formData.dotSize,
      minWidth: formData.dotSize * 0.3,
      maxWidth: formData.dotSize * 1.7,
      throttle: 1,
      minDistance: 1,
      backgroundColor: formData.backgroundColor,
      penColor: formData.penColor
    },
    // 画板数据
    data: [],
    // 撤销历史
    undoHistory: []
  },
  // 文本列表
  textList: [],
  // 便签列表
  noteList: [],
  // 当前激活的面板
  activePad: {}
}

export default new Vuex.Store({
  state: {
    activeBoardIndex: null,
    defBoard: defBoard,
    boardList: [],
    materialsEditor: {
      currentItem: {
        type: null,
        model: null
      }
    }
  },
  mutations: {
    'board/activeBoardIndex/update': (state, data) => {
      state.activeBoardIndex = data
    },
    'board/list/add': (state, data) => {
      let item = {
        ...defBoard,
        ...data
      }
      state.boardList.push(JSON.parse(JSON.stringify(item)))
    },
    'board/list/remove': (state, index) => {
      state.boardList.splice(index, 1)
      // 默认添加一项
      if (!state.boardList.length) {
        let item = {
          ...defBoard
        }
        state.boardList.push(JSON.parse(JSON.stringify(item)))
      }
    },
    'board/screenshot/update': (state, { index, screenshot }) => {
      state.boardList[index].screenshot = screenshot
    },
    'board/signaturePad/options/update': (state, { index, data }) => {
      state.boardList[index].signaturePad.options[data.key] = data.val
    },
    'board/signaturePad/data/update': (state, { index, data }) => {
      state.boardList[index].signaturePad.data = data
    },
    'board/signaturePad/undoHistory/update': (state, { index, data }) => {
      state.boardList[index].signaturePad.undoHistory = data
    },
    'board/materials/editor/currentItem/update': (state, data) => {
      state.materialsEditor.currentItem = data
    }
  },
  actions: {

  },
  getters: {
    activeBoardIndex: (state) => state.activeBoardIndex,
    boardList: (state) => state.boardList,
    defBoard: (state) => state.defBoard,
    currentItem: (state) => state.materialsEditor.currentItem
  }
})
