import { Router } from 'express'
import { getDb } from './store.js'
import { authMiddleware } from './auth.js'

const r = Router()

r.get('/', authMiddleware('admin'), (req,res)=>{
  const db = getDb()
  const users = db.prepare('SELECT id, name, email, role FROM users').all()
  res.json(users)
})

r.put('/:id/role', authMiddleware('admin'), (req,res)=>{
  const { role } = req.body
  if(!['user','admin'].includes(role)) return res.status(400).json({error:'Rol inválido'})
  const db = getDb()
  const info = db.prepare('UPDATE users SET role=? WHERE id=?').run(role, req.params.id)
  if(info.changes===0) return res.status(404).json({error:'No encontrado'})
  res.json({ id: Number(req.params.id), role })
})

export default r
