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

//funcao p validar dados do cadastro
function validarDados(nome_completo, username, email, id_pais, senha){

    if (!nome_completo || !username || !email || !id_pais || !senha) {
        mostrarToast("Please, complete all required fields", "#f44336")
        return false
    }
    return true
}

export async function carregarPaises() {
  try {
    const response = await fetch('http://10.107.134.21:8080/v1/travello/pais')
    const dados = await response.json()

    const select = document.getElementById('location')
    if (!select) return // se o elemento não existe, para aqui sem erro

    select.innerHTML = '<option value="">Select a country</option>'

    const paisesOrdenados = dados.paises.sort((a, b) => a.nome.localeCompare(b.nome))

    paisesOrdenados.forEach(pais => {
      const option = document.createElement('option')
      option.value = pais.id
      option.textContent = pais.nome
      select.appendChild(option)
    })
  } catch (error) {
    console.error('Erro ao carregar países:', error)
  }
}

async function cadastrar() {
  try {
    const foto_perfil = 'https://img.freepik.com/vetores-premium/icone-perfil-simples-cor-branco-icone_1076610-50204.jpg'
    const nome_completo = document.getElementById('name').value
    const username = document.getElementById('username').value
    const email = document.getElementById('email').value
    const senha = document.getElementById('password').value
    const biografia = 'Sharing memories and inspiring new adventures!'
    const id_pais = document.getElementById('location').value 
    const dataAtual = new Date()
    const data_cadastro = dataAtual.toISOString().split('T')[0]

    if (!validarDados(nome_completo, username, email, id_pais, senha)) return

    const data = {
      foto_perfil,
      nome_completo,
      username,
      email,
      senha,
      biografia,
      id_pais,
      data_cadastro
    }

    const url = 'http://10.107.134.21:8080/v1/travello/usuario'

    try {
      console.log('Dados enviados:', JSON.stringify(data, null, 2))
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        const erro = await response.json()
        throw new Error(erro.message || 'Erro desconhecido')
      }

      const result = await response.json()
      mostrarToast('Welcome! Your registration was successful!')
      setTimeout(() => {
        window.location.href = 'index.html'
      }, 1000)


    } catch (error) {
      console.error('Erro ao fazer cadastro:', error)
      mostrarToast('Something went wrong. Please try again later.', "#f44336")
    }
  } catch (error) {
    console.error('Erro geral:', error)
  }
}

const botaoCadastrar = document.getElementById('register')

if (botaoCadastrar) {
  botaoCadastrar.addEventListener('click', cadastrar)
}

//document.getElementById('register')
//    .addEventListener('click', cadastrar)
