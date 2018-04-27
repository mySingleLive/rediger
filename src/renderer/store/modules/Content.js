const state = {
  selectedNode: undefined,
  page: {
    key: 'Unkown',
    value: 'Unkown'
  },
  menu: {
    indentSpace: 20,
    leftSpace: 30,
    lastSingleSelected: undefined
  }
}

const mutations = {
  SELECT_NODE (state, node) {
    console.log('SELECT:', node)
    console.log('SELECT state:', state)
    state.selected = node
  },
  SINGLE_SELECT_NODE(state, node) {
    state.menu.lastSingleSelected = node
  }
}

const actions = {
  selectNode ({commit}, node) {
    commit('SELECT_NODE', node)
  }
}

export default {
  state,
  mutations,
  actions
}
