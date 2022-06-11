class Room{
    constructor(){
        this.room = []
        this.length = 0
        this.valRoom = (name) =>{ return {name: name, player: [], ime: -1, total: 0, setting: {topic: -1, players: 10, questions: 5, time: 10, stop: 0}}}
    }
    createRoom(_id, playerId){
        if(this.room.find(room => (room !== undefined) ? room.name === _id : false) !== undefined) return false
        this.room[this.length] = this.valRoom(_id)
        //this.room[this.length].player[this.room[this.length].total] = {id: playerId}
        this.room[this.length].status = 0
        this.room[this.length]._i = this.length
        this.length++
        return true
    }
    joinRoom(id, playerId, permit=1){
        const data = this.room
        const index = data.findIndex(room => (room !== undefined) ? room.name === id : false)
        if(index == -1 || data[index].setting.players === data[index].total || data[index].status == 1) return this.message({msg:"Phòng không tồn tại hoặc đã không còn chỗ trống"})
        data[index].player = [...data[index].player, {id: playerId, score: 0, a:[], permit: permit}]
        data[index].total++
        return this.message({sts:1})
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
    setRoom(_index, setting){
        const data = this.room[_index]
        if(data === undefined) return false
        data.setting = {
            topic: Number(setting['topic']),
            questions: Number(setting['limit-questions']),
            players: Number(setting['limit-players']),
            time: Number(setting['limit-time']),
            stop: Number(setting['stop']),
        }
        return true;
    }
    getOutRoom(playerId){
        const data = this.room
        if(data === undefined) return true
        const index = data.findIndex(room => (room !== undefined) ? room.player.find(player=> (player !== undefined) ? player.id===playerId : false) : false)
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
        const data = this.room[_index]
        if(data === undefined) return false;
        data.status = status
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
    resetRoom(_index, name){
        const data = this.room[_index]
        if(data === undefined) return false;
        data = this.valRoom(name)
        return data
    }
    list(){
        return this.room
    }
    message({msg, sts=0}){
        return {sts: sts, msg: msg};
    }
    virtualBot(length=10){
        var name = [
            "Albania", "Algeria", "Andorra", "Angola", "Anguilla", "Antarctica", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Bermuda", "Bhutan", "Botswana", "Brazil", "Bulgaria", "Burundi", "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Colombia", "Costa Rica", "Croatia", "Curaçao", "Cyprus", "Czechia", "Denmark", "Djibouti", "Dominica", "Ecuador", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Finland", "France", "Georgia", "Germany", "Gibraltar", "Greece", "Greenland", "Grenada", "Guadeloupe", "Guatemala", "Guernsey", "Guinea", "Guyana", "Honduras", "Hong Kong", "Hungary", "Iceland", "Indonesia", "Ireland", "Israel", "Jamaica", "Jersey", "Jordan", "Kazakhstan", "Kiribati", "Kuwait", "Kyrgyzstan", "Latvia", "Lebanon", "Lesotho", "Liberia", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Martinique", "Mauritania", "Mauritius", "Mayotte", "Mexico", "Monaco", "Mongolia", "Montenegro", "Montserrat", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nicaragua", "Nigeria", "Norway", "Pakistan", "Panama", "Paraguay", "Pitcairn", "Poland", "Portugal", "Romania", "Rwanda", "Réunion", "San Marino", "Senegal", "Serbia", "Seychelles", "Singapore", "Slovakia", "Slovenia", "Somalia", "Sri Lanka", "Suriname", "Sweden", "Taiwan", "Tajikistan", "Thailand", "Tokelau", "Tunisia", "Turkey", "Tuvalu", "Uganda", "Ukraine", "Uruguay", "Uzbekistan", "Vanuatu", "Viet Nam", "Zambia", "Zimbabwe"
        ]
        var index_room = this.length - 1
        const data = this.room[index_room]
        for(let i = 0; i < length; i++){
            //this.joinRoom("MYBOTISRUNNING", i, !i)
            data.player = [...data.player, {id: i, score: 0, a:[], permit: -1}]
            data.total++
            this.setName(i, name[Math.floor(Math.random() * name.length)], index_room)
        }
        return 1
    }
}

const room = new Room()
if(!this.navigator){
    module.exports = room
}