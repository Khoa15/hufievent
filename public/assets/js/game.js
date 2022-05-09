class Room{
    constructor(){
        this.room = []
        this.length = 0
    }
    creatRoom(_id, playerId){
        if(this.room.find(room => (room !== undefined) ? room.name === _id : false) !== undefined) return false
        this.room[this.length] = {name: _id, player: [], total: 0}
        this.room[this.length].player[this.room[this.length].total] = {id: playerId}
        this.room[this.length].total++
        this.length++
        return true
    }
    joinRoom(id, playerId){
        const data = this.room
        const index = data.findIndex(room => (room !== undefined) ? room.name === id : false)
        if(index == -1) return false
        data[index].player = [...data[index].player, {id: playerId}]
        data[index].total++
        return true
    }
    findRoom(roomId){
        return this.room.findIndex(room => (room !== undefined) ? room.name === roomId : false)
    }
    createQuestion(roomId, questions){
        const data = this.room
        const index = this.findRoom(roomId)
        if(index == -1) return false
        data[index].questions = questions
        console.log(this.getInfo(roomId))
        return true
    }
    getOutRoom(playerId){
        const data = this.room
        if(data === undefined) return true
        const index = data.findIndex(room => (room !== undefined) ? room.player.find(player=>player.id===playerId) : false)
        if(index === -1) return false
        const iPlayer = data[index].player.findIndex(player => player.id===playerId)
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
    list(){
        return this.room
    }
}

const room = new Room()
if(!this.navigator){
    module.exports = room
}