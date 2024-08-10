const Login = require('../models/login_model.js')
const jwt = require('jsonwebtoken')

exports.index = (req, res, next) => {
  if (!req.session.user) {
    return res.render('index')
  } else {
    return res.redirect('/logado')
  }
}

exports.cadastro = async (req, res, next) => {
  try {
    const cadastro = new Login(req.body)
    await cadastro.registro()

    if (cadastro.errors.length > 0) {
      req.flash('errors', cadastro.errors)
      req.session.save(() => {
        return res.redirect('back')
      })
      return
    }
    req.flash('success', 'Seu usuário foi registrado com sucesso!')
    req.session.save(() => {
      return res.redirect('back')
    })
  }
  catch (e) {
    console.log(e)
    res.render('404')
  }
}

exports.login = async (req, res, next) => {
  try {
    const login = new Login(req.body)
    await login.login()

    if (login.errors.length > 0) {
      req.flash('errors', login.errors)
      req.session.save(() => {
        return res.redirect('back')
      })
      return
    }
    const token = jwt.sign({ id: login.user._id }, 'mauricio-secret', { expiresIn: '14d' })
    res.cookie('jwt', token, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 14 })

    req.flash('success', 'Seu usuário foi logado com sucesso!')
    req.session.user = login.user
    req.session.save(() => {
      return res.redirect('back')
    })
  }
  catch (e) {
    console.log(e)
    res.render('404')
  }
}

exports.logout = (req, res, next) => {
  res.clearCookie('jwt')
  req.session.destroy(err => {
    if (err) {
      console.error('Erro ao destruir a sessão:', err)
      return res.status(500).send('Erro no logout')
    }
    res.redirect('/')
  })
}

exports.trocar_senha_index = (req, res, next) => {
  res.render('trocar_senha')
}

exports.trocar_senha_dados = async (req, res, next) => {
  try {
    const troca = new Login(req.body)
    await troca.troca_senha()

    if (troca.errors.length > 0) {
      req.flash('errors', troca.errors)
      req.session.save(() => {
        return res.redirect('back')
      })
      return
      0
    }

    req.flash('success', 'Sua senha foi alterada com sucesso!')
    req.session.save(() => {
      return res.redirect('back')
    })
  }

  catch (e) {
    console.log(e)
    res.render('404')
  }
}

exports.deletar_conta = async (req, res, next) => {
  try {
    const user = req.session.user
    if (!user) {
      return res.redirect('/')
    }

    const deletar = new Login(user)
    await deletar.deletar_conta()

    res.clearCookie('jwt')
    req.session.destroy(err => {
      if (err) {
        return res.render('404')
      }
      res.redirect('/')
    })

  } catch (e) {
    console.log(e)
    res.render('404')
  }
}