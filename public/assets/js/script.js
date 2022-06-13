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
let ime = -1;
const toggleFormData = (status=1) => {
    var form = $('form#form-data[step="1"]').classList
    console.log($('form#form-data[step="1"]'))
    if(form.contains('hide')){
        form.remove('hide')
        return false;
    }
    form.add('hide')
}

const toggleLoadingBar = (status=1) => {
    let sts = (status) ? 'flex' : 'none';
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
btnCreRoom.addEventListener('click', ()=>{
    socket.emit('createRoom');
    toggleFormData(0);
    toggleLoadingBar();
    $('#box-setting').classList.remove('hide')
    $('#box-setting').style.overflow = 'hidden'
    let h = 1;
    let id = setInterval(()=>{
        if(h >= 317){
            clearInterval(id)
        }
        h+=5;
        $('#box-setting').style.height = h + 'px'
    }, 5)
})

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
    $("div.triangle").style.display = 'none';
    $('.queue-room').classList.remove('hide');
    if(socket.id === roomClient.player[0].id){
        $('#status-info').classList.remove('hide');
    }else{
        $('#status-info').innerHTML = "";
    }
    $('.room-footer #room-name').innerHTML = roomClient.name;
    if(Client.masterRoom === true) $('#limit-user').innerHTML = ('0'+ele['limit-players']).slice(-2);
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
    socket.emit('startGame', roomClient._i);
})

