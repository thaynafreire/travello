/*'use strict'

import { carregarPaises } from './usuario.js'

document.addEventListener('DOMContentLoaded', () => {
  carregarPaises()
  carregarCategorias()
  mostrarFotoPerfil()
})

async function carregarCategorias() {
  try {
    const response = await fetch('http://localhost:8080/v1/travello/categoria')
    const dados = await response.json()

    const select = document.getElementById('category')
    if (!select) return

    select.innerHTML = ''

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
}*/

/*'use strict'

import { carregarPaises } from './usuario.js'

document.addEventListener('DOMContentLoaded', () => {
  carregarPaises()
  carregarCategorias()
  mostrarFotoPerfil()
  configurarSubmit()
})

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
function validarDadosViagem(titulo, descricao, dataInicio, dataFim, nomeLocalizacao, idPais, idCategoria, fotoPrincipal, fotoSecundaria) {
    if (!titulo || !descricao || !dataInicio || !dataFim || !nomeLocalizacao || !idPais || !idCategoria) {
        mostrarToast("Please, complete all required fields", "#f44336")
        return false
    }
    
    if (!fotoPrincipal || !fotoSecundaria) {
        mostrarToast("Please, upload both photos", "#f44336")
        return false
    }
    
    return true
}

async function carregarCategorias() {
  try {
    const response = await fetch('http://localhost:8080/v1/travello/categoria')
    const dados = await response.json()

    const select = document.getElementById('category')
    if (!select) return

    select.innerHTML = ''

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

async function cadastrarLocalizacao(nomeLocalizacao, idPais) {
    try {
        const data = {
            nome: nomeLocalizacao,
            id_pais: idPais
        }

        const response = await fetch('http://localhost:8080/v1/travello/localizacao', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })

        if (!response.ok) {
            throw new Error('Erro ao cadastrar localização')
        }

        const result = await response.json()
        return result.id // Retorna o ID da localização criada
    } catch (error) {
        console.error('Erro ao cadastrar localização:', error)
        throw error
    }
}

async function uploadImagem(file) {
    
    return new Promise((resolve) => {

        setTimeout(() => {

            const urlTemp = URL.createObjectURL(file)
            console.log('Upload simulado - URL temporária:', urlTemp)
            

            resolve(urlTemp)
        }, 1000)
    })
}

async function cadastrarViagem() {
    try {

        const titulo = document.getElementById('title').value
        const descricao = document.getElementById('description').value
        const dataInicio = document.getElementById('departure-date').value
        const dataFim = document.getElementById('return-date').value
        const nomeLocalizacao = document.getElementById('name').value
        const idPais = document.getElementById('location').value
        const idCategoria = document.getElementById('category').value
        const idUsuario = localStorage.getItem('idUser')
        

        const inputFotoPrincipal = document.getElementById('cover-photo')
        const inputFotoSecundaria = document.getElementById('secondary-photo')
        
        const fotoPrincipalFile = inputFotoPrincipal.files[0]
        const fotoSecundariaFile = inputFotoSecundaria.files[0]


        if (!validarDadosViagem(titulo, descricao, dataInicio, dataFim, nomeLocalizacao, idPais, idCategoria, fotoPrincipalFile, fotoSecundariaFile)) {
            return
        }


        const [fotoPrincipalUrl, fotoSecundariaUrl] = await Promise.all([
            uploadImagem(fotoPrincipalFile),
            uploadImagem(fotoSecundariaFile)
        ])


        const idLocalizacao = await cadastrarLocalizacao(nomeLocalizacao, idPais)


        const dadosViagem = {
            nome: titulo,
            descricao: descricao,
            data_inicio: dataInicio,
            data_fim: dataFim,
            foto_principal: fotoPrincipalUrl,
            foto_secundaria: fotoSecundariaUrl,
            id_categoria: idCategoria,
            id_localizacao: idLocalizacao,
            id_usuario: idUsuario
        }

        console.log('Dados da viagem a serem enviados:', dadosViagem)


        const response = await fetch('http://localhost:8080/v1/travello/viagem', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dadosViagem)
        })

        if (!response.ok) {
            const erro = await response.json()
            throw new Error(erro.message || 'Erro ao cadastrar viagem')
        }

        const result = await response.json()
        mostrarToast('Trip registered successfully!')
        setTimeout(() => {
            window.location.href = 'index.html' 
        }, 1500)

    } catch (error) {
        console.error('Erro ao cadastrar viagem:', error)
        mostrarToast('Error registering trip. Please try again.', "#f44336")
    }
}

function configurarSubmit() {
    const botaoSubmit = document.getElementById('submit')
    if (botaoSubmit) {
        botaoSubmit.addEventListener('click', cadastrarViagem)
    }
}*/

