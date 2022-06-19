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
    question:`<form onsubmit="save('q');return false" id="create-question">
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
                    <label for="published" class="col-6 center flex nowrap">
                        <input type="checkbox" name="published" id="published" value="1" checked>
                        <h4>Công khai</h4>
                    </label>
                </div>
                <input type="submit" hidden>
            </form>`
}
const modal = {
    head: {content:'', hide: 0},
    body: {content:'', hide: 0},
    foot: {content:'', hide: 1},
}
let question = {}
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
function create(type){
    toggleModal()
    type = selectType(type)

    modal.body.content = createHTML.question
    setDataModal(modal)
}

function view(_id, type){
    toggleModal()
    type = selectType(type)
    axios({
        method: 'get',
        url: `/api/${type}/${_id}`,
        headers:{
            Authorization: localStorage.getItem('access_token')
        }
    }).then(res => {
        question = res.data.result
        modal.head.content = question.q
        modal.body.content = html_question(question.q, question.qa, question.a)
        modal.foot.content = ''
        modal.foot.hide = 0

        setDataModal(modal)
    })
}

function deleteRow(_id, type){
    axios({
        method: 'delete',
        url: `/api/${type}`,
        headers:{
            Authorization: localStorage.getItem('access_token')
        },
        data:{
            id: _id   
        }
    }).then(res=>{
        console.log(res.data)
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

function save_question(qa){
    question.a[qa] = $(`label[for="a${qa+1}"] span`).html().substr(3).trim()
    question.qa = qa
    return question
}

function getFormQuestion(){
    var form = new FormData(document.getElementById('create-question'))
    var values = [...form.entries()]
    question.q = values[0][1]
    question.qa = Number(values[1][1]) - 1
    question.a = []
    for(let i = 2;i < values.length; i++) question.a.push(values[i][1])
    return question
}

function getFormUser(){

}

function save(type){
    switch(type){
        case 'q':
            data = getFormQuestion() 
            break;
        case 'u':
            data = getFormUser()
            break;
    }
    fetch(data, selectType(type))
    return false;
}

function fetch(data, type){
    axios({
        method: 'post',
        url: `/api/${type}`,
        headers:{
            Authorization: localStorage.getItem('access_token')
        },
        data: data,
    }).then(res=>{
        console.log(res.data)
    })
}