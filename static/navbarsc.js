document.addEventListener("DOMContentLoaded", function (){
    switch(window.location.pathname){
        case "/":
            document.getElementById('home').classList.add('active');
        break;
        case "/about":
            document.getElementById('about').classList.add('active');
        break;
        case "/login":
            document.getElementById('login').classList.add('active');
        break;
        case "/signup":
            document.getElementById('signup').classList.add('active');
        break;
        case "/profile":
            document.getElementById('profile').classList.add('active');
        break;
        case "/edit_profile":
            document.getElementById('profile').classList.add('active');
        break;
    }
})