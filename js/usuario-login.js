'use strict'

// Função para exibir toast
function mostrarToast(mensagem, corFundo = "#4CAF50") {
    Toastify({
        text: mensagem,
        duration: 3000,
        gravity: "top",
        position: "right",
        style: {
            background: corFundo
        },
        stopOnFocus: false
    }).showToast()
}

// Validação de campos
function validarDados(email, senha) {
    console.log('Validando dados:', { email, senha })
    if (email === '' || senha === '') {
        mostrarToast("Please, complete all required fields", "#f44336")
        return false 
    }
    return true 
}

// Função principal de login
async function login() {
    console.log('Iniciando função login...')

    const email = document.getElementById('email').value
    const senha = document.getElementById('password').value

    console.log('Dados capturados do formulário:', { email, senha })

    if (!validarDados(email, senha)) return

    const data = { email, senha }
    const urlLogin = 'http://localhost:8080/v1/travello/usuario/login'
    const urlUsuarios = 'http://localhost:8080/v1/travello/usuario'

    const options = {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify(data) 
    }

    try {
        console.log('Enviando requisição para login...')

        const response = await fetch(urlLogin, options)
        const result = await response.json()

        console.log('Resposta da API de login:', result)

        if (result.status) {
            mostrarToast("Welcome!")

            console.log('Login realizado com sucesso! Buscando lista de usuários...')

            const respostaUsuarios = await fetch(urlUsuarios)
            const listaUsuarios = await respostaUsuarios.json()

            console.log('Lista de usuários recebida:', listaUsuarios)

            const usuarioLogado = listaUsuarios.usuarios.find(usuario => {
                const entrada = email.toLowerCase()
                return (
                    (usuario.email && usuario.email.toLowerCase() === entrada) ||
                    (usuario.username && usuario.username.toLowerCase() === entrada)
                )
            })
            

            if (usuarioLogado) {
                localStorage.setItem('idUser', usuarioLogado.id)
                console.log('ID do usuário salvo no localStorage:', usuarioLogado.id)
                window.location.href = 'home.html'
            } else {
                console.warn('Usuário não encontrado na lista!')
            }
        } else {
            console.warn('Login falhou. Email ou senha incorretos.')
            mostrarToast('Incorrect email or password.')
        }
    } catch (error) {
        console.error('Erro ao fazer login:', error)
        mostrarToast('Something went wrong. Please try again later.', "#f44336")
    }
}

document.getElementById('login')
    .addEventListener('click', login)