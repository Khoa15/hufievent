const socket = io()
const checkAns = (e)=>{
    const i = e.getAttribute('index')
    console.log(i)
}

const btnJoin = document.querySelector('#btn-join')
const btnCreRoom = document.querySelector('#btn-create-room')
const btnOpenGame = document.querySelector('#btn-next-step')
const idRoom = document.querySelector('#id-room')
const username = document.querySelector('#username')
const button = document.querySelectorAll('button')
// document.querySelector('button').addEventListener('click', ()=>{
//     button.forEach(element => {
//         element.disabled = true
//     });
// })

const toggleFormData = (status=1) => {
    let sts = (status) ? 'unset' : 'none'
    document.querySelector('div#form-data').style.display = sts
}

const toggleLoadingBar = (status=1) => {
    let sts = (status) ? 'unset' : 'none'
    document.querySelector('div.loading-bar').style.display = sts
}
let roomClient = {}
document.querySelector('form').addEventListener('submit', (e)=>{
    e.preventDefault()
    //console.log(room.joinRoom(10), room.list())
    toggleFormData(0)
    toggleLoadingBar()
    socket.emit('joinRoom', idRoom.value)
    socket.on('resJoinRoom', (res)=>{
        document.querySelector('[step="2"]').style.display = 'unset'
        document.querySelector('h1.id-room').innerHTML = 'Thành công'
        toggleLoadingBar(0)
        roomClient = res
        console.log(roomClient)
    })
    socket.on('joinFailed', ()=>{
        toggleFormData()
        toggleLoadingBar(0)
    })
})

btnCreRoom.addEventListener('click', ()=>{
    socket.emit('createRoom')
    toggleFormData(0)
    toggleLoadingBar()
    socket.on('roomName', (room)=>{
        document.querySelector('#next-step').style.display = 'unset'
        document.querySelector('h1.id-room').innerHTML = `${room}`
        toggleLoadingBar(0)
        console.log(room)
    })
})

btnOpenGame.addEventListener('click', ()=>{
    socket.emit('openGame', roomClient.name)
    console.log(roomClient)
})
socket.on('statusGame', (sts)=>{
    roomClient.status = sts
})