/*'use strict'

import { carregarPaises } from './usuario.js'

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM totalmente carregado - iniciando configurações...')
  carregarPaises()
  carregarCategorias()
  mostrarFotoPerfil()
})

// função p exibir toast
function mostrarToast(mensagem, corFundo = "#4CAF50") {
    console.log(`Exibindo toast: ${mensagem}`)
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

// função p validar dados do formulario
function validarDadosViagem(nome, descricao, dataInicio, dataFim, fotoPrincipal, fotoSecundaria, idCategoria, nomeLocalizacao, idPais) {
    console.log('validação dos dados...')
    console.log({
        nome, 
        descricao, 
        dataInicio, 
        dataFim, 
        fotoPrincipal: fotoPrincipal ? 'Arquivo selecionado' : 'Nenhum arquivo',
        fotoSecundaria: fotoSecundaria ? 'Arquivo selecionado' : 'Nenhum arquivo',
        idCategoria,
        nomeLocalizacao,
        idPais
    })

    if (!nome || !descricao || !dataInicio || !dataFim || !fotoPrincipal || !fotoSecundaria || !idCategoria || !nomeLocalizacao || !idPais) {
        console.error('validação falhou: campos obrigatórios faltando')
        mostrarToast("Please, complete all required fields", "#f44336")
        return false
    }
    
    if (new Date(dataInicio) > new Date(dataFim)) {
        console.error('validação falhou: data de início posterior à data de fim')
        mostrarToast("Departure date must be before return date", "#f44336")
        return false
    }
    
    console.log('Validação concluída com sucesso')
    return true
}

// Função para carregar categorias
async function carregarCategorias() {
    console.log('Iniciando carregamento de categorias...')
    try {
        const response = await fetch('http://localhost:8080/v1/travello/categoria')
        console.log('Resposta da API de categorias:', response)
        
        const dados = await response.json()
        console.log('Dados das categorias recebidos:', dados)

        const select = document.getElementById('category')
        if (!select) {
            console.error('Elemento select de categorias não encontrado')
            return
        }

        select.innerHTML = ''

        const categoriasOrdenadas = dados.categorias.sort((a, b) => a.nome.localeCompare(b.nome))
        console.log('Categorias ordenadas:', categoriasOrdenadas)

        categoriasOrdenadas.forEach(categoria => {
            const option = document.createElement('option')
            option.value = categoria.id
            option.textContent = categoria.nome
            select.appendChild(option)
        })
        
        console.log('Categorias carregadas com sucesso')
    } catch (error) {
        console.error('Erro ao carregar categorias:', error)
    }
}

// Função para mostrar foto de perfil
async function mostrarFotoPerfil() {
    console.log('Iniciando carregamento da foto de perfil...')
    const idUsuarioLogado = Number(localStorage.getItem('idUser'))
    console.log('ID do usuário logado recuperado do localStorage:', idUsuarioLogado)
    
    if (!idUsuarioLogado) {
        console.warn('Nenhum ID de usuário encontrado no localStorage')
        return
    }

    try {
        console.log('Buscando lista de usuários...')
        const resp = await fetch('http://localhost:8080/v1/travello/usuario')
        console.log('Resposta da API de usuários:', resp)
        
        const responseData = await resp.json()
        console.log('Dados dos usuários recebidos:', responseData)
        
        const usuarios = responseData.usuarios || []
        console.log('Total de usuários encontrados:', usuarios.length)
        
        const usuario = usuarios.find(u => Number(u.id) === idUsuarioLogado)
        if (!usuario) {
            console.warn('Usuário logado não encontrado na lista de usuários')
            return
        }

        console.log('Usuário logado encontrado:', usuario)
        const fotoPerfil = document.querySelector('.foto-perfil img')
        
        if (fotoPerfil && usuario.foto_perfil) {
            console.log('Atualizando foto de perfil:', usuario.foto_perfil)
            fotoPerfil.src = usuario.foto_perfil
        } else {
            console.warn('Elemento de foto de perfil não encontrado ou usuário sem foto')
        }
    } catch (error) {
        console.error('Erro ao carregar foto de perfil:', error)
    }
}

// Função para upload de imagem no Azure
export async function uploadImageToAzure(uploadParams) {
    console.log('Iniciando upload para Azure...', uploadParams)
    const { file, storageAccount, sasToken, containerName } = uploadParams
    
    if (!file) {
        console.error('Nenhum arquivo fornecido para upload')
        return false
    }

    const blobName = `${Date.now()}-${file.name}`
    console.log('Nome do blob:', blobName)
    
    const baseUrl = `https://${storageAccount}.blob.core.windows.net/${containerName}/${blobName}`
    const uploadUrl = `${baseUrl}?${sasToken}`
    console.log('URL de upload:', uploadUrl)

    const options = {
        method: "PUT",
        headers: {
            "x-ms-blob-type": "BlockBlob",
            "Content-Type": file.type || "application/octet-stream",
        },
        body: file,
    }

    try {
        console.log('Enviando arquivo para Azure...')
        const response = await fetch(uploadUrl, options)
        console.log('Resposta do Azure:', response)

        if (response.ok) {
            console.log('Upload realizado com sucesso. URL:', baseUrl)
            return baseUrl
        } else {
            console.error('Erro no upload:', response.status, response.statusText)
            return false
        }
    } catch (error) {
        console.error('Erro ao fazer upload para Azure:', error)
        return false
    }
}

// Função principal para cadastrar a viagem
async function cadastrarViagem() {
    console.log('Iniciando processo de cadastro de viagem...')
    try {
        // Obter dados do formulário
        console.log('Obtendo dados do formulário...')
        const nome = document.getElementById('title').value
        const descricao = document.getElementById('description').value
        const dataInicio = document.getElementById('departure-date').value
        const dataFim = document.getElementById('return-date').value
        const idCategoria = document.getElementById('category').value
        const nomeLocalizacao = document.getElementById('name').value
        const idPais = document.getElementById('location').value
        const idUsuario = localStorage.getItem('idUser')

        console.log('Dados básicos obtidos:', {
            nome,
            descricao,
            dataInicio,
            dataFim,
            idCategoria,
            nomeLocalizacao,
            idPais,
            idUsuario
        })

        // Obter arquivos de imagem
    // Por:
        const fotoPrincipalFile = document.getElementById('cover-photo').files[0]
        const fotoSecundariaFile = document.getElementById('secondary-photo').files[0]
        
        console.log('Arquivos de imagem:', {
            fotoPrincipal: fotoPrincipalFile ? fotoPrincipalFile.name : 'Nenhum arquivo',
            fotoSecundaria: fotoSecundariaFile ? fotoSecundariaFile.name : 'Nenhum arquivo'
        })

        // Validar campos obrigatórios
        console.log('Validando dados...')
        if (!validarDadosViagem(nome, descricao, dataInicio, dataFim, fotoPrincipalFile, fotoSecundariaFile, idCategoria, nomeLocalizacao, idPais)) {
            console.error('Validação falhou - abortando cadastro')
            return
        }

        // Configurações para upload no Azure
        const azureConfig = {
            storageAccount: 'travelloupload',
            sasToken: 'sp=racwl&st=2025-06-05T17:12:20Z&se=2025-06-06T01:12:20Z&sv=2024-11-04&sr=c&sig=eSnZ94WeLmm0PUS0TWnlSa5nuMAFttsfzQ6pVk%2BZDlM%3D',
            containerName: 'photos-travello',
        }

        console.log('Configurações do Azure:', azureConfig)

        // Upload da foto principal
        console.log('Iniciando upload da foto principal...')
        const fotoPrincipalUrl = await uploadImageToAzure({
            file: fotoPrincipalFile,
            ...azureConfig
        })

        if (!fotoPrincipalUrl) {
            console.error('Falha no upload da foto principal')
            mostrarToast('Error uploading cover photo', "#f44336")
            return
        }

        console.log('Foto principal enviada. URL:', fotoPrincipalUrl)

        // Upload da foto secundária
        console.log('Iniciando upload da foto secundária...')
        const fotoSecundariaUrl = await uploadImageToAzure({
            file: fotoSecundariaFile,
            ...azureConfig
        })

        if (!fotoSecundariaUrl) {
            console.error('Falha no upload da foto secundária')
            mostrarToast('Error uploading secondary photo', "#f44336")
            return
        }

        console.log('Foto secundária enviada. URL:', fotoSecundariaUrl)

        // Primeiro, cadastrar a localização
        const localizacaoData = {
            nome: nomeLocalizacao,
            id_pais: idPais
        }

        console.log('Dados da localização a serem enviados:', localizacaoData)
        
        console.log('Enviando requisição para cadastrar localização...')
        const localizacaoResponse = await fetch('http://localhost:8080/v1/travello/localizacao', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(localizacaoData)
        })

        console.log('Resposta da API de localização:', localizacaoResponse)
        
        if (!localizacaoResponse.ok) {
            const erro = await localizacaoResponse.json()
            console.error('Erro ao cadastrar localização:', erro)
            throw new Error(erro.message || 'Erro ao cadastrar localização')
        }

        const localizacaoResult = await localizacaoResponse.json()
        console.log('Localização cadastrada com sucesso. Resultado:', localizacaoResult)
        
        const idLocalizacao = localizacaoResult.id
        console.log('ID da localização obtido:', idLocalizacao)

        // Agora, cadastrar a viagem
        const viagemData = {
            nome: nome,
            descricao: descricao,
            data_inicio: dataInicio,
            data_fim: dataFim,
            foto_principal: fotoPrincipalUrl,
            foto_secundaria: fotoSecundariaUrl,
            id_categoria: idCategoria,
            id_localizacao: idLocalizacao,
            id_usuario: idUsuario
        }

        console.log('Dados da viagem a serem enviados:', viagemData)
        
        console.log('Enviando requisição para cadastrar viagem...')
        const viagemResponse = await fetch('http://localhost:8080/v1/travello/viagem', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(viagemData)
        })

        console.log('Resposta da API de viagem:', viagemResponse)
        
        if (!viagemResponse.ok) {
            const erro = await viagemResponse.json()
            console.error('Erro ao cadastrar viagem:', erro)
            throw new Error(erro.message || 'Erro ao cadastrar viagem')
        }

        const viagemResult = await viagemResponse.json()
        console.log('Viagem cadastrada com sucesso. Resultado:', viagemResult)

        mostrarToast('Trip registered successfully!')
        setTimeout(() => {
            console.log('Redirecionando para a página inicial...')
            window.location.href = 'index.html'
        }, 1000)

    } catch (error) {
        console.error('Erro no processo de cadastro:', error)
        mostrarToast(error.message || 'Something went wrong. Please try again later.', "#f44336")
    }
}

// Adicionar evento de clique ao botão de submit
const submitButton = document.getElementById('submit')
if (submitButton) {
    console.log('Botão de submit encontrado, adicionando event listener...')
    submitButton.addEventListener('click', cadastrarViagem)
} else {
    console.error('Botão de submit não encontrado no DOM')
}
*/

