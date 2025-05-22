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
    const response = await fetch('http://localhost:8080/v1/travello/paises')
    const dados = await response.json()

    const select = document.getElementById('location')
    select.innerHTML = '' // limpa antes de inserir

    dados.paises.forEach(pais => {
      const option = document.createElement('option')
      option.value = pais.id       // usa o ID aqui, não o nome
      option.textContent = pais.nome
      select.appendChild(option)
    })
  } catch (error) {
    console.error('Erro ao carregar países:', error)
  }
}

async function cadastrar() {
  try {
    const foto_perfil = document.getElementById('foto_perfil').value
    const nome_completo = document.getElementById('nome_completo').value
    const username = document.getElementById('username').value
    const email = document.getElementById('email').value
    const senha = document.getElementById('senha').value
    const biografia = document.getElementById('biografia').value
    const id_pais = document.getElementById('location').value // string aqui
    const data_cadastro = new Date().toISOString()

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

    const url = 'http://localhost:8080/v1/travello/usuario'

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
      //window.location.href = 'index.html'

    } catch (error) {
      console.error('Erro ao fazer cadastro:', error)
      mostrarToast('Something went wrong. Please try again later.')
    }
  } catch (error) {
    console.error('Erro geral:', error)
  }
}




// adiciona o clique no botão de cadastro
document.getElementById('register').addEventListener('click', cadastrar)