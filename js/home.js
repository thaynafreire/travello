'use strict'

import { carregarPaises } from './usuario.js'

document.addEventListener('DOMContentLoaded', () => {
  carregarPaises()
  carregarCategorias()
  mostrarFotoPerfil()
})

//ir p home ao clilcar na logo
const logo = document.querySelector('.superior #logo-travello')
if (logo) {
  logo.addEventListener('click', () => {
    window.location.href = 'home.html'
  })
}

// ir p cadastro-viagem.html ao clicar no ícone
const iconeNovaViagem = document.querySelector('.filtros-icone img')
if (iconeNovaViagem) {
  iconeNovaViagem.addEventListener('click', () => {
    window.location.href = 'cadastro-trip.html'
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
    // verifica se o elemento não foi encontrado
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

// mostrar foto e nome do usuario
async function mostrarFotoPerfil() {
  const idUsuarioLogado = Number(localStorage.getItem('idUser'))
  console.log('ID do usuário logado:', idUsuarioLogado)
  // se não tiver um ID válido, sai da função 
  if (!idUsuarioLogado) return

  try {
    const resp = await fetch('http://localhost:8080/v1/travello/usuario')
    const responseData = await resp.json()

    // pega o array de usuários do objeto retornado ou cria um array vazio se não existir
    const usuarios = responseData.usuarios || []
    const usuario = usuarios.find(u => Number(u.id) === idUsuarioLogado)

    // ae não achar o usuário sai da função
    if (!usuario) return

    // atualiza a foto do perfil
    const fotoPerfil = document.querySelector('.foto-perfil img')
    if (fotoPerfil && usuario.foto_perfil) {
      fotoPerfil.src = usuario.foto_perfil
    }

    // atualiza o nome do usuário no hi
    const saudacao = document.querySelector('.meio h4')
    if (saudacao) {
      saudacao.textContent = `Hi, ${usuario.username}!`
    }

  } catch (error) {
    console.error('Erro ao carregar dados do usuário:', error)
  }
}

async function buscarViagens() {
  const url = 'http://localhost:8080/v1/travello/viagem'
  const resposta = await fetch(url)
  const dados = await resposta.json()

  return dados.viagens
}

function criarCardViagem(viagem) {
  const divPrincipal = document.querySelector('.principal')

  const card = document.createElement('div')
  card.classList.add('card-viagem')

  const imagem = document.createElement('img')
  imagem.src = viagem.foto_principal || 'img/default-trip.png'
  imagem.alt = 'img da viagem'

  const divUser = document.createElement('div')
  divUser.classList.add('user')

  const imagemUsuario = document.createElement('img')
  imagemUsuario.src = viagem.usuario[0].foto_perfil
  imagemUsuario.alt = 'Foto de perfil do usuário'

  const nomeUsuario = document.createElement('p')
  nomeUsuario.textContent = viagem.usuario[0].username

  divUser.appendChild(imagemUsuario)
  divUser.appendChild(nomeUsuario)

  const divLocal = document.createElement('div')
  divLocal.classList.add('local')

  const nomeLocal = document.createElement('h5')
  nomeLocal.textContent = viagem.nome

  divLocal.appendChild(nomeLocal)

  const divLocation = document.createElement('div')
  divLocation.classList.add('local-location')

  const iconeLocal = document.createElement('img')
  iconeLocal.src = 'img/local.png'
  iconeLocal.alt = 'Ícone de local'

  const endereco = document.createElement('p')
  const nomeCidade = viagem.localizacao[0]?.nome || 'Cidade desconhecida'
  const nomePais = viagem.localizacao[0]?.pais[0]?.nome || 'País desconhecido'
  endereco.textContent = `${nomeCidade}, ${nomePais}`

  divLocation.appendChild(iconeLocal)
  divLocation.appendChild(endereco)

  card.appendChild(imagem)
  card.appendChild(divUser)
  card.appendChild(divLocal)
  card.appendChild(divLocation)

  // Adiciona evento de clique para exibir detalhes da viagem
  card.addEventListener('click', () => exibirDetalhesViagem(viagem))

  divPrincipal.appendChild(card)
}

function exibirDetalhesViagem(viagem) {
  // Esconde o container principal
  const containerPrincipal = document.querySelector('.principal')
  containerPrincipal.classList.add('hidden')

  // Cria o container de detalhes da viagem
  const detalhesViagem = document.createElement('div')
  detalhesViagem.id = 'trip-details'
  detalhesViagem.classList.add('container-details')

  // Preenche os dados da viagem no template
  const template = `
    <header-trip>
      <img src="img/logo-white.png" alt="" id="logo-trip">
      <div class="foto-perfil-trip">
        <img src="${viagem.usuario[0].foto_perfil}" alt="Foto de perfil do usuário">
      </div>
      <p>${viagem.usuario[0].username}</p>
    </header-trip>

    <main-trip>
      <div class="header-main-trip">
        <h4>${viagem.nome}</h4>
        <h6>${viagem.categoria[0].nome}</h6>
      </div>

      <div class="container-lados-trip">
        <div class="lado-esquerdo-trip">
          <img src="${viagem.foto_principal || 'img/default-trip.png'}" alt="">

          <div class="name-location-trip">
            <img src="img/local.png" alt="">
            <p>${viagem.localizacao[0].nome}, ${viagem.localizacao[0].pais[0].nome}</p>
          </div>

          <p id="country-trip">${viagem.localizacao[0].pais[0].nome}</p>

          <div class="date-trip">
            <p id="departure-date-trip">${formatarData(viagem.data_inicio)}</p>
            <img src="img/airplane.png" alt="">
            <p id="return-date-trip">${formatarData(viagem.data_fim)}</p>
          </div>
        </div>

        <div class="lado-direito-trip">
          <h4>Overview</h4>
          <p>${viagem.descricao}</p>
        </div>
      </div>
    </main-trip>
  `

  detalhesViagem.innerHTML = template

  // Adiciona botão de voltar
  const botaoVoltar = document.createElement('button')
  botaoVoltar.textContent = 'Back'
  botaoVoltar.classList.add('btn-voltar')
  botaoVoltar.addEventListener('click', () => {
    detalhesViagem.remove()
    containerPrincipal.classList.remove('hidden')
  })

  detalhesViagem.appendChild(botaoVoltar)

  // Adiciona os detalhes da viagem ao body
  document.body.appendChild(detalhesViagem)
}

function formatarData(dataString) {
  const data = new Date(dataString)
  return data.toLocaleDateString('pt-BR')
}

async function carregarViagensNaTela() {
  const viagens = await buscarViagens()
  document.querySelector('.principal').replaceChildren() 

  viagens.forEach(criarCardViagem)
}

//buscar viagens com filtro por nome/país
async function pesquisarViagensPorNome(nome) {
  const url = `http://localhost:8080/v1/travello/viagem?nome=${encodeURIComponent(nome)}`
  const resposta = await fetch(url)
  const dados = await resposta.json()

  return dados.viagens || []
}

// Evento de clique no botão "Search"
const botaoPesquisar = document.getElementById('pesquisar')
if (botaoPesquisar) {
  botaoPesquisar.addEventListener('click', async () => {
    const campoTexto = document.getElementById('texto')

    // pega o valor digitado removendo espacos no começo e fim
    const termo = campoTexto.value.trim()

    if (termo === '') {
      mostrarToast('Type something.', '#f44336')
      return
    }

    const viagensFiltradas = await pesquisarViagensPorNome(termo)

    const containerPrincipal = document.querySelector('.principal')
    containerPrincipal.replaceChildren() 

    if (viagensFiltradas.length === 0) {
      mostrarToast('No trips found.', '#ffc107')
    } else {
      viagensFiltradas.forEach(criarCardViagem)
    }
  })
}

const mapaCategorias = {
  '1': 'Adventure',
  '2': 'Cultural',
  '3': 'Gastronomic',
  '4': 'Leisure',
  '5': 'Work',
  '6': 'Religious',
  '7': 'Sports',
  '8': 'Exchange'
}

document.getElementById('category') && document.getElementById('category').addEventListener('change', async (evento) => {
  const categoriaId = evento.target.value
  let url = 'http://localhost:8080/v1/travello/viagem'

  const nomeCategoria = mapaCategorias[categoriaId]
  if (nomeCategoria) {
    url += `?categoria=${encodeURIComponent(nomeCategoria)}`
  }

  try {
    const resposta = await fetch(url)
    const dados = await resposta.json()
    const viagensFiltradas = dados.viagens || []
    const containerPrincipal = document.querySelector('.principal')
    containerPrincipal.replaceChildren()

    if (viagensFiltradas.length === 0) {
      mostrarToast('No trips found for this category.', '#ffc107')
    } else {
      viagensFiltradas.forEach(criarCardViagem)
    }

  } catch (erro) {
    console.error('Erro ao buscar viagens por categoria:', erro)
    mostrarToast('Error searching for trips by category.', '#f44336')
  }
})


// executa
carregarViagensNaTela()