'use strict'

import { carregarPaises } from './usuario.js'

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded and parsed')
  carregarPaises()
  carregarCategorias()
  mostrarFotoPerfil()
  document.getElementById('submit').addEventListener('click', cadastrarViagem)
})

async function carregarCategorias() {
  console.log('Starting to load categories...')
  try {
    const response = await fetch('http://localhost:8080/v1/travello/categoria')
    console.log('Categories API response status:', response.status)
    
    if (!response.ok) {
      console.error('Failed to load categories, status:', response.status)
      throw new Error('Failed to load categories')
    }
    
    const dados = await response.json()
    console.log('Categories data received:', dados)
    
    const select = document.getElementById('category')
    if (!select) {
      console.error('Category select element not found')
      return
    }

    select.innerHTML = '<option value="">Category</option>'
    console.log('Cleared category select options')

    const categoriasOrdenadas = dados.categorias?.sort((a, b) => a.nome.localeCompare(b.nome)) || []
    console.log('Sorted categories:', categoriasOrdenadas)
    
    categoriasOrdenadas.forEach(categoria => {
      const option = document.createElement('option')
      option.value = categoria.id
      option.textContent = categoria.nome
      select.appendChild(option)
    })
    console.log('Added categories to select element')
  } catch (error) {
    console.error('Error loading categories:', error)
    mostrarToast("Failed to load categories. Please try again.", "#f44336")
  }
}

