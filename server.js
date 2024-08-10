const express = require('express')
const app = express()
const mongoose = require('mongoose')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const flash = require('connect-flash')
const routes = require('./routes')
const path = require('path')
const csrf = require('csurf')
const cookieParser = require('cookie-parser')
const { middleware_global, checkCsrfError, csrfMiddleware, cleanCache } = require('./src/middlewares/middleware')

mongoose.connect('mongodb://127.0.0.1:27017/base_de_dados',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then(() => {
    app.emit('pronto')
  })
  .catch(e => console.log(e))

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static(path.resolve(__dirname, 'public')))

const sessionOptions = session({
  secret: 'maurício-secret',
  store: MongoStore.create({ mongoUrl: 'mongodb://127.0.0.1:27017/base_de_dados' }),
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 14,
    httpOnly: true
  }
})

app.use(sessionOptions)
app.use(flash())
app.set('views', path.resolve(__dirname, 'src', 'views'))
app.set('view engine', 'ejs')
app.use(csrf())
app.use(cookieParser())

// Adicione aqui os middlewares globais:
app.use(middleware_global)
app.use(checkCsrfError)
app.use(csrfMiddleware)
app.use(cleanCache)
// Fim dos middlewares globais

app.use(routes)

app.on('pronto', () => {
  app.listen(3000, () => {
    console.log('Acessar http://localhost:3000')
    console.log('Servidor executando na porta 3000')
  })
})