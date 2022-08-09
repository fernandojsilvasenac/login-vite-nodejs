import React, {useState, useContext} from "react";
import { useHistory } from 'react-router-dom';
import {Button, Form, Container , Alert} from 'react-bootstrap'  
import './styles.css';
import api from '../../services/api';

import { Context } from '../../Context/AuthContext';

export function Login(){
    const history = useHistory();

    const { authenticated, signIn } = useContext(Context);

    const [user, setUser] = useState(
        {
            email: '',
            password:''
        }
    )

    const [status, setStatus] = useState({
        type: '',
        mensagem: '',
        loading: false
    })

    const valorInput = e => setUser({ 
        ...user, 
        [e.target.name]: e.target.value
    })

    const loginSubmit = async e =>{
        e.preventDefault();
    
        setStatus({
            loading:true
        });

        const headers = {
            'Content-Type': 'application/json'
        }

        await api.post("/login", user, {headers})
        .then((response) =>{
            setStatus({
                loading:false
            });

            localStorage.setItem('token', response.data.token);    
            signIn(true);
            return history.push('/dashboard');

        }).catch((err) =>{
            setStatus({
              type:'error',
              mensagem: 'Erro: tente mais tarde',
              loading:false
            })
            if(err.response){
                setStatus({
                    type:'error',
                    mensagem: err.response.data.mensagem,
                    loading:false
                })
            } 
    
        })

    }


    return (
        <>
        <Container className="box">
            <h1>Login</h1>
            <Form onSubmit={loginSubmit} className="borderForm">

            {status.type == 'error' 
            ? <Alert variant="danger">{status.mensagem}</Alert> 
            : ""}
            {status.type == 'success' 
            ? <Alert variant="success">{status.mensagem}</Alert> 
            : ""}
            
            {status.loading ? <Alert variant="warning">Validando...</Alert>: "" }

            <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" name="email" onChange={valorInput} placeholder="Entre com seu email" />
                <Form.Text className="text-muted">
                Nunca compartilharemos seu e-mail com mais ninguém.
                </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Senha</Form.Label>
                <Form.Control type="password" name="password" onChange={valorInput} placeholder="Digite sua senha" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicCheckbox">
                {/* <Form.Check type="checkbox" label="Check me out" /> */}
            </Form.Group>
            {status.loading 
            ? <Button variant="primary" disabled type="submit">Acessando...</Button>
            : <Button variant="primary" type="submit">Acessar</Button>
            }
            
            </Form>            
        </Container>
        </>
    )
}