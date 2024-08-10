const express = require('express')
const route = express.Router()

// Adicione aqui os arquivos de controllers
const login_cadastro_controller = require('./src/controllers/login_controller.js')
const { verifyToken, sessionRequired } = require('./src/middlewares/middleware.js')
// Fim dos arquivos controllers

// Adicione aqui os controllers
route.get('/', login_cadastro_controller.index)
route.post('/login-cadastro/cadastro', login_cadastro_controller.cadastro)
route.post('/login-cadastro/login', login_cadastro_controller.login)
route.get('/logado', verifyToken, sessionRequired, (req, res) => {
    if (!req.user) {
        res.redirect('/')
        return
    } else {
      console.log('Dados do usuário autenticado:', req.user)
      res.render('logado')
      return
    }
  })
route.get('/logout', login_cadastro_controller.logout)
route.get('/trocar_senha', login_cadastro_controller.trocar_senha_index)
route.post('/login-cadastro/trocar_senha_dados', login_cadastro_controller.trocar_senha_dados)
route.get('/login-cadastro/deletar_conta', login_cadastro_controller.deletar_conta)
// Fim dos controllers

module.exports = route