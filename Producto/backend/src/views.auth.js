import { Router } from 'express'
import { getDb } from './store.js'
import { signToken, verifyPassword } from './auth.js'

const r = Router()

r.post('/login', (req,res)=>{
  const { email, password } = req.body
  if(!email || !password) return res.status(400).json({error:'Faltan datos'})
  const db = getDb()
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email)
  if(!user) return res.status(401).json({error:'Credenciales inválidas'})
  if(!verifyPassword(password, user.password)) return res.status(401).json({error:'Credenciales inválidas'})
  const token = signToken({ id:user.id, role:user.role, name:user.name, email:user.email })
  res.json({ token, user:{ id:user.id, name:user.name, email:user.email, role:user.role } })
})

r.post('/register', (req,res)=>{
  const { name, email, password } = req.body
  if(!name || !email || !password) return res.status(400).json({error:'Faltan datos'})
  const db = getDb()
  const exists = db.prepare('SELECT 1 FROM users WHERE email = ?').get(email)
  if(exists) return res.status(409).json({error:'Email ya registrado'})
  const bcrypt = require('bcryptjs')
  const hash = bcrypt.hashSync(password,10)
  const info = db.prepare('INSERT INTO users (name,email,password,role) VALUES (?,?,?,?)')
    .run(name,email,hash,'user')
  const user = { id: info.lastInsertRowid, name, email, role:'user' }
  const token = signToken(user)
  res.status(201).json({ token, user })
})

export default r
