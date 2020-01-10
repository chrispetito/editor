const express = require('express')
const cors = require('cors')
const helmet = require('helmet')

const server = express()

const notesRouter = require('../notes/notes-router')

server.use(helmet())
server.use(cors())
server.use(express.json())

server.use('/api/notes', notesRouter)

server.get('/', (req, res) => {
    res.send('editor test')
})

module.exports = server