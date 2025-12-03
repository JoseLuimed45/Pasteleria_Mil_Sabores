import React, { useEffect, useMemo, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom'

function useAuth(){
  const [user,setUser] = useState(()=>{
    try{ return JSON.parse(localStorage.getItem('pm_auth_user')||'null') }catch{ return null }
  })
  const [token,setToken] = useState(()=> localStorage.getItem('pm_auth_token')||'')
  const login = (u,t)=>{ setUser(u); setToken(t); localStorage.setItem('pm_auth_user', JSON.stringify(u)); localStorage.setItem('pm_auth_token', t) }
  const logout = ()=>{ setUser(null); setToken(''); localStorage.removeItem('pm_auth_user'); localStorage.removeItem('pm_auth_token') }
  return useMemo(()=>({user,token,login,logout}),[user,token])
}

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000'

function Navbar({auth}){
  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary border-bottom">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">Mil Sabores</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#nav" aria-controls="nav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="nav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item"><Link className="nav-link" to="/productos">Productos</Link></li>
            {auth.user?.role === 'admin' && (
              <li className="nav-item"><Link className="nav-link" to="/admin">Admin</Link></li>
            )}
          </ul>
          <div className="d-flex gap-2">
            {!auth.user ? (
              <>
                <Link className="btn btn-outline-secondary" to="/login">Ingresar</Link>
                <Link className="btn btn-brand" to="/registro">Registrarse</Link>
              </>
            ) : (
              <>
                <span className="me-2">Hola, {auth.user.name}</span>
                <button className="btn btn-outline-danger" onClick={auth.logout}>Salir</button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

function Home(){
  return (
    <div className="container py-4">
      <header className="mb-4 text-center">
        <h1 className="display-5 fw-bold">Pastelería Mil Sabores</h1>
        <p className="text-muted">Delicias artesanales con React + Bootstrap</p>
      </header>
      <div className="row g-3">
        <div className="col-md-6">
          <div className="card h-100 shadow-sm"><div className="card-body">
            <h5 className="card-title">Productos</h5>
            <p className="card-text">Explora nuestros pasteles y postres.</p>
            <Link to="/productos" className="btn btn-brand">Ver productos</Link>
          </div></div>
        </div>
        <div className="col-md-6">
          <div className="card h-100 shadow-sm"><div className="card-body">
            <h5 className="card-title">Regístrate</h5>
            <p className="card-text">Crea tu cuenta para comprar.</p>
            <Link to="/registro" className="btn btn-outline-primary">Registrarme</Link>
          </div></div>
        </div>
      </div>
    </div>
  )
}

function Productos(){
  const [items,setItems] = useState([])
  const [loading,setLoading] = useState(true)
  useEffect(()=>{
    fetch(`${API}/api/products`).then(r=>r.json()).then(setItems).finally(()=>setLoading(false))
  },[])
  return (
    <div className="container py-4">
      <h2 className="mb-3">Productos</h2>
      {loading? <p>Cargando...</p> : (
        <div className="row g-3">
          {items.map(p=> (
            <div className="col-sm-6 col-md-4" key={p.id}>
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">{p.name}</h5>
                  <p className="card-text small text-muted">{p.description || 'Sin descripción'}</p>
                  <span className="badge text-bg-success">${'{'}p.price{'}'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function Login({auth}){
  const [email,setEmail] = useState('admin@pasteleria.com')
  const [password,setPassword] = useState('admin123')
  const [error,setError] = useState('')
  const onSubmit = async (e)=>{
    e.preventDefault(); setError('')
    try{
      const r = await fetch(`${API}/api/auth/login`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({email,password}) })
      const data = await r.json()
      if(!r.ok) throw new Error(data.error||'Error')
      auth.login(data.user, data.token)
    }catch(err){ setError(err.message) }
  }
  if(auth.user) return <Navigate to="/" replace />
  return (
    <div className="container py-4" style={{maxWidth:480}}>
      <h2 className="mb-3">Ingresar</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={onSubmit} className="vstack gap-3">
        <input className="form-control" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input type="password" className="form-control" placeholder="Contraseña" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="btn btn-brand" type="submit">Entrar</button>
      </form>
    </div>
  )
}

function Registro(){
  const [name,setName] = useState('')
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [ok,setOk] = useState(false)
  const [error,setError] = useState('')
  const onSubmit = async (e)=>{
    e.preventDefault(); setError(''); setOk(false)
    try{
      const r = await fetch(`${API}/api/auth/register`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({name,email,password}) })
      const data = await r.json()
      if(!r.ok) throw new Error(data.error||'Error')
      setOk(true)
    }catch(err){ setError(err.message) }
  }
  return (
    <div className="container py-4" style={{maxWidth:520}}>
      <h2 className="mb-3">Registro</h2>
      {ok && <div className="alert alert-success">Registro exitoso. Ahora puedes iniciar sesión.</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={onSubmit} className="vstack gap-3">
        <input className="form-control" placeholder="Nombre" value={name} onChange={e=>setName(e.target.value)} />
        <input className="form-control" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input type="password" className="form-control" placeholder="Contraseña" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="btn btn-brand" type="submit">Crear cuenta</button>
      </form>
    </div>
  )
}

function Admin({auth}){
  const [tab,setTab] = useState('productos')
  if(!auth.user) return <Navigate to="/login" replace />
  if(auth.user.role !== 'admin') return <Navigate to="/" replace />
  return (
    <div className="container py-4">
      <h2 className="mb-3">Panel Administrador</h2>
      <ul className="nav nav-tabs mb-3">
        <li className="nav-item"><button className={`nav-link ${tab==='productos'?'active':''}`} onClick={()=>setTab('productos')}>Productos</button></li>
        <li className="nav-item"><button className={`nav-link ${tab==='usuarios'?'active':''}`} onClick={()=>setTab('usuarios')}>Usuarios</button></li>
      </ul>
      {tab==='productos'? <AdminProductos auth={auth}/> : <AdminUsuarios auth={auth}/>}    
    </div>
  )
}

function AdminProductos({auth}){
  const [items,setItems] = useState([])
  const [form,setForm] = useState({id:null,name:'',price:'',description:''})
  const [error,setError] = useState('')
  const headers = { 'Content-Type':'application/json', 'Authorization': `Bearer ${auth.token}` }
  const load = ()=> fetch(`${API}/api/products`).then(r=>r.json()).then(setItems)
  useEffect(()=>{ load() },[])
  const save = async (e)=>{
    e.preventDefault(); setError('')
    const payload = { name: form.name, price: Number(form.price), description: form.description }
    const url = form.id? `${API}/api/products/${form.id}` : `${API}/api/products`
    const method = form.id? 'PUT' : 'POST'
    const r = await fetch(url,{ method, headers, body: JSON.stringify(payload) })
    const data = await r.json(); if(!r.ok){ setError(data.error||'Error'); return }
    setForm({id:null,name:'',price:'',description:''}); load()
  }
  const removeItem = async (id)=>{
    const r = await fetch(`${API}/api/products/${id}`,{ method:'DELETE', headers })
    if(r.status===204) load()
  }
  const editItem = (p)=> setForm({ id:p.id, name:p.name, price:String(p.price), description:p.description||'' })
  return (
    <div className="row g-3">
      <div className="col-md-5">
        <div className="card"><div className="card-body">
          <h5 className="card-title">{form.id? 'Editar producto' : 'Crear producto'}</h5>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={save} className="vstack gap-2">
            <input className="form-control" placeholder="Nombre" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
            <input className="form-control" placeholder="Precio" value={form.price} onChange={e=>setForm({...form,price:e.target.value})}/>
            <textarea className="form-control" placeholder="Descripción" value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/>
            <button className="btn btn-brand" type="submit">Guardar</button>
            {form.id && <button type="button" className="btn btn-outline-secondary" onClick={()=>setForm({id:null,name:'',price:'',description:''})}>Cancelar</button>}
          </form>
        </div></div>
      </div>
      <div className="col-md-7">
        <div className="table-responsive">
          <table className="table table-striped align-middle">
            <thead><tr><th>ID</th><th>Nombre</th><th>Precio</th><th></th></tr></thead>
            <tbody>
              {items.map(p=> (
                <tr key={p.id}>
                  <td>{p.id}</td><td>{p.name}</td><td>${'{'}p.price{'}'}</td>
                  <td className="text-end">
                    <button className="btn btn-sm btn-outline-primary me-2" onClick={()=>editItem(p)}>Editar</button>
                    <button className="btn btn-sm btn-outline-danger" onClick={()=>removeItem(p.id)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function AdminUsuarios({auth}){
  const [users,setUsers] = useState([])
  const headers = { 'Authorization': `Bearer ${auth.token}` }
  const load = ()=> fetch(`${API}/api/users`,{headers}).then(r=>r.json()).then(setUsers)
  useEffect(()=>{ load() },[])
  const setRole = async (id,role)=>{
    await fetch(`${API}/api/users/${id}/role`,{ method:'PUT', headers:{...headers,'Content-Type':'application/json'}, body: JSON.stringify({role}) })
    load()
  }
  return (
    <div className="table-responsive">
      <table className="table table-striped align-middle">
        <thead><tr><th>ID</th><th>Nombre</th><th>Email</th><th>Rol</th><th></th></tr></thead>
        <tbody>
          {users.map(u=> (
            <tr key={u.id}>
              <td>{u.id}</td><td>{u.name}</td><td>{u.email}</td><td><span className="badge text-bg-secondary">{u.role}</span></td>
              <td className="text-end">
                {u.role!=='admin' && <button className="btn btn-sm btn-outline-primary me-2" onClick={()=>setRole(u.id,'admin')}>Hacer admin</button>}
                {u.role!=='user' && <button className="btn btn-sm btn-outline-secondary" onClick={()=>setRole(u.id,'user')}>Hacer usuario</button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function App(){
  const auth = useAuth()
  return (
    <BrowserRouter>
      <Navbar auth={auth}/>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/productos" element={<Productos/>} />
        <Route path="/login" element={<Login auth={auth}/>} />
        <Route path="/registro" element={<Registro/>} />
        <Route path="/admin" element={<Admin auth={auth}/>} />
        <Route path="*" element={<Navigate to="/" replace/>} />
      </Routes>
    </BrowserRouter>
  )
}
