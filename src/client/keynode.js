'use strict'

import TreeNode from './treenode'
import KeyValuePage from './key_value_page'
import { IconUrl } from './constants'

export default class KeyNode extends TreeNode {
  constructor (name, {serverNode, keyType, parent}) {
    super(name, 'key')
    this.serverNode = serverNode
    this.keyType = keyType
    this.parent = parent
    let redis = this.serverNode.redis
    this.KEY_HANDLER = {
      'string': function (key, callback) {
        redis.get(key, callback)
      },
      'hash': function (key, callback) {
        console.log('handle HASH key:', key)
      },
      'list': function (key, callback) {
        console.log('handle LIST key:', key)
      }
    }
  }
  open (onopen) {
    if (this.opened) {
      return
    }
    let k = this.name
    console.log('query key:', k)
    let self = this
    let callback = onopen
    this.loadKeyType(function (keyType) {
      let handler = self.KEY_HANDLER[keyType]
      if (handler !== undefined) {
        handler(k, function (err, ret) {
          if (err !== undefined && err !== null) {
            console.log('error:', err)
          } else {
            console.log('query result:', ret)
            self.queryResult = new KeyValuePage({
              key: k,
              keyType: keyType,
              value: ret
            })
          }
          if (callback !== undefined) {
            callback(self)
          }
        })
      }
    })
  }

  loadKeyType (callback) {
    let k = this.name
    let redis = this.serverNode.redis
    redis.type(k, function (err, ret) {
      if (err !== undefined && err !== null) {
        console.log('error:', err)
      } else {
        console.log('key type:', ret)
        self.keyType = ret
      }
      if (callback !== undefined) {
        callback(ret)
      }
    })
  }

  simpleInfo () {
    return ': <span style="color:lightblue;font-style:italic">' + this.keyType + '</span>'
  }

  getPage () {
    console.log('get key node content!')
    return this.queryResult
  }

  iconUrl () {
    switch (this.keyType) {
      case 'string':
        return IconUrl.STRING
      case 'list':
        return IconUrl.LIST
      case 'hash':
        return IconUrl.HASH
    }
    return IconUrl.KEY
  }
}
