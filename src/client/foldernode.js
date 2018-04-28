'use strict'

import TreeNode from './treenode'

export default class FolderNode extends TreeNode {
  constructor (name) {
    super(name, 'folder')
  }
}