let timeStart = 0, choose = -1, round = 0, score = 0;
function gameStarted(time=roomClient.setting.time){
    if(round === roomClient.questions.length){
        endGame();
        return true;
    }
    togAnimation();toggRank();
    choose = -1;
    console.log("Answer is: " + roomClient.questions[round].qa);
    const html_question = $('.title-question');
    const html_answer = $('#list-answer');
    const questions = roomClient.questions[round];
    const boxAns = $$('#ans');
    timeStart = new Date().getTime();
    html_question.innerHTML = `Câu ${round+1}: ${questions.q}`
    $('#timeline').style.animationDuration = time+'s'
    for (let i = 0; i < questions.a.length; i++) {
        boxAns[i].innerHTML = `${String.fromCharCode(i+65)}: ${questions.a[i]}`;
        $$('.box-main')[i].classList.remove('active')
    }
    const timeOut = setTimeout(()=>{
        togAnimation();
        saveAns(choose, score);
        if(roomClient.setting.stop === 0){
            round++;
            gameStarted();
        }else toggAns();
    }, time*1000);
}
const checkAns = (e)=>{
    score = Math.floor((10000/((new Date().getTime() - timeStart)+1)) * 1000) / 1000;
    choose = e.getAttribute('index');
    for(let ele of $$(".box-main")){
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
    const player = roomClient.player.find(player => player.id === socket.id);
    if(checkAns == roomClient.questions[round].qa) player.score += score;
    console.log(player.score)
    player.a[round] = Number(checkAns)
    socket.emit('setAnswer', ({_index: roomClient._i, _iplayer: ime, round: round, a: checkAns}))
}
function toggRank(){
    console.log($('#rank').classList)
    if($('#rank').classList.contains('hide') == false){
        $('#rank').classList.add('hide');
        return false;
    }
    $('#rank').classList.remove('hide')
    const answers = [0, 0, 0, 0], total = roomClient.player.length
    console.log(roomClient.player)
    roomClient.player.forEach(player => {
        if(player.a[round] == undefined) return;
        
        answers[Number(player.a[round])]++
    })
    for (let i = 0; i < answers.length; i++) {
        $(`.col-rank[index="${i}"] .val`).innerHTML = answers[i]
        $(`.col-rank[index="${i}"] .col`).style.height = Math.floor(answers[i] * 100 / total) + "%";
    }

}
function toggAns(){
    const i_ans = roomClient.questions[round].qa
    if($(`#list-answers.show-answer`) == null){
        $(`.box-main[index="${i_ans}"]`).classList.add('answer', 'active');
        $(`#list-answers`).classList.add('show-answer');
        if(Client.masterRoom === true)$('#next-round').classList.remove('hide')
        return;
    }
    $(`.box-main[index="${i_ans}"]`).classList.remove('answer', 'active');
    if(choose !== -1)$(`.box-main[index="${choose}"]`).classList.remove('active');
    $(`#list-answers`).classList.remove('show-answer');
    if(Client.masterRoom === true)$('#next-round').classList.add('hide');
}

$("#next-round").addEventListener('click', ()=>{
    socket.emit('nextRound', roomClient._i)
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
    $('.control-panel').classList.remove('hide')
    const rank_player = roomClient.player.sort((a, b)=> b.score - a.score);
    let view = $('.viewRank');
    view.innerHTML = "";
    var color = ["red", "orange", "green", "#eee"];
    for (let i = 0; i < rank_player.length; i++) {
        const tr = createEle('tr');
        // const rank = createEle('td');
        const name = createEle('td');
        const score = createEle('td');
        // rank.appendChild(createText(i+1));
        name.classList.add('text-left');
        name.appendChild(createText(rank_player[i].name));
        score.appendChild(createText(Math.floor(rank_player[i].score * 100)/100));

        tr.style.background = color[(i < 3 && (rank_player[i].score) != 0) ? i : 3];
        // tr.appendChild(rank);
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
    loop: true,
    volume: vol
})
let room_started_game = new Howl({
    src: [sounds['startGame']],
    loop: true,
    volume: vol
})
let room_end_game = new Howl({
    src: [sounds['endGame']],
    loop: true,
    volume: vol
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

// volume
const btn_vol = $('#volume input').classList;
var vol = 0.7;
window.addEventListener('click', function(e){
    const isbtn_vol = e.target.type == 'range' || (e.target.tagName === 'DIV' && e.target.getAttribute('id') === 'volume') || e.target.tagName === 'rect' || e.target.tagName === 'path';
    if(btn_vol.contains('hide') === false && isbtn_vol === false){
        btn_vol.add('hide')
    }
})
$('svg').addEventListener('click', ()=>{
    if(btn_vol.contains('hide')){
        btn_vol.remove('hide')
        return;
    }
    $('#volume input').classList.add('hide')
})
$('#volume input').addEventListener('change', function(e){
    Howler.volume(e.target.value/10)
})
// ./ end volume
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
socket.on('nextRound', (res)=>{
    console.log('Here')
    if(roomClient.setting.stop === 0) return;
    toggAns();
    round++;
    gameStarted();
})
socket.on('resJoinRoom', (res)=>{
    if(res.sts === 0){
        tgNotify(res)
        toggleFormData();
        toggleLoadingBar(0);
        return false;
    }
    $('[step="2"]').classList.remove('hide')
    $('h1.id-room').innerHTML = res.name;
    toggleLoadingBar(0);
    roomClient = res;
    if(ime === -1)ime = res.player.length - 1;
})
socket.on('roomName', (room)=>{
    $('#next-step').classList.remove('hide')
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
socket.on('updateRank', (player)=>{
    roomClient.player = player;
    toggRank();
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

// document.addEventListener('visibilitychange', function() {
//     document.hidden;
// });

$('#back-form').addEventListener('click', ()=>{
    toggleFormData()
    $('form#next-step[step="2"]').classList.add('hide')
    $('#box-setting').classList.add('hide')
    $('#box-setting').style.overflow = 'unset'
})

$('#btn-play-again').addEventListener('click', ()=>{
    socket.emit('resetGame', (roomClient._i));
    $('[view="rank"]').classList.add('hide')
    $('.main.container').classList.remove('hide')
    $('.queue-room').classList.add('hide')
    $('.triangle').style.display = 'flex'
    $('.control-panel').classList.add('hide')
})