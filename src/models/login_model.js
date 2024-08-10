const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const login_schema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  }
})

const login_model = mongoose.model('usuários', login_schema)

class Login {
  constructor(body) {
    this.body = body
    this.user = null
    this.errors = []
  }

  async registro() {
    const { email, password, password_repeated } = this.body

    if (!email || !password || !password_repeated) {
      this.errors.push('Preencha todos os dados!')
      return
    }

    if (!validator.isEmail(email)) {
      this.errors.push('Insira um e-mail válido!')
      return
    }

    const existing_user = await login_model.findOne({ email })
    if (existing_user) {
      this.errors.push('E-mail já cadastrado')
      return
    }

    if (password !== password_repeated) {
      this.errors.push('As senhas não coincidem')
      return
    }

    if (password.length < 6) {
      this.errors.push('A senha deve ter pelo menos 6 caracteres')
      return
    }

    const password_hashed = await bcrypt.hash(password, 10)

    const new_usuario = new login_model({
      email: email,
      password: password_hashed
    })

    this.user = await new_usuario.save()
  }

  async login() {
    const { email, password } = this.body

    if (!email || !password) {
      this.errors.push('Preencha todos os dados!')
      return
    }

    const user = await login_model.findOne({ email })
    if (!user) {
      this.errors.push('E-mail não cadastrado')
      return
    }
    
    const password_db = await bcrypt.compare(password, user.password)
    if (!password_db) {
      this.errors.push('Senha incorreta')
      this.user = null
      return
    }

    this.user = user
    this.body = null
  }

  async troca_senha() {
    const { email, password, new_password } = this.body

    if (!email || !password || !new_password) {
      this.errors.push('Preencha todos os dados!')
      return
    }
  
    const user = await login_model.findOne({ email })
    if (!user) {
      this.errors.push('E-mail não cadastrado')
      return
    }
  
    const password_db = await bcrypt.compare(password, user.password)
    if (!password_db) {
      this.errors.push('Senha incorreta')
      return
    }
  
    if (!new_password || new_password.length < 6) {
      this.errors.push('A nova senha deve ter pelo menos 6 caracteres')
      return
    }
  
    const new_password_hashed = await bcrypt.hash(new_password, 10)
    await login_model.updateOne({ email: email }, { password: new_password_hashed })
  }

  async deletar_conta() {
    await login_model.findOneAndDelete(this.body)
  }
}

module.exports = Login