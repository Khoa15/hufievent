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
})

$('form[step="2"]').addEventListener('submit', (e)=>{
    e.preventDefault();
    btnOpenGame.click();// open or join room
})
let ele = {}
btnOpenGame.addEventListener('click', (e)=>{
    e.preventDefault()
    let username = $('#username');
    if(Client.masterRoom === true){
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
    }
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
    if(Client.masterRoom === true) $('#limit-user').innerHTML = ('0'+ele['limit-players']).slice(-2);
})

btnCreRoom.addEventListener('click', ()=>{
    socket.emit('createRoom');
    toggleFormData(0);
    toggleLoadingBar();
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

function addNode(content){
    let node, name;
    node = document.createElement('p');
    name = document.createTextNode(content);
    node.appendChild(name);
    return node;
}

function showList(lists){
    $('#list-user-queue').innerHTML = "";
    lists.forEach(user => (user === null || user.name === undefined) ? false : $("#list-user-queue").appendChild(addNode(user.name)));
}

btnStartGame.addEventListener('click', ()=>{
    socket.emit('startGame', roomClient.name);
})

let timeStart = 0, choose = -1, round = 0, score = 0;
function gameStarted(time=roomClient.setting.time){
    if(round === roomClient.questions.length){
        endGame();
        return true;
    }
    togAnimation();
    console.log("Answer is: " + roomClient.questions[round].qa);
    choose = -1;
    const html_question = $('.title-question');
    const html_answer = $('#list-answer');
    const questions = roomClient.questions[round];
    const boxAns = $$('#ans');
    timeStart = new Date().getTime();
    html_question.innerHTML = `Câu ${round+1}: ${questions.q}`
    $('#timeline').style.animationDuration = time+'s'
    for (let i = 0; i < questions.a.length; i++) {
        boxAns[i].innerHTML = `${String.fromCharCode(i+65)}: ${questions.a[i]}`;
    }
    const timeOut = setTimeout(()=>{
        togAnimation();
        toggAns();
        saveAns(choose, score)
        // round++;
        // gameStarted();
    }, time*1000);
}
const checkAns = (e)=>{
    //if(choose !== -1) return false;
    score = Math.floor((10000/((new Date().getTime() - timeStart)+1)) * 1000) / 1000;
    choose = e.getAttribute('index');
    for(let ele of $$(".box-main")){
        console.log(ele)
        ele.classList.remove('active')
    }
    e.classList.add('active')
}
function togAnimation(){
    const running = $('#timeline').classList
    if(running.contains('run-process')){
        running.remove('run-process')
        return;
    }
    running.add('run-process')
}
function saveAns(checkAns, score){
    if(checkAns != roomClient.questions[round].qa) return false;
    const player = roomClient.player.find(player => player.id === socket.id);
    player.score += score;
    player.a[round] = {a:checkAns, q: round, qid: roomClient.questions[round]._id}
    console.log(player)
    socket.emit('savePlayer', ({_index:roomClient._i, players: roomClient.player}));
}

function toggAns(){
    const i_ans = roomClient.questions[round].qa
    if($(`#list-answers.show-answer`) == null){
        $(`.box-main[index="${i_ans}"]`).classList.add('answer', 'active');
        $(`#list-answers`).classList.add('show-answer');
        $('#next-round').classList.remove('hide')
        return;
    }
    $(`.box-main[index="${i_ans}"]`).classList.remove('answer', 'active');
    if(choose !== -1)$(`.box-main[index="${choose}"]`).classList.remove('active')
    $(`#list-answers`).classList.remove('show-answer');
    $('#next-round').classList.add('hide');
}

$("#next-round").addEventListener('click', ()=>{
    toggAns();
    round++;
    gameStarted();
})

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
        score.appendChild(createText(Math.floor(rank_player[i].score * 100)/100));
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
        tgNotify({sts:1, msg:`Copied the text: <b>${room}</b>`})
    })
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

// Socket
socket.on('startGame', ()=>{
    $('.main.container').classList.add('hide')
    const mainLoading = $('#main-loading');
    mainLoading.classList.remove('hide');
    let time = 4;
    setTimeout(()=>{
        mainLoading.classList.add('hide');
        gameView.classList.remove('hide');
        gameStarted();
    }, time*1000);
})
socket.on('resJoinRoom', (res)=>{
    if(res.sts === 0){
        tgNotify(res)
        toggleFormData();
        toggleLoadingBar(0);
        return false;
    }
    $('[step="2"]').style.display = 'unset';
    $('h1.id-room').innerHTML = res.name;
    toggleLoadingBar(0);
    roomClient = res;
})
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
        if(socket.id === roomClient.player[0].id) $('#total-user').innerHTML = (`0${roomClient.total}`).slice(-2)
    }
})
// ./End Socket

//show notification
function tgNotify(result){
    console.log(result)
    $('.notify').innerHTML = result.msg
    const noti = $('.notification').classList
    if(result.sts === 0){
        noti.add('bg-danger')
        noti.remove('bg-success')
    }else{
        noti.add('bg-success')
        noti.remove('bg-danger')
    }
    if(noti.contains('hide')){
        noti.remove('hide');
    }
    setTimeout(()=>{
        noti.add('hide')
    }, 2500)
    return;
}
//endshow notification