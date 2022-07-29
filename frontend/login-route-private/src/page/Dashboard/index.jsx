import React, {useContext} from "react";
import { Context } from '../../Context/AuthContext'
import { Link } from 'react-router-dom'
import { Container, Button} from 'react-bootstrap'

export const Dashboard = () =>{

  const token = localStorage.getItem("token");
  const { authenticated,handleLogout}  = useContext(Context)

  return(
    <>
        <Container>
        <ul>
          <li>
            <Link to="/dashboard">Dashboard</Link>
          </li>
          <li>
            <Link to="/usuarios">Usuários</Link>
          </li>
          
            
        </ul>

      <h1>Dashboard</h1>
      <Button variant="dark" onClick={handleLogout}>Sair</Button>
      </Container>
    </>
  )
}