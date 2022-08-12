import React, { useContext } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import { Dashboard } from '../page/Dashboard/index'
import { Login } from '../components/Login/Login'
import { ListaUsuarios } from '../page/Usuarios/ListaUsuarios'
import { UsuariosForm } from '../page/UsuariosForm/UsuariosForm';
import { ProdutosForm } from '../page/ProdutosForm/ProdutosForm';

import { Context } from '../Context/AuthContext'

function CustomRoute({isPrivate, ...rest}){
  const { authenticated} = useContext(Context)
  if(isPrivate && !authenticated){
    return <Redirect to="/" />
  }

  return <Route { ...rest} />

}

export default function PrivateRoute(){

  return(

    <Switch>
      <CustomRoute exact path="/" component={Login}/>
      <CustomRoute isPrivate path="/dashboard" component={Dashboard}/>
      <CustomRoute isPrivate path="/usuarios/novo" component={UsuariosForm} />
      <CustomRoute isPrivate path="/usuarios/editar/:id" component={UsuariosForm} />
      <CustomRoute isPrivate path="/usuarios" component={ListaUsuarios} />
      <CustomRoute path="/produtos/novo" component={ProdutosForm} />
    </Switch>
    
  )
}