'use strict'

const express = require('express')
const NodeRestClient = require('node-rest-client').Client
const bodyParser = require('body-parser')
const client = new NodeRestClient()

function proxy (req, res, next) {
  const realURI = req.headers['x-real-uri']
  if (!realURI) {
    res.status(401)
    return next()
  }
  const method = req.method.toLowerCase()
  const args = {
    headers: { 'Content-Type': req.headers['content-type'] },
    data: req.body.toString()
  }
  const startTime = Date.now()
  client[method](realURI, args, (data, response = {}) => {
    const endTime = Date.now()
    if (response.headers['content-type'] && response.headers['content-type'].indexOf('json') !== -1) {
      res.status(response.statusCode).json(data)
    } else {
      res.status(response.statusCode).send(data.toString())
    }
    console.log(`Proxied ${method} to ${realURI}, response code , ${response.statusCode} time: ${endTime - startTime}ms`)
  }).on('error', (err) => {
    res.status(500).send(err.toString())
  })
}

function start (port) {
  const server = express()
  server.use(express.static('./frontend'))
  server.use(bodyParser.raw({ type: '*/*' }))
  server.use('/proxy', proxy)

  server.listen(port, () => {
    console.log(`Server listening on port ${port}`)
  })
}

module.exports = {
  start: start
}
