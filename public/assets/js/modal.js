$('.modal').on('click', function(e){
    console.log(e.target.className)
    if(e.target.classList.contains("modal")){
        toggleModal()

    }
})

const html_question = (q='', qa, answers=[]) => `
            <form>
                <h3>${q}<button class="btn"><i class="bi bi-pencil-square"></i></button></h3>
                <div class="row">
                    <label for="a1" class="col-6 answer">
                        <input type="radio" id="a1" name="a" checked="${qa === 0}">
                        <span>1. ${answers[0]}</span>
                    </label>
                    <label for="a2" class="col-6 answer">
                        <input type="radio" id="a2" name="a" checked="${qa === 1}">
                        <span>2. ${answers[1]}</span>
                    </label>
                    <label for="a3" class="col-6 answer">
                        <input type="radio" id="a3" name="a" checked="${qa === 2}">
                        <span>3. ${answers[2]}</span>
                    </label>
                    <label for="a4" class="col-6 answer">
                        <input type="radio" id="a4" name="a" checked="${qa === 3}">
                        <span>4. ${answers[3]}</span>
                    </label>
                </div>
            </form>
`
const modal = {
    head: {content:'', hide: 0},
    body: {content:'', hide: 0},
    foot: {content:'', hide: 1},
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
function view(_id, type){
    toggleModal()
    type = selectType(type)
    axios({
        method: 'get',
        url: `/api/${type}/${_id}`,
        headers:{
            Authorization: 'Nope'
        }
    }).then(res => {
        const data = res.data.result
        modal.head.content = data.q
        modal.body.content = html_question(data.q, data.qa, data.a)
        modal.foot.content = ''
        modal.foot.hide = 0

        setDataModal(modal)
    })
}

function formModal(type){

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