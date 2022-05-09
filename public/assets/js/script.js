class Room{
    constructor(){
        this.room = {}
        this.length = 0
    }
    creatRoom(id){
        this.room[this.length] = id
        this.length++
    }
    joinRoom(id){
        const data = this.room
        return Object.values(data).includes(id)
    }

    list(){
        return this.room
    }
}
const socket = io()

const checkAns = (e)=>{
    const i = e.getAttribute('index')
    console.log(i)
}

const room = new Room()
room.creatRoom(10)

const btnJoin = document.querySelector('#btn-join')
const btnCreRoom = document.querySelector('#btn-create-room')
const idRoom = document.querySelector('#id-room')
const button = document.querySelector('button')
button.addEventListener('click', ()=>{
    const btn = document.getElementsByTagName('button')
    btn.foreach(b=> b.style.display='none')
    // button.disabled = 'true'
    // setTimeout(()=>{
    //     button.disabled = 'false'
    // }, 1500)
})

document.querySelector('form').addEventListener('submit', (e)=>{
    e.preventDefault()
    console.log(room.joinRoom(10), room.list())
    socket.emit('joinRoom', idRoom.value)
})

btnCreRoom.addEventListener('click', ()=>{
    console.log('Loading...')
})