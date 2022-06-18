$('[type-model="modal"]').on('click', function(e){
    console.log('Clicked')
    toggleModal(this.attr('target'))
})

function toggleModal(e){
    const modal = $('.modal').classList
    if(modal.contain('hide')){
        modal.remove('hide')
        return false;
    }
    modal.add('hide')
}

window.addEventListener('click', function(e){
    if(e.target.className === "modal"){
        e.target.classList.add('hide')
    }
})