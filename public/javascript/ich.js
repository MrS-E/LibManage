document.querySelector("#ich_"+window.location.href.split('/')[window.location.href.split('/').length-1].split('?')[0]).classList.remove("nav-link")
document.querySelector('#option_select').addEventListener('change',(e)=>{window.location.replace(e.target.value)})
document.querySelector('#option_select option[selected]').removeAttribute("selected")
document.querySelector('#op_'+window.location.href.split('/')[window.location.href.split('/').length-1].split('?')[0]).setAttribute("selected", true)