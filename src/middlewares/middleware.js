const jwt = require('jsonwebtoken')

exports.middleware_global = (req, res, next) => {
  res.locals.errors = req.flash('errors')
  res.locals.success = req.flash('success')
  res.locals.user = req.session.user
  next()
}

exports.checkCsrfError = (err, req, res, next) => {
  if (err) {
    return res.render('404')
  }
  next()
}

exports.csrfMiddleware = (req, res, next) => {
  res.locals.csrfToken = req.csrfToken()
  next()
}

exports.verifyToken = (req, res, next) => {
  const token = req.cookies.jwt

  if (!token) {
    return res.redirect('/')
  }

  jwt.verify(token, 'mauricio-secret', (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        req.flash('errors', 'Você precisa fazer login.')
        return res.redirect('/')
      }
      req.flash('errors', 'Você precisa fazer login.')
      return res.redirect('/')
    }

    req.user = decoded
    next()
  })
}

exports.sessionRequired = (req, res, next) => {
  if(!req.session.user) {
    req.flash('errors', 'Você precisa fazer login.')
    req.session.save(() => res.redirect('/'))
    return
  }

  next()
}

exports.cleanCache = (req, res, next) => {
  res.setHeader('Cache-Control', 'no-store')
  next()
}