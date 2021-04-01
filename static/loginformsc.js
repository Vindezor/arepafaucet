const formulario = document.getElementById('formulario');
const inputs = document.querySelectorAll('#formulario input');

const campos = {
    email: false,
    password: false,
}

const validarFormulario = (e) => {
    switch(e.target.name){
        case 'valog_email':
            if(e.target.value.length == 0){
                document.getElementById('grup_email').classList.add('form_pos-incorrecto');
            }
            else{
                document.getElementById('grup_email').classList.remove('form_pos-incorrecto');
            }
        break;
        case 'valog_password':
            if(e.target.value.length == 0){
                document.getElementById('grup_password').classList.add('form_pos-incorrecto');
            }
            else{
                document.getElementById('grup_password').classList.remove('form_pos-incorrecto');
            }
        break;
    }
}

inputs.forEach((input) => {
    input.addEventListener('keyup', validarFormulario);
    input.addEventListener('blur', validarFormulario);
});

formulario.addEventListener('submit', (e) => {
    const terminos = document.getElementById('val_terminos');
    const emailvac = document.getElementById('valog_email');
    const passvac = document.getElementById('valog_password');
    if((emailvac.value.length > 0) && (passvac.value.length > 0) && terminos.checked){
        document.getElementById('grup_terminos').classList.remove('form_pos-incorrecto');
    }
    else{
        e.preventDefault();
        //email
        if(emailvac.value.length == 0){
            document.getElementById('grup_email').classList.add('form_pos-incorrecto');
        }
        else{
            document.getElementById('grup_email').classList.remove('form_pos-incorrecto');
        }
        //pass
        if(passvac.value.length == 0){
            document.getElementById('grup_password').classList.add('form_pos-incorrecto');
        }
        else{
            document.getElementById('grup_password').classList.remove('form_pos-incorrecto');
        }
        //humano
        if(terminos.checked == false){
            document.getElementById('grup_terminos').classList.add('form_pos-incorrecto');
        }
        else{
            document.getElementById('grup_terminos').classList.remove('form_pos-incorrecto');
        }

        document.getElementById('formulario_mensaje').classList.add('formulario_mensaje-activo');
        setTimeout(() => {
            document.getElementById('formulario_mensaje').classList.remove('formulario_mensaje-activo');
        }, 5000)
    }
})