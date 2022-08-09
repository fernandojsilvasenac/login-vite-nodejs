import React, { useState, useEffect } from "react";
import api from '../../services/api';
import { useHistory } from 'react-router-dom';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import { NavBar } from '../../components/UI/NavBar/NavBar'

const initialValue = {
    name: '',
    email: '',
    password: ''
}

export const UsuariosForm = (props) => {

    const history = useHistory();

    const [id] = useState(props.match.params.id);
    const [values, setValues] = useState(initialValue);
    const [acao, setAcao] = useState('Novo');
    const [status, setStatus] = useState({
        type: '',
        mensagem: '',
        loading: false
    })


    const valorInput = e => setValues({
        ...values,
        [e.target.name]: e.target.value
    })

    useEffect(() => {

        const getUser = async () => {
            const headers = {
                'headers': {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
            }

            await api.get("/user/" + id, headers)
                .then((response) => {
                    if (response.data.user) {
                        setValues(response.data.user);
                        setAcao('Editar');
                    } else {
                        setStatus({
                            type: 'warning',
                            mensagem: 'Usuário não encontrado!!!',
                        })
                    }
                }).catch((err) => {
                    if (err.response) {
                        setStatus({
                            type: 'error',
                            mensagem: err.response.data.mensagem
                        })
                    } else {
                        setStatus({
                            type: 'error',
                            mensagem: 'Erro: Tente mais tarde!'
                        })
                    }
                })
        }
        if (id) getUser();

    }, [id])

    const formSubmit = async e => {
        e.preventDefault();
        setStatus({ loading: true });

        const headers = {
            'headers': {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
        }

        if(!id){
            await api.post("/user", values, headers)
                .then((response) => {
                    setStatus({ loading: false })
                    return history.push('/usuarios')
                }).catch((err) => {
                    if (err.response) {
                        setStatus({
                            type: 'error',
                            mensagem: err.response.data.mensagem,
                            loading: false
                        })
                    } else {
                        setStatus({
                            type: 'error',
                            mensagem: 'Erro: tente mais tarde',
                            loading: false
                        })
                    }

                })
        } else {
            await api.put("/user", values, headers)
                .then((response) => {
                    setStatus({ loading: false })
                    return history.push('/usuarios')
                }).catch((err) => {
                    if (err.response) {
                        setStatus({
                            type: 'error',
                            mensagem: err.response.data.mensagem,
                            loading: false
                        })
                    } else {
                        setStatus({
                            type: 'error',
                            mensagem: 'Erro: tente mais tarde',
                            loading: false
                        })
                    }

                })
        }    

    }

    return (
        <>
            <NavBar />
            <Container className="box">
                <Form onSubmit={formSubmit} className="borderForm">
                    <h2>{acao} Usuário</h2>

                    {status.type == 'error'
                        ? <Alert variant="danger">{status.mensagem}</Alert>
                        : ""}
                    {status.type == 'success'
                        ? <Alert variant="success">{status.mensagem}</Alert>
                        : ""}

                    {status.loading ? <Alert variant="warning">Enviando...</Alert> : ""}

                    <Form.Group className="mb-3" controlId="formBasicName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="name" name="name" value={values.name} onChange={valorInput} placeholder="Entre com seu Nome" />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" name="email" value={values.email} onChange={valorInput} placeholder="Entre com seu email" />
                        <Form.Text className="text-muted">
                            Nunca compartilharemos seu e-mail com mais ninguém.
                        </Form.Text>
                    </Form.Group>
                    {!id &&
                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Senha</Form.Label>
                            <Form.Control type="password" name="password" onChange={valorInput} placeholder="Digite sua senha" />
                        </Form.Group>
                    }
                    <Form.Group className="mb-3" controlId="formBasicCheckbox">
                        {/* <Form.Check type="checkbox" label="Check me out" /> */}
                    </Form.Group>
                    {status.loading
                        ? <Button variant="primary" disabled type="submit">Enviando...</Button>
                        : <Button variant="primary" type="submit">Enviar</Button>
                    }

                </Form>
            </Container>
        </>
    )
}