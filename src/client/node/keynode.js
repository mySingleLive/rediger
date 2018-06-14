'use strict'

import TreeNode from './treenode'
import KeyValuePage from '../page/key_value_page'
import { IconUrl } from '../constants'

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
    this.loadKeyType((keyType) => {
      let handler = this.KEY_HANDLER[keyType]
      if (handler !== undefined) {
        handler(k, (err, ret) => {
          if (err !== undefined && err !== null) {
            console.log('error:', err)
          } else {
            console.log('query result:', ret)
            this.queryResult = new KeyValuePage({
              keyNode: this,
              key: k,
              keyType: keyType,
              value: ret,
              fullname: this.getFullName()
            })
          }
          if (onopen !== undefined) {
            onopen(this)
          }
        })
      }
    })
  }

  loadKeyType (callback) {
    let k = this.name
    let redis = this.serverNode.redis
    redis.type(k, (err, ret) => {
      if (err !== undefined && err !== null) {
        console.log('error:', err)
      } else {
        console.log('key type:', ret)
        this.keyType = ret
      }
      if (callback !== undefined) {
        callback(ret)
        this.cachedCallback = callback
      }
    })
  }

  reload () {
    this.loadKeyType(this.cachedCallback)
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

  getFullName () {
    return this.parent.getFullName() + ':' + this.name
  }
}
