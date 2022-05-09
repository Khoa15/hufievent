require('dotenv').config()
const express = require('express')
const http = require('http')
const db = require('./config/connect')
const app = express()
const server = http.createServer(app)
const { Server } = require('socket.io')
const io = new Server(server)
const port = process.env.PORT
const game = require('./public/assets/js/game')

db.connect()

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
        if(game.joinRoom(idRoom, socket.id)){
            socket.join(idRoom)
            console.log(game.getInfo(idRoom))
            io.to(idRoom).emit('resJoinRoom', game.getInfo(idRoom))
        }
    })

    socket.on('createRoom', async()=>{
        const createRoom = () => {
            let name = makeRoom()
            if(game.creatRoom(name, socket.id)) return name
            createRoom()
        }
        const room = createRoom()
        socket.join(room)
        io.to(room).emit('roomName', room)
    })

    socket.on('disconnect', ()=>{
        console.log(game.getInfo(game.getOutRoom(socket.id)))
        console.log(`User disconnected`)
    })
})

server.listen(port, ()=>{
    console.log(`Listenning on ${port}`)
})

function makeRoom(){
    const length = Math.floor((Math.random() + 3) * 2)
    const char = 'abcdefghijklmnopqrstuvwxyz'
    const upChar = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const specialChar = ''
    let newString = ''
    for (let index = 0; index < length; index++) {
        var rd = Math.floor(Math.random() * 3)
        switch(rd){
            case 1:
                newString += upChar.charAt(Math.floor(Math.random() * upChar.length))
                break
            case 2:
                newString += specialChar.charAt(Math.floor(Math.random() * specialChar.length))
                break
            default:
                newString += char.charAt(Math.floor(Math.random() * char.length))
        }
    }

    return newString
}