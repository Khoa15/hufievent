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
        if(res === false){
            toggleFormData()
            toggleLoadingBar(0)
            return false
        }
        document.querySelector('[step="2"]').style.display = 'unset'
        document.querySelector('h1.id-room').innerHTML = 'Thành công'
        toggleLoadingBar(0)
        roomClient = res
        console.log(roomClient)
    })
})

btnCreRoom.addEventListener('click', ()=>{
    socket.emit('createRoom')
    toggleFormData(0)
    toggleLoadingBar()
    socket.on('roomName', (room)=>{
        document.querySelector('#next-step').style.display = 'unset'
        document.querySelector('h1.id-room').innerHTML = `${room.name}`
        toggleLoadingBar(0)
        socket.emit('joinRoom', room.name)
        socket.on('resJoinRoom', (res)=>{
            roomClient = res
            console.log(roomClient)
        })
    })
})

btnOpenGame.addEventListener('click', ()=>{
    let username = document.getElementById('username')
    if(username.value==false){
        username.style.border = '0.5px solid red'
        return false
    }
    username.style.border = '0.5px solid black'
    socket.emit('openGame', roomClient._i)
    socket.emit('setName', ({username: username.value, _index: roomClient._i}))
    document.querySelector("form.form").style.display = 'none'
    document.querySelector('.queue-room').classList.remove('hide')
    console.log(socket.id === roomClient.player[0].id)
    if(socket.id === roomClient.player[0].id){
        document.querySelector('.room-status').classList.remove('hide')
    }else{
        document.querySelector('.room-status').innerHTML = ""
    }
    document.querySelector('.room-footer #room-name').innerHTML = roomClient.name
})
socket.on('statusGame', (sts)=>{
    roomClient.status = sts
})
socket.on('updateState', (room)=>{
    roomClient = room
    console.log(roomClient, 123)
    if(roomClient.status === 1){
        showList(roomClient.player)
    }
})

function addNode(content, type=1){
    let node, name
    switch(type){
        case 1:
            node = document.createElement('p')
            name = document.createTextNode(content)
            node.appendChild(name)
        break;
        case 2:
            node = document.createElement(`<div class="box-answer"><div class="box-main" id="ans" index="0" onclick="checkAns(this)"><p class="title-answer">${content}</p></div></div>`)
        break;
    }
    
    return node
}

function showList(lists, type=1){
    switch(type){
        case 1:
            document.querySelector('#list-user-queue').innerHTML = ""
            lists.forEach(user => (user === null) ? false : document.querySelector("#list-user-queue").appendChild(addNode(user.name, type)));
        break;
        case 2:
            document.querySelector('#list-answers').innerHTML = ""
            lists.forEach(ans => document.querySelector('#list-answers').appendChild(addNode(ans, type)))
        break;
    }
}

document.querySelector('#btn-start-game').addEventListener('click', ()=>{
    socket.emit('startGame', roomClient.name)
})

socket.on('startGame', ()=>{
    document.querySelector('#queue').style.display = 'none'
    const mainLoading = document.querySelector('#main-loading')
    mainLoading.classList.remove('hide')
    let time = 4
    setTimeout(()=>{
        mainLoading.classList.add('hide')
        document.querySelector('.game').classList.remove('hide')
        gameStarted()
    }, time*1000)
})

function gameStarted(index=0){
    const html_question = document.querySelector('.title-question')
    const html_answer = document.querySelector('#list-answer')
    const questions = roomClient.questions[index]
    
    const boxAns = document.querySelectorAll('#ans')
    let i =0;
    boxAns.forEach(box => {
        ans.innerHTML = questions.a[i]
        i++
    })
}