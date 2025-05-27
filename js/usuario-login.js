'use strict'

//toast
function mostrarToast(mensagem, corFundo = "#4CAF50") {
    Toastify({
        text: mensagem,
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: corFundo,
        stopOnFocus: true
    }).showToast()
}

function validarDados(email, senha) {
    if (email === '' || senha === '') {
        mostrarToast("Please, complete all required fields", "#f44336")
        return false 
    }
    return true 
}

async function login() {

    const email = document.getElementById('email').value
    const senha = document.getElementById('password').value

    const data = {
        email: email,
        senha: senha
    }

    const urlLogin = 'https://back-spider.vercel.app/login'
    const urlUsuarios = 'https://back-spider.vercel.app/user/listarUsers'


    const options = {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify(data) 
    }

    try {
        
        const response = await fetch(urlLogin, options) 
        const result = await response.json() 

        // verificando se fez login
        if (result.success) {
            alert('Login bem-sucedido!')

            const respostaUsuarios = await fetch(urlUsuarios)  //requisição para pegar a lista de usuários

            const listaUsuarios = await respostaUsuarios.json() //converte a resposta da lista em json

            // procura o usuário na lista de usuarios com base no email 
            const usuarioLogado = listaUsuarios.find(usuario => usuario.email === email)

            // se o usuário foi encontrado na lista
            if (usuarioLogado) {
                // salva o id 
                localStorage.setItem('idUser', usuarioLogado.id)
                console.log('id do usuário salvo no localstorage:', usuarioLogado.id)
            } else {
                // Caso não encontre o usuário na lista
                console.warn('Usuário não encontrado na lista!')
            }
        } else {
            // Caso o login falhe
            mostrarToast('Incorrect email or password.')
        }
    } catch (error) {
        // Se acontecer algum erro com a requisição
        console.error('Erro ao fazer login:', error)
        mostrarToast('Something went wrong. Please try again later.', "#f44336")
    }
}

// Adiciona um ouvinte de evento ao botão de login
// Quando o botão for clicado, ele executa a função login()
document.getElementById('botao-login')
    .addEventListener('click', login)