'use strict'

import { carregarPaises } from './usuario.js'

document.addEventListener('DOMContentLoaded', () => {
  carregarPaises()
  carregarCategorias()
  mostrarFotoPerfil()
})

  // ir p home.html ao clicar na logo
  const logo = document.querySelector('#logo-travello')
  if (logo) {
    logo.addEventListener('click', () => {
      window.location.href = 'home.html'
    })
  }

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
    const response = await fetch('http://localhost:8080/v1/travello/categoria')
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
    const resp = await fetch('http://localhost:8080/v1/travello/usuario')
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

// função p buscar localização pelo nome e país
async function buscarLocalizacao(nome, id_pais) {
  try {
    const response = await fetch('http://localhost:8080/v1/travello/localizacao')
    const data = await response.json()
    
    if (data.localizacao) {

      // procura uma localização que tenha o nome informado
      // e que pertença ao país com o ID informado
      const localizacao = data.localizacao.find(loc => 
        loc.nome === nome && loc.pais[0].id === Number(id_pais)
      )

      
      // se a localização for encontrada, retorna o id dela senão retorna null
      return localizacao ? localizacao.id : null
    }
    return null
  } catch (error) {
    console.error('Erro ao buscar localização:', error)
    return null
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
    // 1 - cadastrar localização porque a viagem precisa do id da localização para ser cadastrada 
    const dadosLocalizacao = {
      nome: nome_localizacao,
      id_pais: id_pais
    }

    const respostaLocalizacao = await fetch('http://localhost:8080/v1/travello/localizacao', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dadosLocalizacao)
    })

    if (!respostaLocalizacao.ok) {
      const erro = await respostaLocalizacao.json()
      throw new Error(erro.message || 'Erro ao cadastrar localização')
    }

    // 2 - buscar o id da localização que cadastramos
    const id_localizacao = await buscarLocalizacao(nome_localizacao, id_pais)
    
    if (!id_localizacao) {
      throw new Error('Não foi possível obter o ID da localização cadastrada')
    }

    //console.log(' id da localização cadastrada:', id_localizacao)

    // 3 - cadastrar viagem
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

    //console.log(' dados da viagem:', dadosViagem)

    const respostaViagem = await fetch('http://localhost:8080/v1/travello/viagem', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dadosViagem)
    })

    if (!respostaViagem.ok) {
      const erro = await respostaViagem.json()
      throw new Error(erro.message || 'Erro ao cadastrar viagem')
    }

    //console.log('viagem cadastrada')
    mostrarToast("Trip registered successfully!")

    // redireciona ou limpa formulário

    // espera 1,5 segundos e redireciona para a página home
    setTimeout(() => {
        // muda a url da página redirecionando p home
      window.location.href = 'home.html'
    }, 1500) //tempo de espera

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

