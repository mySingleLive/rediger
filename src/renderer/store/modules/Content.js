const state = {
  selectedNode: undefined,
  selectedPage: undefined,
  pageSelectionStack: [],
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

function removeListItem (list, item) {
  let newList = []
  for (let i in list) {
    let obj = list[i]
    if (obj !== undefined && obj !== item) {
      newList.push(obj)
    }
  }
  return newList
}

function selectPage (state, page) {
  if (page === undefined) {
    return
  }
  if (state.pageList.indexOf(page) === -1) {
    return
  }
  if (state.selectedPage !== undefined) {
    state.selectedPage.active = false
  }
  state.selectedPage = page
  page.active = true
  state.pageSelectionStack = removeListItem(state.pageSelectionStack, page)
  state.pageSelectionStack.push(page)
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
    if (page.pageMode === 'add' || page.pageMode === 'first') {
      if (state.pageNameMap[page.fullname] === undefined) {
        console.log('add page, current page list is:', state.pageList)
        if (page.pageMode === 'add') {
          state.pageList.push(page)
        } else if (page.pageMode === 'first') {
          state.pageList.splice(0, 0, page)
        }
        state.pageNameMap[page.fullname] = state.pageList.indexOf(page)
      } else {
        let idx = state.pageNameMap[page.fullname]
        let curPage = state.pageList[idx]
        if (curPage !== undefined) {
          state.pageList[idx] = page
        }
      }
    }
    selectPage(state, page)
  },
  SELECT_PAGE (state, page) {
    selectPage(state, page)
  },
  CHANGE_PAGE_POSITION (state, {page, newPosPage}) {
    if (page === newPosPage) {
      return
    }
    let newPageList = []
    let list = state.pageList
    let pageIdx = list.indexOf(page)
    let newPageIdx = list.indexOf(newPosPage)
    for (let i in list) {
      let obj = list[i]
      if (obj !== page) {
        if (obj === newPosPage) {
          if (pageIdx > newPageIdx) {
            newPageList.push(page)
            newPageList.push(obj)
          } else {
            newPageList.push(obj)
            newPageList.push(page)
          }
        } else {
          newPageList.push(obj)
        }
      }
    }
    state.pageList = newPageList
  },
  CLOSE_PAGE (state, page) {
    let idx = state.pageList.indexOf(page)
    if (idx !== -1) {
      if (page.active) {
        state.selectedPage = undefined
      }
      state.pageNameMap[page.fullname] = undefined
      state.pageList = removeListItem(state.pageList, page)
      if (page.active) {
        state.pageSelectionStack.pop()
        let lastPage = state.pageSelectionStack[state.pageSelectionStack.length - 1]
        if (lastPage !== undefined) {
          selectPage(state, lastPage)
        }
      } else {
        state.pageSelectionStack = removeListItem(state.pageSelectionStack, page)
      }
    }
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
