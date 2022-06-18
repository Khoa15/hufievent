$('.modal').on('click', function(e){
    console.log(e.target.className)
    if(e.target.classList.contains("modal")){
        toggleModal()

    }
})

function view(_id, type){

    switch(type){
        case 'q':

            toggleModal()
            break;
    }
}

function fetchData(data=[],Authorization='',method='get', model='user'){
    axios({
        method: 'get',
        url: '/api/user',
        headers:{
            Authorization: Authorization
        },
        data: data,
    }).then(res=>{
        return res.result
    })
}

function toggleModal(e){
    $('.modal').toggle('hide')
}