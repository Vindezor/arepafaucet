const formulario = document.getElementById('formulario');
const inputs = document.querySelectorAll('#formulario input');

const expresiones = {
    correo: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9-._]+$/,
    password: /^.{4,12}$/
}

const campos = {
    email: false,
    password: false,
    confPassword: false
}

const validarFormulario = (e) => {
    switch(e.target.name){
        case 'val_email':
            validarCampo(expresiones.correo, e.target, 'email');
        break;
        case 'val_password':
            validarCampo(expresiones.password, e.target, 'password');
            if(document.getElementById('val_conf_password').value.length !== 0){
                validarConfPassword();
            }
        break;
        case 'val_conf_password':
            validarConfPassword();
        break;
    }
}

const validarCampo = (expresion, input, campo) => {
    if(expresion.test(input.value)){
        document.getElementById(`grup_${campo}`).classList.remove('form_pos-incorrecto');
        document.getElementById(`grup_${campo}`).classList.add('form_pos-correcto');
        document.querySelector(`#grup_${campo} i`).classList.remove('fa-times');
        document.querySelector(`#grup_${campo} i`).classList.add('fa-check');
        document.getElementById(`error_${campo}`).classList.remove('form_input_error-activo');
        campos[campo] = true;
    }
    else{
        document.getElementById(`grup_${campo}`).classList.remove('form_pos-correcto');
        document.getElementById(`grup_${campo}`).classList.add('form_pos-incorrecto');
        document.querySelector(`#grup_${campo} i`).classList.remove('fa-check');
        document.querySelector(`#grup_${campo} i`).classList.add('fa-times');
        document.getElementById(`error_${campo}`).classList.add('form_input_error-activo');
        campos[campo] = false;
    }
}

const validarConfPassword = () => {
    const inputPassword1 = document.getElementById('val_password');
    const inputPassword2 = document.getElementById('val_conf_password');

    if(inputPassword1.value !== inputPassword2.value){
        document.getElementById('grup_conf_password').classList.remove('form_pos-correcto');
        document.getElementById('grup_conf_password').classList.add('form_pos-incorrecto');
        document.querySelector('#grup_conf_password i').classList.remove('fa-check');
        document.querySelector('#grup_conf_password i').classList.add('fa-times');
        document.getElementById('error_conf_password').classList.add('form_input_error-activo');
        campos['confPassword'] = false;
    }
    else{
        document.getElementById('grup_conf_password').classList.remove('form_pos-incorrecto');
        document.getElementById('grup_conf_password').classList.add('form_pos-correcto');
        document.querySelector('#grup_conf_password i').classList.remove('fa-times');
        document.querySelector('#grup_conf_password i').classList.add('fa-check');
        document.getElementById('error_conf_password').classList.remove('form_input_error-activo');
        campos['confPassword'] = true;
    }
}

inputs.forEach((input) => {
    input.addEventListener('keyup', validarFormulario);
    input.addEventListener('blur', validarFormulario);
});

formulario.addEventListener('submit', (e) => {
    e.preventDefault();
    const terminos = document.getElementById('val_terminos');
    if(campos.email && campos.password && campos.confPassword && terminos.checked){
        formulario.reset();
        document.getElementById('grup_email').classList.remove('form_pos-correcto');
        document.getElementById('grup_password').classList.remove('form_pos-correcto');
        document.getElementById('grup_conf_password').classList.remove('form_pos-correcto');
        document.getElementById('formulario_exitoso').classList.add('formulario_exitoso-activo');
        document.getElementById('grup_terminos').classList.remove('form-check-label-error');
        document.getElementById('grup_terminos').classList.remove('form_check-incorrecto');
        setTimeout(() => {
            document.getElementById('formulario_exitoso').classList.remove('formulario_exitoso-activo');
        }, 3000)
    }
    else{
        if(terminos.checked == false){
            document.getElementById('grup_terminos').classList.add('form-check-label-error');
            document.getElementById('grup_terminos').classList.add('form_check-incorrecto');
        }
        document.querySelector('#grup_email i').classList.remove('fa-check');
        document.querySelector('#grup_email i').classList.remove('fa-times');
        document.querySelector('#grup_password i').classList.remove('fa-check');
        document.querySelector('#grup_password i').classList.remove('fa-times');
        document.getElementById('grup_email').classList.add('form_pos-incorrecto');
        document.getElementById('grup_password').classList.add('form_pos-incorrecto');
        document.getElementById('formulario_mensaje').classList.add('formulario_mensaje-activo');
        setTimeout(() => {
            document.getElementById('formulario_mensaje').classList.remove('formulario_mensaje-activo');
        }, 5000)
    }
})