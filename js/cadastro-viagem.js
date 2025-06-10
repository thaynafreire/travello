/*'use strict'

import { carregarPaises } from './usuario.js'

document.addEventListener('DOMContentLoaded', () => {
  carregarPaises()
  carregarCategorias()
  mostrarFotoPerfil()
})

// toast
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

// carregar categorias
async function carregarCategorias() {
  try {
    const response = await fetch('http://10.107.134.21:8080/v1/travello/categoria')
    const dados = await response.json()

    const select = document.getElementById('category')
    if (!select) return

    select.innerHTML = '<option value="">Category</option>'

    const categoriasOrdenadas = dados.categorias.sort((a, b) => a.nome.localeCompare(b.nome))

    categoriasOrdenadas.forEach(categoria => {
      const option = document.createElement('option')
      option.value = categoria.id
      option.textContent = categoria.nome
      select.appendChild(option)
    })
  } catch (error) {
    console.error('Erro ao carregar categorias:', error)
  }
}

// mostrar foto do usuário
async function mostrarFotoPerfil() {
  const idUsuarioLogado = Number(localStorage.getItem('idUser'))
  console.log('ID do usuário logado:', idUsuarioLogado)
  if (!idUsuarioLogado) return

  try {
    const resp = await fetch('http://10.107.134.21:8080/v1/travello/usuario')
    const responseData = await resp.json()

    const usuarios = responseData.usuarios || []
    const usuario = usuarios.find(u => Number(u.id) === idUsuarioLogado)
    if (!usuario) return

    const fotoPerfil = document.querySelector('.foto-perfil img')
    if (fotoPerfil && usuario.foto_perfil) {
      fotoPerfil.src = usuario.foto_perfil
    }
  } catch (error) {
    console.error('Erro ao carregar foto de perfil:', error)
  }
}

// cadastrar viagem
async function cadastrarViagem() {
  const id_usuario = Number(localStorage.getItem('idUser'))
  const nome = document.getElementById('title').value
  const descricao = document.getElementById('description').value
  const data_inicio = document.getElementById('departure-date').value
  const data_fim = document.getElementById('return-date').value
  const foto_principal = document.getElementById('cover-photo-url').value
  const foto_secundaria = document.getElementById('secondary-photo-url').value
  const id_categoria = document.getElementById('category').value
  const nome_localizacao = document.getElementById('name').value
  const id_pais = document.getElementById('location').value

  // validação simples
  if (!nome || !descricao || !data_inicio || !data_fim || !foto_principal || !id_categoria || !nome_localizacao || !id_pais) {
    mostrarToast("Please fill in all fields", "#f44336")
    return
  }

  try {
    // 1. Cadastrar localização
    const dadosLocalizacao = {
      nome: nome_localizacao,
      id_pais: id_pais
    }

    console.log('📍 Enviando localização:', dadosLocalizacao)

    const respostaLocalizacao = await fetch('http://10.107.134.21:8080/v1/travello/localizacao', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dadosLocalizacao)
    })

    const resultadoLocalizacao = await respostaLocalizacao.json()

    if (!respostaLocalizacao.ok) {
      throw new Error(resultadoLocalizacao.message || 'Erro ao cadastrar localização')
    }

    const id_localizacao = resultadoLocalizacao.id
    console.log('✅ ID da localização cadastrada:', id_localizacao)

    // 2. Cadastrar viagem
    const dadosViagem = {
      nome,
      descricao,
      data_inicio,
      data_fim,
      foto_principal,
      foto_secundaria,
      id_categoria,
      id_localizacao,
      id_usuario
    }

    console.log('✈️ Enviando dados da viagem:', dadosViagem)

    const respostaViagem = await fetch('http://10.107.134.21:8080/v1/travello/viagem', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dadosViagem)
    })

    const resultadoViagem = await respostaViagem.json()

    if (!respostaViagem.ok) {
      throw new Error(resultadoViagem.message || 'Erro ao cadastrar viagem')
    }

    console.log('✅ Viagem cadastrada com sucesso:', resultadoViagem)
    mostrarToast("Trip registered successfully!")

    // redireciona ou limpa formulário
    setTimeout(() => {
      window.location.href = 'home.html'
    }, 1500)

  } catch (error) {
    console.error('Erro ao cadastrar viagem:', error)
    mostrarToast("Something went wrong", "#f44336")
  }
}

// botão de submit
const botaoSubmit = document.getElementById('submit')
if (botaoSubmit) {
  botaoSubmit.addEventListener('click', cadastrarViagem)
}*/

'use strict'

import { carregarPaises } from './usuario.js'

document.addEventListener('DOMContentLoaded', () => {
  carregarPaises()
  carregarCategorias()
  mostrarFotoPerfil()
})

