'use strict'

export default class TreeNode {
  constructor (name, type) {
    this.name = name
    this.type = type
    this.children = []
    this.indent = 0
    this.opened = false
  }

  open (onopen) {
    this.opened = true
    if (onopen !== undefined) {
      onopen(this)
    }
  }

  addChild (node) {
    this.children.push(node)
  }

  getContent () {
    return {
      key: this.name,
      value: 'none'
    }
  }
}
