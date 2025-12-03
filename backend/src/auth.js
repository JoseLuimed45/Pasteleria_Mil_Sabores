import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { getDb } from './store.js'

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret'

export function signToken(payload){
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '2h' })
}

export function authMiddleware(requiredRole){
  return (req,res,next)=>{
    const auth = req.headers.authorization || ''
    const token = auth.startsWith('Bearer ')? auth.slice(7): null
    if(!token) return res.status(401).json({error:'No token'})
    try{
      const payload = jwt.verify(token, JWT_SECRET)
      if(requiredRole && payload.role !== requiredRole){
        return res.status(403).json({error:'Forbidden'})
      }
      req.user = payload
      next()
    }catch(e){
      return res.status(401).json({error:'Token inválido'})
    }
  }
}

export function verifyPassword(plain, hash){
  return bcrypt.compareSync(plain, hash)
}
