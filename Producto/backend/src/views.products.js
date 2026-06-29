import { Router } from 'express'
import { getDb } from './store.js'
import { authMiddleware } from './auth.js'

const r = Router()

r.get('/', (req,res)=>{
  const db = getDb()
  const items = db.prepare('SELECT * FROM products').all()
  res.json(items)
})

r.get('/:id', (req,res)=>{
  const db = getDb()
  const item = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id)
  if(!item) return res.status(404).json({error:'No encontrado'})
  res.json(item)
})

r.post('/', authMiddleware('admin'), (req,res)=>{
  const { name, price, description, available = 1 } = req.body
  if(!name || price==null) return res.status(400).json({error:'Datos inválidos'})
  const db = getDb()
  const info = db.prepare('INSERT INTO products (name,price,description,available) VALUES (?,?,?,?)')
    .run(name, price, description || null, available ? 1 : 0)
  res.status(201).json({ id: info.lastInsertRowid, name, price, description, available: available?1:0 })
})

r.put('/:id', authMiddleware('admin'), (req,res)=>{
  const { name, price, description, available } = req.body
  const db = getDb()
  const exists = db.prepare('SELECT 1 FROM products WHERE id=?').get(req.params.id)
  if(!exists) return res.status(404).json({error:'No encontrado'})
  db.prepare('UPDATE products SET name=?, price=?, description=?, available=? WHERE id=?')
    .run(name, price, description, available ? 1 : 0, req.params.id)
  res.json({ id: Number(req.params.id), name, price, description, available: available?1:0 })
})

r.delete('/:id', authMiddleware('admin'), (req,res)=>{
  const db = getDb()
  const info = db.prepare('DELETE FROM products WHERE id=?').run(req.params.id)
  if(info.changes===0) return res.status(404).json({error:'No encontrado'})
  res.status(204).send()
})

export default r
