require('dotenv').config()
const express = require('express')
const http = require('http')
const db = require('./config/connect')
const game = require('./public/assets/js/game')
const cors = require('cors')
const app = express()
const fetch = require('node-fetch')
const server = http.createServer(app)
const { Server } = require('socket.io')
const io = new Server(server)
const port = process.env.PORT || 5050

db.connect()
app.use(cors({
    origin: process.env.SERVER
}))
app.use(express.static('public'))

app.set('views', './public')
app.set('view engine', 'ejs')

const homeRoute = require('./routes/homeRoute')
const dataRoute = require('./routes/dataRoute')

app.use('/', homeRoute)
app.use('/api/data', dataRoute)
io.on('connection', (socket)=>{
    console.log(`A user connected`)
    socket.on('joinRoom', (name)=>{
        const result = game.joinRoom(name, socket.id)
        if(result.sts){
            socket.join(name)
            io.to(name).emit('resJoinRoom', game.room[game.findRoom(name)])
        }else{
            socket.emit('resJoinRoom', result)
        }
    })
    
    socket.on('setName', ({username, _index})=>{
        if(game.setName(socket.id, username, _index))
        io.to(game.room[_index].name).emit('updateState', game.room[_index])
    })
    
    socket.on('savePlayer', ({_index, players})=>{
        game.room[_index].player = players
        io.to(game.room[_index].name).emit('updateState', game.room[_index])
    })
    
    socket.on('openGame', ({_i, formData})=>{
        if(game.room[_i] === undefined) return false;
        if(formData.username !== undefined){
            fetch(`${process.env.SERVER}/api/data/?limit=${formData['limit-questions']}&topic=${formData['topic']}`,{method: 'get'}).then(response => response.json()).then(data =>{
                game.setRoom(_i, formData)
                game.createQuestion(_i, data.data)
                if(game.virtualBot(3)){
                    io.to(game.room[_i].name).emit('updateState', game.room[_i])
                }
            })
        }
    })
    socket.on('setAnswer', ({_index, _iplayer, round, a})=>{
        game.room[_index].player[_iplayer].a[round] = Number(a);
        for(let i = _iplayer+1; i < game.room[_index].player.length; i++){
            a = Number(Math.floor(Math.random() * 4))
            game.room[_index].player[i].a[round] = a;
            if(game.room[_index].questions[round].qa == a) game.room[_index].player[i].score += Math.random();
        }
        io.to(game.room[_index].name).emit('updateRank', game.room[_index].player)
    })

    socket.on('startGame', (_index)=>{
        game.setStatus(_index, 2)
        io.to(game.room[_index].name).emit('startGame')
        io.to(game.room[_index].name).emit('statusGame', 2)
    })

    socket.on('nextRound', (_i)=>{
        io.to(game.room[_i].name).emit('nextRound')
    })

    socket.on('createRoom',  ()=>{
        const createRoom = () => {
            let name = makeRoom()
            if(game.createRoom(name, socket.id)){
                socket.join(name)
                io.to(name).emit('roomName', game.getInfo(name))
                return name
            }
            createRoom()
        }
        createRoom()
    })

    socket.on('resetGame', (_index)=>{
        delete game.room[_index];
    })

    socket.on('disconnect', ()=>{
        const idRoom = game.getOutRoom(socket.id)
        const data = game.getInfo(idRoom)
        io.to(idRoom).emit('updateState', data)
    })
})

server.listen(port, ()=>{
    console.log(`Listenning on ${port}`)
})

function makeRoom(){
    const length = Math.floor((Math.random() + 3) + 2)
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