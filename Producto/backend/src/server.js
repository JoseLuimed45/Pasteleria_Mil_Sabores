import express from 'express'
import cors from 'cors'
import { initDb } from './store.js'
import authRouter from './views.auth.js'
import productsRouter from './views.products.js'
import usersRouter from './views.users.js'

const app = express()
app.use(cors())
app.use(express.json())

initDb()

app.get('/', (req, res) => {
  res.json({ ok: true, name: 'Pastelería Mil Sabores API' })
})

app.use('/api/auth', authRouter)
app.use('/api/products', productsRouter)
app.use('/api/users', usersRouter)

const PORT = process.env.PORT || 4000
app.listen(PORT, () => console.log(`API corriendo en http://localhost:${PORT}`))
