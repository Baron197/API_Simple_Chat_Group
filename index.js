const express = require('express')
const http = require('http')
const socketIO = require('socket.io')
const bodyParser = require('body-parser')
const cors = require('cors')

const port = process.env.PORT || 1997

const app = express()
app.use(bodyParser.json())
app.use(cors())
const server = http.createServer(app)
const io = socketIO(server)

var arrMsg = []
var userCount = 0

app.get('/', (req,res) => {
    res.status(200).send('<h1>Selamat datang di API Socket.IO</h1>')
})

app.get('/getmessages', (req,res) => {
    res.status(200).send(arrMsg)
})

app.post('/sendmessage',(req,res) => {
    arrMsg.push(req.body)
    io.emit('chat message', arrMsg)
    res.status(200).send({ message: 'Send Message Success'})
})

app.delete('/clearmessages', (req,res) => {
    arrMsg = []
    io.emit('chat message', arrMsg)
    res.status(200).send({ message: 'Clear Messages Success'})
})

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