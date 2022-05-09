require('dotenv').config()
const express = require('express')
const http = require('http')
const app = express()
const server = http.createServer(app)
const { Server } = require('socket.io')
const io = new Server(server)
const port = process.env.PORT

app.use(express.static('public'))

app.set('views', './public')
app.set('view engine', 'ejs')
// app.get('/', (req, res)=>{
//     res.sendFile(__dirname + '/index.html')
// })

const homeRoute = require('./routes/homeRoute')

app.use('/', homeRoute)

io.on('connection', (socket)=>{
    console.log(`A user connected`)

    socket.on('joinRoom', (idRoom)=>{
        socket.join(idRoom)
    })

    socket.on('createRoom', ()=>{
        
    })

    socket.on('disconnect', ()=>{
        console.log(`User disconnected`)
    })
})

server.listen(port, ()=>{
    console.log(`Listenning on ${port}`)
})