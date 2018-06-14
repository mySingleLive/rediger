const state = {
  selectedNode: undefined,
  selectedPage: undefined,
  page: {
    key: 'Unkown',
    value: 'Unkown'
  },
  pageNameMap: {},
  pageList: [],
  menu: {
    indentSpace: 15,
    leftSpace: 20,
    lastSingleSelected: undefined
  }
}

function selectPage (state, page) {
  if (page === undefined) {
    return
  }
  if (state.selectedPage !== undefined) {
    state.selectedPage.active = false
  }
  state.selectedPage = page
  page.active = true
}

const mutations = {
  SELECT_NODE (state, node) {
    console.log('SELECT:', node)
    console.log('SELECT state:', state)
    state.selected = node
  },
  SINGLE_SELECT_NODE (state, node) {
    state.menu.lastSingleSelected = node
  },
  ADD_PAGE (state, page) {
    selectPage(state, page)
    if (page.pageMode === 'add') {
      if (state.pageNameMap[page.fullname] === undefined) {
        console.log('add page, current page list is:', state.pageList)
        state.pageList.push(page)
        state.pageNameMap[page.fullname] = state.pageList.indexOf(page)
      } else {
        let idx = state.pageNameMap[page.fullname]
        let curPage = state.pageList[idx]
        if (curPage !== undefined) {
          state.pageList[idx] = page
          selectPage(page)
        }
      }
    }
  },
  SELECT_PAGE (state, page) {
    selectPage(state, page)
  },
  UNSELECT_PAGE (state, page) {
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
