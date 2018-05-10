'use strict'

import TreeNode from './treenode'
import KeyNode from './keynode'
import FolderNode from './foldernode'
import { IconUrl } from '../constants'

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
    this.cursor = 0
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

    this.redis.defineCommand('listKeys', {
      numberOfKeys: 3,
      lua: 'local startCursor = tonumber(KEYS[1]);' +
           'local size = tonumber(KEYS[2]);' +
           'local maxScanSize = tonumber(KEYS[3]);' +
           'local dbsize = redis.call("DBSIZE");' +
           'local scanCount = 0;' +
           'local keysret = redis.call("SCAN", startCursor, "COUNT", size);' +
           'local nextCursor = tonumber(keysret[1]);' +
           'local keys = keysret[2];' +
           'local len = table.getn(keys);' +
           'local totallen = len;' +
           'local ret = {};' +
           'local folders = {};' +
           'local flen = table.getn(folders);' +
           'while (true) do ' +
              'for i=1,len,1 do ' +
                'local k = keys[i];' +
                'local index = string.find(k, ":");' +
                'if (index ~= nil and index > 0) then ' +
                  'local head = string.sub(k, 0, index - 1);' +
                  'if (folders[head] == nil) then ' +
                    'folders[head] = 1;' +
                    'table.insert(ret, {key=head, type="folder"});' +
                  'end;' +
                'else ' +
                  'local ty = redis.call("TYPE", tostring(k));' +
                  'table.insert(ret, {key=k, type=ty["ok"]});' +
                'end;' +
              'end;' +
              'local rlen = table.getn(ret);' +
              'if (nextCursor == 0 or rlen >= size or totallen >= dbsize or scanCount >= maxScanSize) then ' +
                'return cjson.encode({start=startCursor, next=nextCursor, value=ret, len=rlen, scanCount=scanCount});' +
              'end;' +
              'keysret = redis.call("SCAN", nextCursor, "COUNT", size);' +
              'nextCursor = tonumber(keysret[1]);' +
              'keys = keysret[2];' +
              'len = table.getn(keys);' +
              'totallen = totallen + len;' +
              'scanCount = scanCount + 1;' +
          'end;' +
          'return cjson.encode({start=startCursor, next=nextCursor, value=ret});'
    })
  }

  // 'local ty = redis.call("TYPE", tostring(k));' +
  // 'table.insert(ret, {key=k, type=ty["ok"]});' +
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
    this.startLoading()
    this.connection()
    let self = this
    let callback = onopen
    this.redis.listKeys(this.cursor, 200, 1000, function (err, ret) {
      if (err !== undefined && err !== null) {
        console.log('error:', err)
      } else {
        console.log('keys ret:', ret)
        if (ret && ret.length > 1) {
          if (self.children === undefined) {
            self.children = []
          }
          console.log('list keys result json text:', ret)
          let retjson = JSON.parse(ret)
          console.log('list keys result json:', retjson)
          self.cursor = retjson.next
          let vals = retjson.value
          for (let i in vals) {
            let keyInfo = vals[i]
            self.addKeyChild(keyInfo)
          }
          self.sortChildNodes()
          self.loading = false
          self.opened = true
          console.log('nodes:', self.children)
          if (callback !== undefined) {
            callback(self)
          }
        }
      }
    })
  }

  addKeyChild (keyInfo) {
    let key = keyInfo.key
    let keyType = keyInfo.type
    let keyNode = null
    if (keyType === 'folder') {
      keyNode = new FolderNode(key, {
        serverNode: this,
        parent: this
      })
    } else {
      keyNode = new KeyNode(key, {
        serverNode: this,
        keyType: keyType,
        parent: this
      })
    }
    keyNode.indent = this.indent + 1
    this.addChild(keyNode)
  }

  sortChildNodes () {
    let newChildren = []
    let clist = this.children.sort((a, b) => a.name > b.name)
    for (let i in clist) {
      let node = clist[i]
      let type = node.type
      if (type === 'folder') {
        newChildren.push(node)
      }
    }
    for (let i in clist) {
      let node = clist[i]
      let type = node.type
      if (type !== 'folder') {
        newChildren.push(node)
      }
    }
    this.children = newChildren
    console.log('sort children:', this.chil)
  }

  simpleInfo () {
    return '[ keys: ' + this.keys + ' ]'
  }

  iconUrl () {
    return IconUrl.DB
  }
}
