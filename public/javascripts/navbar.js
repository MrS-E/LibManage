document.querySelector('.active').classList.toggle("active")
switch(window.location.href.split('/')[3]){
    case 'home':
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
    case 'admin':
        document.getElementById('admin').classList.toggle("active")
        break;
}