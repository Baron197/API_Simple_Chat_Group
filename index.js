const express = require('express')
const http = require('http')
const socketIO = require('socket.io')
const bodyParser = require('body-parser')
const cors = require('cors')

const port = process.env.PORT || 3002

const app = express()
app.use(bodyParser.json())
app.use(cors())
const server = http.createServer(app)
const io = socketIO(server)

var arrMsg = []
var userCount = 0

app.io = io
app.arrMsg = arrMsg

app.get('/', (req,res) => {
    res.status(200).send('<h1>Selamat datang di API Socket.IO</h1>')
})

const { chatRouter } = require('./routers')

app.use('/chat', chatRouter)

io.on('connection', socket => {
  console.log('User connected')
  userCount+=1;
  io.emit('user connected', userCount)
  
  socket.on('disconnect', () => {
    console.log('user disconnected')
    userCount--;
    io.emit('user connected', userCount)
  })
})

server.listen(port, () => console.log(`Listening on port ${port}`))