async function mostrarFotoPerfil() {
    console.log('Starting to load profile picture...')
    const idUsuarioLogado = Number(localStorage.getItem('idUser'))
    console.log('User ID from localStorage:', idUsuarioLogado)
    
    if (!idUsuarioLogado) {
      console.warn('No user ID found in localStorage')
      return
    }

    try {
        console.log('Fetching user data...')
        const resp = await fetch('http://localhost:8080/v1/travello/usuario')
        console.log('User API response status:', resp.status)
        
        if (!resp.ok) {
          console.error('Failed to load user data, status:', resp.status)
          throw new Error('Failed to load user data')
        }
        
        const responseData = await resp.json()
        console.log('User data received:', responseData)
        
        const usuarios = responseData.usuarios || []
        console.log('Users list:', usuarios)
        
        const usuario = usuarios.find(u => Number(u.id) === idUsuarioLogado)
        console.log('Found user:', usuario)
        
        if (!usuario) {
          console.warn('User not found in users list')
          return
        }

        const fotoPerfil = document.querySelector('.foto-perfil img')
        if (fotoPerfil) {
          console.log('Profile picture element found')
          if (usuario.foto_perfil) {
            console.log('Setting profile picture src:', usuario.foto_perfil)
            fotoPerfil.src = usuario.foto_perfil
          } else {
            console.warn('User has no profile picture URL')
          }
        } else {
          console.warn('Profile picture element not found')
        }
    } catch (error) {
        console.error('Error loading profile picture:', error)
    }
}

