const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
const socket = io();


const btnJoin = document.querySelector('#btn-join');
const btnCreRoom = document.querySelector('#btn-create-room');
const btnOpenGame = document.querySelector('#btn-next-step');
const idRoom = document.querySelector('#id-room');
const username = document.querySelector('#username');
const button = document.querySelectorAll('button');
const gameView = document.querySelector('.game');
const boardScore = document.querySelector('[view="rank"]');
let roomClient = {};

const toggleFormData = (status=1) => {
    let sts = (status) ? 'unset' : 'none';
    document.querySelector('form#form-data').style.display = sts;
}

const toggleLoadingBar = (status=1) => {
    let sts = (status) ? 'unset' : 'none';
    document.querySelector('div.loading-bar').style.display = sts;
}
$('form#form-data[step="1"]').addEventListener('submit', (e)=>{
    e.preventDefault();
    toggleFormData(0);
    toggleLoadingBar();
    socket.emit('joinRoom', idRoom.value);
    socket.on('resJoinRoom', (res)=>{
        if(res === false){
            toggleFormData();
            toggleLoadingBar(0);
            return false;
        }
        document.querySelector('[step="2"]').style.display = 'unset';
        document.querySelector('h1.id-room').innerHTML = 'Thành công';
        toggleLoadingBar(0);
        roomClient = res;
    })
})

$('form[step="2"]').addEventListener('submit', (e)=>{
    e.preventDefault();
    btnOpenGame.click();// open or join room
})

btnOpenGame.addEventListener('click', ()=>{
    let username = document.getElementById('username');
    if(username.value==false){
        username.style.border = '0.5px solid red';
        return false;
    }
    username.style.border = '0.5px solid black';
    socket.emit('openGame', roomClient._i);
    socket.emit('setName', ({username: username.value, _index: roomClient._i}));
    document.querySelector("div.form").style.display = 'none';
    document.querySelector('.queue-room').classList.remove('hide');
    if(socket.id === roomClient.player[0].id){
        document.querySelector('.room-status').classList.remove('hide');
    }else{
        document.querySelector('.room-status').innerHTML = "";
    }
    document.querySelector('.room-footer #room-name').innerHTML = roomClient.name;
})

btnCreRoom.addEventListener('click', ()=>{
    socket.emit('createRoom');
    toggleFormData(0);
    toggleLoadingBar();
    socket.on('roomName', (room)=>{
        document.querySelector('#next-step').style.display = 'unset';
        document.querySelector('h1.id-room').innerHTML = `${room.name}`;
        toggleLoadingBar(0);
        socket.emit('joinRoom', room.name);
        socket.on('resJoinRoom', (res)=>{
            roomClient = res;
        })
    })
})

socket.on('statusGame', (sts)=>{
    roomClient.status = sts;
})
socket.on('updateState', (room)=>{
    if(room.player[0] === null){
        window.location.reload()
    }
    roomClient = room;
    if(roomClient.status === 1){
        showList(roomClient.player);
        if(socket.id === roomClient.player[0].id) $('#total-user').innerHTML = (roomClient.total < 10) ? `0${roomClient.total}` : roomClient.total
    }
})

function addNode(content){
    let node, name;
    node = document.createElement('p');
    name = document.createTextNode(content);
    node.appendChild(name);
    
    return node;
}

function showList(lists){
    document.querySelector('#list-user-queue').innerHTML = "";
    lists.forEach(user => (user === null) ? false : document.querySelector("#list-user-queue").appendChild(addNode(user.name)));
}

document.querySelector('#btn-start-game').addEventListener('click', ()=>{
    socket.emit('startGame', roomClient.name);
})

socket.on('startGame', ()=>{
    document.querySelector('#queue').style.display = 'none';
    const mainLoading = document.querySelector('#main-loading');
    mainLoading.classList.remove('hide');
    let time = 4;
    setTimeout(()=>{
        mainLoading.classList.add('hide');
        gameView.classList.remove('hide');
        gameStarted();
    }, time*1000);
})
let timeStart = 0, choose = -1, round = 0;
function gameStarted(time=8){
    if(round === roomClient.questions.length){
        endGame();
        return true;
    }
    console.log("Aswer is: " + roomClient.questions[round].qa);
    choose = -1;
    const html_question = document.querySelector('.title-question');
    const html_answer = document.querySelector('#list-answer');
    const questions = roomClient.questions[round];
    const boxAns = document.querySelectorAll('#ans');
    timeStart = new Date().getTime();
    html_question.innerHTML = `Câu ${round+1}: ${questions.q}`
    for (let i = 0; i < questions.a.length; i++) {
        boxAns[i].innerHTML = questions.a[i];
    }
    setTimeout(()=>{
        round++;
        gameStarted();
    }, time*1000);
}
const checkAns = (e)=>{
    if(choose !== -1) return false;
    const score = Math.floor((10000/((new Date().getTime() - timeStart)+1)) * 1000) / 1000;
    choose = e.getAttribute('index');
    saveAns(choose, score);
}
function saveAns(checkAns, score){
    if(checkAns != roomClient.questions[round].qa) return false;
    const player = roomClient.player.find(player => player.id === socket.id);
    player.score += score;
    player.a = [...player.a, {a:checkAns, q: round}];
    socket.emit('savePlayer', ({_index:roomClient._i, players: roomClient.player}));
}

function createEle(ele){
    return document.createElement(ele);
}

function createText(text){
    return document.createTextNode(text);
}

function endGame(){
    gameView.classList.add('hide');
    boardScore.classList.remove('hide');
    const rank_player = roomClient.player.sort((a, b)=> b.score - a.score);
    let view = document.querySelector('.viewRank');
    view.innerHTML = "";
    for (let i = 0; i < rank_player.length; i++) {
        const tr = createEle('tr');
        const rank = createEle('td');
        const name = createEle('td');
        const score = createEle('td');
        rank.appendChild(createText(i+1));
        name.classList.add('text-left');
        name.appendChild(createText(rank_player[i].name));
        score.appendChild(createText(rank_player[i].score));
        tr.appendChild(rank);
        tr.appendChild(name);
        tr.appendChild(score);
        view.appendChild(tr);
    }
}

$$(`[room-name]`).forEach(element => {
    element.addEventListener('click', ()=>{
        const room = element.innerHTML
    
        navigator.clipboard.writeText(room)
    
        console.log('Copied the text: ' + room)
    })
});