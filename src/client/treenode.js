'use strict'

export default class TreeNode {
  constructor (name, type) {
    this.name = name
    this.type = type
    this.children = []
    this.indent = 0
    this.opened = false
    this.singleSelected = false
    this.expanded = false
    this.leaf = true
    this.icon = undefined
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

  getChildren () {
    return this.children
  }

  getPage () {
    return {
      key: this.name,
      value: 'none'
    }
  }

  expand () {
    this.expanded = true
  }

  unexpand () {
    this.expanded = false
  }

  simpleInfo () {
    return undefined
  }

  iconUrl () {
    return undefined
  }
}
