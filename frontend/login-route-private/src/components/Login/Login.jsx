import React, {useState, useContext} from 'react';
import { Container, Button, Form, Alert } from 'react-bootstrap';
import { Context } from '../../Context/AuthContext'
import api from '../../services/api';
import {useHistory} from 'react-router-dom';
import './styles.css';


export function Login(){

  const history = useHistory();

  const { authenticated, signIn } = useContext(Context);
  
  const [user, setUser] = useState({
    email: '',
    password: ''
  })

  const [status, setStatus] = useState({
    type: '',
    mensagem: '',
    loading: false
  })

  /* change dos imputs*/
  const valorInput = e => setUser({
    ...user,
    [e.target.name] : e.target.value
  })

  /* submissao do form */
  const loginSubmit = async e => {
    e.preventDefault();
    const headers = {
      'Content-Type': 'application/json'
    }
    setStatus({
      loading: true
    })
    await api.post("/login", user, {headers})
    .then((response)=>{
      setStatus({
        loading: false
      })
      localStorage.setItem('token', response.data.token)
      signIn(true)
      return history.push('/dashboard');
      
    }).catch((err)=>{
      
      setStatus({
        type: 'error',
        mensagem: 'Erro: tente mais tarde',
        loading: false
      })
      if(err.response){
        setStatus({
          type: 'error',
          mensagem: err.response.data.mensagem,
          loading: false
        })
      }
      
        

  })
}

  

  return(
    <>
      <Container className="box">
          <Form onSubmit={loginSubmit} className="borderForm">
          {status.type == 'error' ? <Alert size="big" variant="danger"><p>{status.mensagem}</p></Alert> : ""} 
          {status.type == 'success' ? <Alert variant="success"><p>{status.mensagem}</p> </Alert> : ""}
          {status.loading ? <p>Validando...</p> : ""}
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>E-mail:</Form.Label>
            <Form.Control type="email" name="email" placeholder="Digite seu e-mail" onChange={valorInput} />
            <Form.Text className="text-muted">
              Nunca compartilharemos seu e-mail com outra pessoa.
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Senha:</Form.Label>
            <div className="password">
              <Form.Control type="password" name="password" placeholder="Digite sua senha" onChange={valorInput} />
            </div>
            
          </Form.Group>
          {status.loading 
          ? <Button variant="primary" type="submit" disabled>Acessando... </Button>
          : <Button variant="primary" type="submit">Enviar </Button> 
          }
            
         
        </Form>

      </Container>
    </>
  )

  }