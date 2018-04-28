'use strict'

import TreeNode from './treenode'

export default class MiddleNode extends TreeNode {
    constructor (name, type) {
        super(name, type)
        this.leaf = false
    }
}
