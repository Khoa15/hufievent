const modal = {
    head: {content:'', hide: 0},
    body: {content:'', hide: 0},
    foot: {content:'', hide: 1},
}
let question = {}, tmp
var questions = []
let data = []
$('.modal').on('click', function(e){
    if(e.target.classList.contains("modal")){
        toggleModal()
    }
})

const html_question = (q='', qa, answers=[]) => `
            <form>
                <h3>
                    <span id="question-name">${q}</span>
                    <button class="btn" type="button"><i class="bi bi-pencil-square"></i></button>
                </h3>
                <div class="row">
                    <label for="a1" class="col-6 answer">
                        <input type="radio" id="a1" name="a" checked="${qa === 0}" onclick="save_question(0)">
                        <span>1. ${answers[0]}</span>
                    </label>
                    <label for="a2" class="col-6 answer">
                        <input type="radio" id="a2" name="a" checked="${qa === 1}" onclick="save_question(1)">
                        <span>2. ${answers[1]}</span>
                    </label>
                    <label for="a3" class="col-6 answer">
                        <input type="radio" id="a3" name="a" checked="${qa === 2}" onclick="save_question(2)">
                        <span>3. ${answers[2]}</span>
                    </label>
                    <label for="a4" class="col-6 answer">
                        <input type="radio" id="a4" name="a" checked="${qa === 3}" onclick="save_question(3)">
                        <span>4. ${answers[3]}</span>
                    </label>
                </div>
            </form>
`
const createHTML = {
    question:`<form onsubmit="process('q', 'save');return false" id="create-question">
                <input type="text" required placeholder="Nhập câu hỏi..." name="q">
                <div class="row">
                    <label for="a1" class="col-6 center  flex  nowrap">
                        <input type="radio" id="a1" name="qa" checked  value="1">
                        <input type="text" required placeholder="Nhập đáp án 1..." id="ia1" name="a">
                    </label>
                    <label for="a2" class="col-6 center  flex  nowrap" >
                        <input type="radio" id="a2" name="qa" value="2">
                        <input type="text" required placeholder="Nhập đáp án 2..." id="ia2" name="a">
                    </label>
                    <label for="a3" class="col-6 center  flex  nowrap" >
                        <input type="radio" id="a3" name="qa" value="3">
                        <input type="text" required placeholder="Nhập đáp án 3..." id="ia3" name="a">
                    </label>
                    <label for="a4" class="col-6 center  flex  nowrap" >
                        <input type="radio" id="a4" name="qa" value="4">
                        <input type="text" required placeholder="Nhập đáp án 4..." id="ia4" name="a">
                    </label>
                    <label for="topic" class="col-6 center flex nowrap">
                        <select>
                            <option></option>
                        </select>
                    </label>
                    <label for="published" class="col-6 center flex nowrap">
                        <input type="checkbox" name="published" id="published" value="1" checked>
                        <h4>Công khai</h4>
                    </label>
                </div>
                <input type="submit" hidden>
            </form>`
}
function selectType(type){
    switch(type){
        case 'q':
            type = 'question'
            break;
        case 'u':
            type = 'user'
            break;
    }
    return type
}
function create(model){
    toggleModal()
    modal.body.content = createHTML[model]
    setDataModal(modal)
}

async function view( model, _id){
    toggleModal()
    var res = await fetch(null, {_id: _id}, model, 'get')
    question = res.data.result
    modal.head.content = question.q
    modal.body.content = html_question(question.q, question.qa, question.a)
    modal.foot.content = ''
    modal.foot.hide = 0

    setDataModal(modal)
}

function deleteRow(model, _id){
    axios({
        method: 'delete',
        url: `/api/${model}`,
        headers:{
            Authorization: localStorage.getItem('access_token')
        },
        data:{
            id: _id   
        }
    }).then(res=>{
        return res.data
    })
}

function toggleModal(e){
    $('.modal').toggle('hide')
}

function setDataModal(data=modal){
    $('.modal-content .modal-head,.modal-body').html('')
    if(data.head.hide === 0) $('.modal-head').html(data.head.content)
    if(data.body.hide === 0) $('.modal-body').html(data.body.content)
    if(data.foot.hide === 0 && data.foot.content !== '') $('.modal-foot').html(data.foot.content)
}

