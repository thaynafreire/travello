'use strict'

import { carregarPaises } from './usuario.js'

document.addEventListener('DOMContentLoaded', () => {
  carregarPaises()
  mostrarFotoPerfil()
})

async function mostrarFotoPerfil() {
    // pega o id salvo no localStorage na página de login
    const idUsuarioLogado = Number(localStorage.getItem('idUser'))
    console.log('ID do usuário logado:', idUsuarioLogado)
    if (!idUsuarioLogado) return

    try {
        // procura todos os usuários
        const resp = await fetch('http://localhost:8080/v1/travello/usuario')
        const responseData = await resp.json()
        
        // Acessa a propriedade 'usuarios' do objeto retornado
        const usuarios = responseData.usuarios || []
        
        // procura o usuário logado
        const usuario = usuarios.find(u => Number(u.id) === idUsuarioLogado)
        if (!usuario) return

        // troca a imagem de perfil
        const fotoPerfil = document.querySelector('.foto-perfil img')
        if (fotoPerfil && usuario.foto_perfil) {
            fotoPerfil.src = usuario.foto_perfil
        }
    } catch (error) {
        console.error('Erro ao carregar foto de perfil:', error)
    }
}