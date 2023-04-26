document.querySelector('.active').classList.toggle("active")
switch(window.location.href.split('/')[3]){
    case '':
        document.getElementById("home").classList.toggle("active")
        break;
    case 'liste':
        document.getElementById('liste').classList.toggle("active")
        break;
    case 'lend':
        document.getElementById('liste').classList.toggle("active")
        break;
    case 'ich':
        document.getElementById('ich').classList.toggle("active")
        break;
}