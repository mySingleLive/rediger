'use strict'

const Datastore = require('nedb')

export default class ConnectionStore {
  constructor () {
    this.db = new Datastore({
      filename: 'D:/.rediger/connection.db',
      autoload: true
    })
  }

  addConnection (cnn, callback) {
    this.db.insert(cnn, (err, ret) => {
      callback(err, ret)
    })
  }

  findAllConnections (callback) {
    this.db.find({})
      .sort({_id: -1})
      .exec((err, ret) => {
        callback(err, ret)
      })
  }
}
