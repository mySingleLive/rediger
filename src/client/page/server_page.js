'use strict'

import Page from './page'

export default class ServerPage extends Page {
  constructor ({name, port, host, fullname}) {
    super({
      type: 'Server',
      title: name,
      fullname: fullname
    })
    this.name = name
    this.port = port
    this.host = host
  }
}
