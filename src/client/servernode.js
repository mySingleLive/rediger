'use strict'

import TreeNode from './treenode'
import KeyNode from './keynode'

const Redis = require('ioredis')

export default class ServerNode extends TreeNode {
  constructor (name, data) {
    super(name, 'server')
    this.data = data
    this.state = data.state
    this.redis = undefined
    this.loaded = false
    this.leaf = false
    this.icon = '@renderer/assets/redis-icon.png'
  }

  getData () {
    return this.data
  }

  connection () {
    if (this.loaded || this.redis !== undefined) {
      return
    }
    this.redis = new Redis(this.data)
    this.redis.defineCommand('top', {
      numberOfKeys: 1,
      lua: 'return redis.call("SCAN", 0, "COUNT", tonumber(KEYS[1]))'
    })
    this.info = {
      name: this.name,
      port: this.data.port,
      host: this.data.host
    }
  }

  open (onopen) {
    if (this.opened) {
      return
    }
    this.connection()
    let self = this
    let callback = onopen
    this.redis.top(30, function (err, ret) {
      if (err !== undefined && err !== null) {
        console.log('error:', err)
      } else {
        if (ret && ret.length > 1) {
          console.log('lllll:', ret)
          if (self.children === undefined) {
            self.children = []
          }
          let vals = ret[1]
          for (let i in vals) {
            let key = vals[i]
            let keyNode = new KeyNode(key, {
              serverNode: self
            })
            keyNode.indent = self.indent + 1
            self.addChild(keyNode)
          }
          self.opened = true
          console.log('nodes:', self.children)
          if (callback !== undefined) {
            callback(self)
          }
        }
      }
    })
  }

  getContent () {
    return this.info
  }
}
