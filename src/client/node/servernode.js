'use strict'

import TreeNode from './treenode'
import DbNode from './dbnode'
import { IconUrl } from '../constants'

const Redis = require('ioredis')

function parseParimayValText (val) {
  let n
  try {
    n = Number(val)
  } catch (e) {
  }
  if (n !== undefined && !isNaN(n)) {
    return n
  }
  return val
}

function parseDbInfo (key, info) {
  if (key.indexOf('db') === 0) {
    let kv = key.split('db')
    if (kv.length > 1) {
      let index = kv[1]
      info.index = Number(index)
    }
  }
  return info
}

function parseValText (val) {
  if (val.indexOf(',') < 0 && val.indexOf(':') < 0) {
    return parseParimayValText(val)
  }
  console.log('parse val test:', val)
  let groups = []
  groups = val.split(',')
  if (groups.length === 0) {
    groups.push(val)
  }
  let ret = {}
  for (let i in groups) {
    let g = groups[i]
    let kv = g.split('=')
    let k = kv[0]
    let v = kv[1]
    v = parseParimayValText(v)
    ret[k] = v
  }
  return ret
}

function parseInfo (infoText) {
  if (infoText === undefined || infoText === '') {
    return {}
  }
  let lines = infoText.split(/[\n\r]+/)
  let ret = {}
  for (let i in lines) {
    let line = lines[i]
    if (line[0] === '#') {
      continue
    }
    let kv = line.split(':')
    if (kv.length === 2) {
      let key = kv[0]
      let val = kv[1]
      let v = parseValText(val)
      v = parseDbInfo(key, v)
      ret[key] = v
    }
  }
  console.log('info obj:', ret)
  return ret
}

export default class ServerNode extends TreeNode {
  constructor (name, data) {
    super(name, 'server')
    this.data = data
    this.state = data.state
    this.redis = undefined
    this.loaded = false
    this.leaf = false
    this.info = {}
  }

  getData () {
    return this.data
  }

  testConnection (callback) {
    this.redis = new Redis(this.data)
    let func = callback
    this.redis.ping(function (err, ret) {
      if (err !== undefined && err !== null) {
        func({
          state: 'error',
          message: err
        })
      } else {
        if (ret === 'PONG') {
          func({
            state: 'success',
            message: 'Test Connection Success!'
          })
        } else {
          func({
            state: 'error',
            message: 'Test Connection Error!'
          })
        }
      }
    })
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
  }

  loadInfo (callback) {
    let self = this
    this.redis.info(function (err, ret) {
      if (err !== undefined && err !== null) {
        console.log('error:', err)
      } else {
        self.info = ret
        console.log('info:', ret)
        if (ret !== undefined) {
          self.info = parseInfo(ret)
          callback(self.info)
        }
      }
    })
  }

  addDb (dbInfo) {
    let db = new DbNode({
      serverNode: this,
      index: dbInfo.index,
      keys: dbInfo.keys,
      avgTtl: dbInfo.avg_ttl,
      expires: dbInfo.expires
    })
    this.addChild(db)
  }

  open (onopen) {
    if (this.opened) {
      return
    }
    let self = this
    this.startLoading()
    this.connection()
    let callback = onopen
    this.loadInfo(function (info) {
      for (let key in info) {
        if (key.indexOf('db') === 0) {
          self.addDb(info[key])
        }
      }
      self.loading = false
      self.opened = true
      if (callback !== undefined) {
        callback(self)
      }
    })
  }

  getPage () {
    return this.info
  }

  iconUrl () {
    if (this.opened) {
      return IconUrl.SERVER_OPENED
    }
    return IconUrl.SERVER_CLOSED
  }
}
