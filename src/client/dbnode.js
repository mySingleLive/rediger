'use strict'

import TreeNode from './treenode'
import KeyNode from './keynode'
import { IconUrl } from './constants'

const Redis = require('ioredis')

export default class DbNode extends TreeNode {
  constructor ({serverNode, index, keys, avgTtl, expires}) {
    super('db' + index, 'db')
    this.serverNode = serverNode
    this.index = index
    this.keys = keys
    this.avgTtl = avgTtl
    this.expires = expires
    this.leaf = false
    this.loaded = false
    this.redis = undefined
    let serverData = serverNode.data
    this.data = {
      port: serverData.port,
      host: serverData.host,
      family: serverData.family,
      password: serverData.password,
      db: this.index
    }
  }

  defineCommands () {
    this.redis.defineCommand('top', {
      numberOfKeys: 1,
      lua: 'local keysret = redis.call("SCAN", 0, "COUNT", tonumber(KEYS[1]));' +
           'local keys = keysret[2]' +
           'local len = table.getn(keys);' +
           'local ret = {};' +
           'for i=1,len,1 do ' +
            'local k = keys[i];' +
            'local ty = redis.call("TYPE", tostring(k));' +
            'table.insert(ret, {key=k, type=ty["ok"]});' +
           'end;' +
           'return cjson.encode(ret);'
    })
  }

  connection () {
    if (this.loaded || this.redis !== undefined) {
      return
    }
    this.redis = new Redis(this.data)
    this.defineCommands()
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
        console.log('keys ret:', ret)
        if (ret && ret.length > 1) {
          if (self.children === undefined) {
            self.children = []
          }
          let vals = JSON.parse(ret)
          console.log('lllll:', vals)
          for (let i in vals) {
            let keyInfo = vals[i]
            let key = keyInfo.key
            let keyNode = new KeyNode(key, {
              serverNode: self,
              keyType: keyInfo.type
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

  simpleInfo () {
    return '[ keys: ' + this.keys + ' ]'
  }

  iconUrl () {
    return IconUrl.DB
  }
}