// QUESTION.EJS
const getAllQuestions = async ()=>{
    res = await fetch(null, null, 'question', 'get')
    data = res.data.result
    pagi.init(data, 0, 10)
    changePage(0)
}
const printListQuestion = (questions) => {
    $('tbody').html('')
    questions.forEach(question => printQuestion(question));
}
const printQuestion = (question)=>{
    $('tbody').append(`
            <tr key="${question.id}">
                <td>${question._id}</td>
                <td>${question.q}</td>
                <td>
                    ${question.topic}
                </td>
                <td>
                    <button class="btn btn-rounded btn-outlined bg-success" onclick="process('q', 'view', '${question._id}')">
                        <i class="bi bi-info"></i>
                    </button>
                    <button class="btn ${question.published === 0 ? '' :'btn-outlined'} btn-rounded  bg-warning" onclick="process('q', 'ban', '${question.id}')">
                        <i class="bi ${question.published === 0 ? '' :'bi-eye'} bi-eye-slash"></i>
                    </button>
                    <button class="btn btn-rounded btn-outlined bg-danger" onclick="process('q', 'delete', '${question._id}', '${question.id}')">
                        <i class="bi bi-trash3"></i>
                    </button>
                </td>
            </tr>
    `)
}
const changePage = (i) => {
    pagi.changePage(i)
    printListQuestion(pagi.dataPage())
    printPagination(pagi.makePagination())
}
const printPagination = (html)=>{
    $('tfoot tr td').html(html)
}



//QUERY

function getFormQuestion(){
    var form = new FormData(document.getElementById('create-question'))
    var values = [...form.entries()]
    question.q = values[0][1]
    question.qa = Number(values[1][1]) - 1
    question.a = []
    for(let i = 2;i < values.length-1; i++) question.a.push(values[i][1])
    return question
}

function getFormUser(){

}

function process(model, type, _id, key, method='get'){
    switch(model){
        case 'q':
            model = 'question'
            Question(type, method, _id, key)
            break;
        case 'u':
            model = 'user'

            break;
    }
    return false
}

async function Question(type, method, _id, key){
    switch(type){
        case 'list':
            getAllQuestions()
            break;
        case 'create':
            create('question')
            break;
        case 'view':
            view('question', _id)
            break;
        case 'save':
            var res = await fetch(getFormQuestion(), null, 'question')
            if(res.data.success && addElementToData(res.data.result)){
                pagi.init(data, pagi.page, pagi.limit)
                changePage(pagi.index())
            }
            break;
        case 'ban':
            tmp = data.findIndex(el => el.id == _id)
            if(data[tmp]){
                data[tmp].published = !data[tmp].published
                $(`tr[key="${_id}"] td button.bg-warning`).toggleClass('btn-outlined')
                $(`tr[key="${_id}"] td button i.bi-eye-slash`).toggleClass('bi-eye')
                fetch({id: key, published: data[tmp].published}, null, 'question', 'post')
            }
            break;
        case 'delete':
            var res = await fetch({_id: _id}, null, 'question', 'delete')
            if(res.data.success){
                $(`tr[key="${key}"]`).remove()
                if(removeElementFromData({id: key})){
                    pagi.init(data, pagi.page, pagi.limit)
                    changePage(pagi.index())
                }
            }
            break;
    }
}

async function User(type, method, _id){
    switch(type){
        case 'view':
            view('user', _id)
            break;
        case 'save':
            await fetch(getFormUser(), null, 'question')
            break;
        case 'delete':
            await fetch({_id: _id}, null, 'question', 'delete')
            break;
    }
}

function addElementToData(object){
    data.unshift(object)
    return true
}

function removeElementFromData(object){
    var index = data.findIndex(a=> a.id == object.id)
    if(data[index] === undefined) return false
    delete data[index]
    data = data.filter(el => el != null)
    return true
}

async function fetch(data, params, model, method="post"){
    var url = `/api/${model}/${(params !== null) ? params._id : ''}`
    return await axios({
        method: method,
        url: url,
        headers:{
            Authorization: localStorage.getItem('access_token')
        },
        data: data
    })
}