async function uploadImageToAzure(uploadParams) {
    console.log('Starting image upload to Azure...', uploadParams)
    try {
        const { file, storageAccount, sasToken, containerName } = uploadParams
        if (!file) {
          console.warn('No file provided for upload')
          return null
        }

        console.log('Preparing upload for file:', file.name)
        const blobName = `${Date.now()}-${file.name}`
        const baseUrl = `https://${storageAccount}.blob.core.windows.net/${containerName}/${blobName}`
        const uploadUrl = `${baseUrl}?${sasToken}`
        console.log('Azure upload URL:', uploadUrl)

        const options = {
            method: "PUT",
            headers: {
                "x-ms-blob-type": "BlockBlob",
                "Content-Type": file.type || "application/octet-stream",
            },
            body: file,
        }

        console.log('Uploading file...')
        const response = await fetch(uploadUrl, options)
        console.log('Upload response status:', response.status)
        
        if (!response.ok) {
            console.error('Upload failed:', response.status, response.statusText)
            return null
        }

        console.log('Upload successful, URL:', baseUrl)
        return baseUrl
    } catch (error) {
        console.error('Error uploading image:', error)
        return null
    }
}

async function cadastrarViagem() {
    console.log('Starting trip registration process...')
    
    // Show loading state
    const submitBtn = document.getElementById('submit')
    submitBtn.disabled = true
    submitBtn.textContent = 'Processing...'
    console.log('Submit button disabled and loading state set')

    try {
        // 1. Collect form data
        console.log('Collecting form data...')
        const formData = {
            nome: document.getElementById('title').value.trim(),
            descricao: document.getElementById('description').value.trim(),
            dataInicio: document.getElementById('departure-date').value,
            dataFim: document.getElementById('return-date').value,
            idCategoria: document.getElementById('category').value,
            nomeLocalizacao: document.getElementById('name').value.trim(),
            idPais: document.getElementById('location').value,
            idUsuario: localStorage.getItem('idUser'),
            coverPhoto: document.getElementById('cover-photo').files[0],
            secondaryPhoto: document.getElementById('secondary-photo').files[0]
        }
        console.log('Form data collected:', formData)

        // 2. Validate all fields
        console.log('Validating form data...')
        const validationErrors = []
        
        if (!formData.nome || formData.nome.length < 3 || formData.nome.length > 100) {
            validationErrors.push('Title must be between 3 and 100 characters')
        }
        
        if (!formData.descricao || formData.descricao.length < 10 || formData.descricao.length > 1000) {
            validationErrors.push('Description must be between 10 and 1000 characters')
        }
        
        if (!formData.dataInicio || !formData.dataFim) {
            validationErrors.push('Please select both departure and return dates')
        } else if (new Date(formData.dataFim) <= new Date(formData.dataInicio)) {
            validationErrors.push('Return date must be after departure date')
        }
        
        if (!formData.idCategoria || formData.idCategoria === "") {
            validationErrors.push('Please select a category')
        }
        
        if (!formData.nomeLocalizacao || formData.nomeLocalizacao.length < 2 || formData.nomeLocalizacao.length > 50) {
            validationErrors.push('Location name must be between 2 and 50 characters')
        }
        
        if (!formData.idPais || formData.idPais === "") {
            validationErrors.push('Please select a country')
        }
        
        if (!formData.idUsuario) {
            validationErrors.push('User not identified. Please login again.')
        }

        if (validationErrors.length > 0) {
            console.error('Validation errors:', validationErrors)
            throw new Error(validationErrors.join('\n'))
        }
        console.log('Form validation passed')

        // 3. Upload images (if provided)
        console.log('Processing images...')
        let fotoPrincipalUrl = 'https://travelloupload.blob.core.windows.net/default-images/default-cover.jpg'
        let fotoSecundariaUrl = 'https://travelloupload.blob.core.windows.net/default-images/default-secondary.jpg'

        if (formData.coverPhoto) {
            console.log('Uploading cover photo...')
            const uploadParams = {
                file: formData.coverPhoto,
                storageAccount: 'travelloupload',
                sasToken: 'sp=racwl&st=2025-06-05T17:12:20Z&se=2025-06-06T01:12:20Z&sv=2024-11-04&sr=c&sig=eSnZ94WeLmm0PUS0TWnlSa5nuMAFttsfzQ6pVk%2BZDlM%3D',
                containerName: 'photos-travello',
            }
            const uploadedUrl = await uploadImageToAzure(uploadParams)
            if (uploadedUrl) {
                fotoPrincipalUrl = uploadedUrl
                console.log('Cover photo uploaded successfully:', fotoPrincipalUrl)
            } else {
                console.warn('Using default cover photo due to upload failure')
            }
        } else {
            console.log('No cover photo provided, using default')
        }

        if (formData.secondaryPhoto) {
            console.log('Uploading secondary photo...')
            const uploadParams = {
                file: formData.secondaryPhoto,
                storageAccount: 'travelloupload',
                sasToken: 'sp=racwl&st=2025-06-05T19:20:34Z&se=2025-06-06T03:20:34Z&sv=2024-11-04&sr=c&sig=H3qO3KckgWPMkMGSwCbSi5fH%2BpGLUOfM4zVe9NFv4QQ%3D',
                containerName: 'photo-secondary',
            }
            const uploadedUrl = await uploadImageToAzure(uploadParams)
            if (uploadedUrl) {
                fotoSecundariaUrl = uploadedUrl
                console.log('Secondary photo uploaded successfully:', fotoSecundariaUrl)
            } else {
                console.warn('Using default secondary photo due to upload failure')
            }
        } else {
            console.log('No secondary photo provided, using default')
        }

        // 4. Create location first
        console.log('Creating location...')
        const locationPayload = {
            nome: formData.nomeLocalizacao,
            id_pais: formData.idPais
        }
        console.log('Location payload:', locationPayload)

        const localizacaoResponse = await fetch('http://localhost:8080/v1/travello/localizacao', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(locationPayload)
        })
        console.log('Location API response status:', localizacaoResponse.status)

        if (!localizacaoResponse.ok) {
            const errorData = await localizacaoResponse.json()
            console.error('Location API error:', errorData)
            throw new Error(errorData.message || 'Failed to create location')
        }

        const locationResult = await localizacaoResponse.json()
        console.log('Location created successfully:', locationResult)
        const idLocalizacao = locationResult.id
        console.log('Location ID:', idLocalizacao)

        // 5. Create trip
        console.log('Creating trip...')
        const viagemData = {
            nome: formData.nome,
            descricao: formData.descricao,
            data_inicio: formData.dataInicio,
            data_fim: formData.dataFim,
            foto_principal: fotoPrincipalUrl,
            foto_secundaria: fotoSecundariaUrl,
            id_categoria: formData.idCategoria,
            id_localizacao: idLocalizacao,
            id_usuario: formData.idUsuario
        }
        console.log('Trip payload:', viagemData)

        const viagemResponse = await fetch('http://localhost:8080/v1/travello/viagem', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(viagemData)
        })
        console.log('Trip API response status:', viagemResponse.status)

        if (!viagemResponse.ok) {
            const errorData = await viagemResponse.json()
            console.error('Trip API error:', errorData)
            throw new Error(errorData.message || 'Failed to register trip')
        }

        const tripResult = await viagemResponse.json()
        console.log('Trip created successfully:', tripResult)
        mostrarToast("Trip registered successfully!")
        
        setTimeout(() => {
            console.log('Redirecting to index page...')
            window.location.href = 'index.html'
        }, 1500)

    } catch (error) {
        console.error('Error in trip registration process:', error)
        mostrarToast(error.message, "#f44336")
    } finally {
        submitBtn.disabled = false
        submitBtn.textContent = 'Submit'
        console.log('Submit button reset to normal state')
    }
}

function mostrarToast(mensagem, corFundo = "#4CAF50") {
    console.log('Showing toast:', mensagem)
    Toastify({
        text: mensagem,
        duration: 5000,
        gravity: "top",
        position: "right",
        style: {
            background: corFundo,
            color: "#ffffff",
            padding: "15px",
            "border-radius": "5px",
            "box-shadow": "0 3px 6px rgba(0,0,0,0.16)"
        },
        stopOnFocus: true
    }).showToast()
}