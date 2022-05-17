class Room{
    constructor(){
        this.room = []
        this.length = 0
    }
    createRoom(_id, playerId){
        if(this.room.find(room => (room !== undefined) ? room.name === _id : false) !== undefined) return false
        this.room[this.length] = {name: _id, player: [], total: 0}
        //this.room[this.length].player[this.room[this.length].total] = {id: playerId}
        this.room[this.length].status = 0
        this.room[this.length]._i = this.length
        this.length++
        return true
    }
    joinRoom(id, playerId, permit=1){
        const data = this.room
        const index = data.findIndex(room => (room !== undefined) ? room.name === id : false)
        if(index == -1) return false
        data[index].player = [...data[index].player, {id: playerId, score: 0, a:[], permit: permit}]
        data[index].total++
        return true
    }
    findRoom(roomId){
        return this.room.findIndex(room => (room !== undefined) ? room.name === roomId : false)
    }
    findPlayer(room, playerId){
        return (room === undefined) ? false : room.player.findIndex(player => (player === undefined) ? false : player.id === playerId)
    }
    createQuestion(_index, questions){
        const data = this.room[_index]
        if(data === undefined) return false
        data.questions = questions
        return true
    }
    getOutRoom(playerId){
        const data = this.room
        if(data === undefined) return true
        const index = data.findIndex(room => (room !== undefined) ? room.player.find(player=> (player.id !== undefined) ? player.id===playerId : false) : false)
        if(index === -1) return false
        const iPlayer = this.findPlayer(data[index], playerId)
        data[index].total--
        delete data[index].player[iPlayer]
        if(data[index].total === 0){
            delete data[index]
            return true
        }
        return data[index].name
    }
    getInfo(roomId){
        return this.room.find(room => (room !== undefined) ? room.name===roomId : false)
    }
    setStatus(_index, status=1){
        const data = this.room
        data[_index].status = status
        return true
    }
    setName(playerId, username, _index){
        const room = this.room[_index]
        const iPlayer = this.findPlayer(room, playerId)
        if(iPlayer === false) return false
        const player = room.player[iPlayer]
        player.name = username
        return true
    }
    startRoom(roomId){
        this.getInfo(roomId).status = 2
    }
    list(){
        return this.room
    }
}

const room = new Room()
if(!this.navigator){
    module.exports = room
}