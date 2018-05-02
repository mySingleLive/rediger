'use strict'

import TreeNode from './treenode'
import { IconUrl } from '../constants'

export default class FolderNode extends TreeNode {
  constructor (name, {serverNode, parent}) {
    super(name, 'folder')
    this.serverNode = serverNode
    this.parent = parent
  }

  simpleInfo () {
    return ''
  }

  getPage () {
    return ''
  }

  iconUrl () {
    return IconUrl.FOLDER
  }
}
