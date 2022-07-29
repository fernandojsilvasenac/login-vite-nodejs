import React, {useState, useEffect} from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api';
import { Table, Container } from 'react-bootstrap'

export const ListaUsuarios = () =>{

  const [data, setData] = useState([]);
  const [status, setStatus] = useState({
    type:'',
    mensagem: ''
  });

  const getUsers = async () =>{
    const headers = {
      'headers': {
        'Authorization' : 'Bearer ' +  localStorage.getItem('token')
      }
    }
    await api.get("/users", headers)
    .then((response)=>{
        setData(response.data.users)
    }).catch((error)=>{
      if(error.response){
        setStatus({
          type:'error',
          mensagem: error.response.data.mensagem
        })
      }else{
          setStatus({
            type:'error',
            mensagem: 'Erro: tente mais tarde'
          })
      }
    })
  }

  useEffect(()=>{
    getUsers()
  },[])

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

      <h1>Lista Usuários</h1>
      <Table striped bordered hover>
      <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Email</th>
        </tr>
      </thead>
      <tbody>
      {data.map(user => (
        <tr key={user.id}>
          <td>{user.id}</td>
          <td>{user.name}</td>
          <td>{user.email}</td>
        </tr>        


      ))}
      </tbody>
      </Table>  
      </Container>  
    </>

  )
}
 