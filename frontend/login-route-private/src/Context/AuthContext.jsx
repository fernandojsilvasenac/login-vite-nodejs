import React , {createContext, useState, useEffect} from 'react'
import api from '../services/api'

const Context = createContext()

function AuthProvider({children}){
  const [authenticated, setAuthenticated] = useState(false)
  const [loading , setLoading] = useState(true)

  useEffect(() =>{

    const getLogin =  () =>{
      const token = localStorage.getItem('token')
      if(token  && validatedToken()){
        api.defaults.headers.Authorization = `Bearer ${(token)}`
        setAuthenticated(true)
      }
      setLoading(false)
    }

    getLogin()

  }, [])

  const validatedToken =  async () =>{
    const valueToken = localStorage.getItem('token')

    const headers = {
      'headers': {
        'Authorization' : 'Bearer ' + valueToken
      }
    }
    await api.get("/validaToken", headers)
    .then(()=>{
      return true
    }).catch(()=>{
      setAuthenticated(false)
    localStorage.removeItem('token')
    api.defaults.headers.Authorization =  undefined
      return false
    })
  }

  function signIn(state){
    setAuthenticated(true)
  }

  if(loading){
    return <h1>Carregando...</h1>

  }
  function handleLogout(){
    setAuthenticated(false)
    localStorage.removeItem('token')
    api.defaults.headers.Authorization =  undefined
  }

  return(
    <Context.Provider value={{authenticated , signIn, handleLogout}}>
      {children}
    </Context.Provider>
  )

}

export { Context, AuthProvider } 