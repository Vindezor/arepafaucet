const formulario = document.getElementById('formulario');
const inputs = document.querySelectorAll('#formulario input');

const expresiones = {
    correo: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9-._]+$/,
    nombre: /^[A-Z]{1}[a-z]+$/
}

const campos = {
    email: true,
    name: true
}

const validarFormulario = (e) => {
    switch(e.target.name){
        case 'val_name':
            if(e.target.value.length > 0){
                validarCampo(expresiones.nombre, e.target, 'name');
            }
            else{
                document.getElementById('grup_name').classList.remove('form_pos-incorrecto');
                document.getElementById('error_name').classList.remove('form_input_error-activo');
                campos['name'] = true;
            }
        break;
        case 'val_email':
            if(e.target.value.length > 0){
                validarCampo(expresiones.correo, e.target, 'email');
            }
            else{
                document.getElementById('grup_email').classList.remove('form_pos-incorrecto');
                document.getElementById('error_email').classList.remove('form_input_error-activo');
                campos['email'] = true;
            }
        break;
    }
}

const validarCampo = (expresion, input, campo) => {
    if(expresion.test(input.value)){
        document.getElementById(`grup_${campo}`).classList.remove('form_pos-incorrecto');
        document.getElementById(`error_${campo}`).classList.remove('form_input_error-activo');
        campos[campo] = true;
    }
    else{
        document.getElementById(`grup_${campo}`).classList.add('form_pos-incorrecto');
        document.getElementById(`error_${campo}`).classList.add('form_input_error-activo');
        campos[campo] = false;
    }
}

inputs.forEach((input) => {
    input.addEventListener('keyup', validarFormulario);
    input.addEventListener('blur', validarFormulario);
});

formulario.addEventListener('submit', (e) => {
    const terminos = document.getElementById('val_terminos');
    const email_va = document.getElementById('val_email');
    const name_va = document.getElementById('val_name');
    if(email_va.value.length == 0 && name_va.value.length == 0){
        e.preventDefault();
        swal('Editar perfil','No se ha realizado ningun cambio','warning')
            .then(() => {
                document.getElementById('formulario').submit();
            });
    }
    else{
        if(campos.email && campos.name && terminos.checked){
            document.getElementById('grup_terminos').classList.remove('form_pos-incorrecto');
            e.preventDefault();
            swal('Editar perfil','Se ha cambiado su perfil exitosamente','success')
            .then(() => {
                document.getElementById('formulario').submit();
            });
        }
        else{
            e.preventDefault();
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
    }
})