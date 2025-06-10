'use strict'

import { carregarPaises } from './usuario.js'

document.addEventListener('DOMContentLoaded', () => {
  carregarPaises()
  carregarCategorias()
  mostrarFotoPerfil()
})

  // Ir para home.html ao clicar na logo
  const logo = document.querySelector('.superior #logo-travello')
  if (logo) {
    logo.addEventListener('click', () => {
      window.location.href = 'home.html'
    })
  }

  // Ir para cadastro-viagem.html ao clicar no ícone
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
  
// mostrar dados do usuário (foto e nome)
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
  
      // Atualiza a foto do perfil
      const fotoPerfil = document.querySelector('.foto-perfil img')
      if (fotoPerfil && usuario.foto_perfil) {
        fotoPerfil.src = usuario.foto_perfil
      }
  
      // Atualiza o nome do usuário no "Hi, username!"
      const saudacao = document.querySelector('.meio h4')
      if (saudacao) {
        saudacao.textContent = `Hi, ${usuario.username}!`
      }
  
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error)
    }
  }