// toast
function mostrarToast(mensagem, corFundo = "#4CAF50") {
  Toastify({
    text: mensagem,
    duration: 3000,
    gravity: "top",
    position: "right",
    style: { background: corFundo },
    stopOnFocus: true
  }).showToast()
}

// carregar categorias
async function carregarCategorias() {
  try {
    const response = await fetch('http://10.107.134.21:8080/v1/travello/categoria')
    const dados = await response.json()

    const select = document.getElementById('category')
    if (!select) return

    select.innerHTML = '<option value="">Category</option>'

    const categoriasOrdenadas = dados.categorias.sort((a, b) => a.nome.localeCompare(b.nome))

    categoriasOrdenadas.forEach(categoria => {
      const option = document.createElement('option')
      option.value = categoria.id
      option.textContent = categoria.nome
      select.appendChild(option)
    })
  } catch (error) {
    console.error('Erro ao carregar categorias:', error)
  }
}

// mostrar foto do usuário
async function mostrarFotoPerfil() {
  const idUsuarioLogado = Number(localStorage.getItem('idUser'))
  console.log('ID do usuário logado:', idUsuarioLogado)
  if (!idUsuarioLogado) return

  try {
    const resp = await fetch('http://10.107.134.21:8080/v1/travello/usuario')
    const responseData = await resp.json()

    const usuarios = responseData.usuarios || []
    const usuario = usuarios.find(u => Number(u.id) === idUsuarioLogado)
    if (!usuario) return

    const fotoPerfil = document.querySelector('.foto-perfil img')
    if (fotoPerfil && usuario.foto_perfil) {
      fotoPerfil.src = usuario.foto_perfil
    }
  } catch (error) {
    console.error('Erro ao carregar foto de perfil:', error)
  }
}

// cadastrar viagem
async function cadastrarViagem() {
  const id_usuario = Number(localStorage.getItem('idUser'))
  const nome = document.getElementById('title').value
  const descricao = document.getElementById('description').value
  const data_inicio = document.getElementById('departure-date').value
  const data_fim = document.getElementById('return-date').value
  const foto_principal = document.getElementById('cover-photo-url').value
  const foto_secundaria = document.getElementById('secondary-photo-url').value
  const id_categoria = document.getElementById('category').value
  const nome_localizacao = document.getElementById('name').value
  const id_pais = document.getElementById('location').value

  // validação simples
  if (!nome || !descricao || !data_inicio || !data_fim || !foto_principal || !id_categoria || !nome_localizacao || !id_pais) {
    mostrarToast("Please fill in all fields", "#f44336")
    return
  }

  try {
    // 1. Cadastrar localização
    const dadosLocalizacao = {
      nome: nome_localizacao,
      id_pais: id_pais
    }

    console.log('📍 Enviando localização:', dadosLocalizacao)

    const respostaLocalizacao = await fetch('http://10.107.134.21:8080/v1/travello/localizacao', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dadosLocalizacao)
    })

    if (!respostaLocalizacao.ok) {
      const erro = await respostaLocalizacao.json()
      throw new Error(erro.message || 'Erro ao cadastrar localização')
    }

    // 2. Buscar o ID da localização recém-cadastrada
    const id_localizacao = await buscarLocalizacao(nome_localizacao, id_pais)
    
    if (!id_localizacao) {
      throw new Error('Não foi possível obter o ID da localização cadastrada')
    }

    console.log('✅ ID da localização cadastrada:', id_localizacao)

    // 3. Cadastrar viagem
    const dadosViagem = {
      nome,
      descricao,
      data_inicio,
      data_fim,
      foto_principal,
      foto_secundaria,
      id_categoria,
      id_localizacao,
      id_usuario
    }

    console.log('✈️ Enviando dados da viagem:', dadosViagem)

    const respostaViagem = await fetch('http://10.107.134.21:8080/v1/travello/viagem', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dadosViagem)
    })

    if (!respostaViagem.ok) {
      const erro = await respostaViagem.json()
      throw new Error(erro.message || 'Erro ao cadastrar viagem')
    }

    console.log('✅ Viagem cadastrada com sucesso!')
    mostrarToast("Trip registered successfully!")

    // redireciona ou limpa formulário
    setTimeout(() => {
      window.location.href = 'home.html'
    }, 1500)

  } catch (error) {
    console.error('Erro ao cadastrar viagem:', error)
    mostrarToast(error.message || "Something went wrong", "#f44336")
  }
}

// botão de submit
const botaoSubmit = document.getElementById('submit')
if (botaoSubmit) {
  botaoSubmit.addEventListener('click', cadastrarViagem)
}

