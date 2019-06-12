import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    activeBoardIndex: null,
    boardList: []
  },
  mutations: {
    'board/activeBoardIndex/update': (state, data) => {
      state.activeBoardIndex = data
    },
    'board/list/add': (state, data) => {
      state.boardList.push(data)
    },
    'board/list/remove': (state, index) => {
      // console.log('typeof index', index, typeof index)
      // let list = state.boardList
      // let arr = []
      // for (let i = 0, len = list.length; i < len; i++) {
      //   if (i !== index) {
      //     arr.push(list[i])
      //   }
      // }
      // state.boardList = arr
      state.boardList.splice(index, 1)
    },
    'board/screenshot/update': (state, { index, screenshot }) => {
      state.boardList[index].screenshot = screenshot
    }
  },
  actions: {

  },
  getters: {
    activeBoardIndex: (state) => state.activeBoardIndex,
    boardList: (state) => state.boardList
  }
})
