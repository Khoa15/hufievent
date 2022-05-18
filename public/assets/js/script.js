const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
const socket = io();


const btnJoin = $('#btn-join');
const btnCreRoom = $('#btn-create-room');
const btnOpenGame = $('#btn-next-step');
const btnStartGame = $("#btn-start-game");
const idRoom = $('#id-room');
const username = $('#username');
const button = $$('button');
const gameView = $('.game');
const boardScore = $('[view="rank"]');
let roomClient = {};
const Client = [{
    roomClient: {},
    setting: {}
}]
const toggleFormData = (status=1) => {
    let sts = (status) ? 'unset' : 'none';
    $('form#form-data').style.display = sts;
}

const toggleLoadingBar = (status=1) => {
    let sts = (status) ? 'unset' : 'none';
    $('div.loading-bar').style.display = sts;
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
        $('[step="2"]').style.display = 'unset';
        $('h1.id-room').innerHTML = 'Thành công';
        toggleLoadingBar(0);
        roomClient = res;
    })
})

$('form[step="2"]').addEventListener('submit', (e)=>{
    e.preventDefault();
    btnOpenGame.click();// open or join room
})
let ele = {}
btnOpenGame.addEventListener('click', (e)=>{
    e.preventDefault()
    let username = $('#username');
    let field = $$(`#box-setting input, select`);
    if(username.value==false){
        username.style.border = '0.5px solid red';
        return false;
    }
    ele['username'] = username.value;
    for(let setting of field){
        if(setting.type == 'checkbox'){
            ele[setting.name] = setting.checked;
            continue;
        }
        ele[setting.name] = setting.value;
    }
    username.style.border = '0.5px solid black';
    socket.emit('openGame', {_i: roomClient._i, formData: ele});
    socket.emit('setName', ({username: username.value, _index: roomClient._i}));
    $("div.form").style.display = 'none';
    $('.queue-room').classList.remove('hide');
    if(socket.id === roomClient.player[0].id){
        $('.room-status').classList.remove('hide');
    }else{
        $('.room-status').innerHTML = "";
    }
    $('.room-footer #room-name').innerHTML = roomClient.name;
    $('#limit-user').innerHTML = roomClient.setting.players
})

btnCreRoom.addEventListener('click', ()=>{
    socket.emit('createRoom');
    toggleFormData(0);
    toggleLoadingBar();
    socket.on('roomName', (room)=>{
        $('#next-step').style.display = 'unset';
        $('h1.id-room').innerHTML = `${room.name}`;
        toggleLoadingBar(0);
        socket.emit('joinRoom', room.name);
        socket.on('resJoinRoom', (res)=>{
            roomClient = res;
            Client.masterRoom = true;
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
    $('#list-user-queue').innerHTML = "";
    lists.forEach(user => (user === null) ? false : $("#list-user-queue").appendChild(addNode(user.name)));
}

btnStartGame.addEventListener('click', ()=>{
    socket.emit('startGame', roomClient.name);
})

socket.on('startGame', ()=>{
    $('#queue').style.display = 'none';
    const mainLoading = $('#main-loading');
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
    const html_question = $('.title-question');
    const html_answer = $('#list-answer');
    const questions = roomClient.questions[round];
    const boxAns = $$('#ans');
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
    sound_end_game()
    gameView.classList.add('hide');
    boardScore.classList.remove('hide');
    const rank_player = roomClient.player.sort((a, b)=> b.score - a.score);
    let view = $('.viewRank');
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
})

$('#setting').addEventListener('click', function(){
    $('#box-setting').classList.remove('hide')
    $('#box-setting').style.overflow = 'auto'
    let h = 1;
    let id = setInterval(()=>{
        if(h >= 317){
            clearInterval(id)
        }
        h+=5;
        $('#box-setting').style.height = h + 'px'
    }, 5)
})

// Sound effect
const path_sound = './assets/sounds/'
const sounds = {
    queue: `${path_sound}room_queue_2.mp3`,
    startGame: `${path_sound}room_queue_3_or_fighting.mp3`,
    endGame: `${path_sound}room_queue_2.mp3`
}
const context = new AudioContext()
let room_queue = new Howl({
    src: [sounds['queue']],
    loop: true
})
let room_started_game = new Howl({
    src: [sounds['startGame']],
    loop: true
})
let room_end_game = new Howl({
    src: [sounds['endGame']],
    loop: true
})
$('button#btn-next-step').addEventListener('click', function(){
    room_queue.play()
})

btnStartGame.addEventListener('click', ()=>{
    room_queue.stop()
    room_started_game.play()
})
function sound_end_game(){
    room_started_game.stop()
    room_end_game.play()
}
// ./End sound effefct