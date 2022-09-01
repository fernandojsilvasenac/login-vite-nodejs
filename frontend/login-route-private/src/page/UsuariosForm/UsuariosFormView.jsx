import React, { useState, useEffect } from "react";
import api from '../../services/api';
import { useHistory } from 'react-router-dom';
import { Form, Button, Container, Alert, FloatingLabel } from 'react-bootstrap';
import { NavBar } from '../../components/UI/NavBar/NavBar'

const initialValue = {
    name: '',
    email: '',
}

export const UsuariosFormView = () => {

    const history = useHistory();

    const [values, setValues] = useState(initialValue);
    const [status, setStatus] = useState({
        type: '',
        mensagem: '',
        loading: false
    })
    const [image, setImage] = useState("");
    const [endImage, setEndImage] = useState("");


    useEffect(() => {

        const getUser = async () => {
            const headers = {
                'headers': {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
            }
            // console.log(localStorage.getItem('user'));

            await api.get("/user/view-profile/" + localStorage.getItem('user'), headers)
                .then((response) => {
                    // console.log(response.data.users);
                    if (response.data.users) {
                        setValues(response.data.users);
                        setEndImage(response.data.endImagem);
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
        getUser();

    }, [])

    const formSubmit = async e => {
        e.preventDefault();
        setStatus({ loading: true });

        const headers = {
            'headers': {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
        }

        const formData = new FormData();
        formData.append('image', image);

            await api.put("/user/edit-profile-image", formData, headers)
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

    return (
        <>
            <NavBar />
            <Container className="box">
                <Form onSubmit={formSubmit} className="borderForm">
                    <h2>Usuário</h2>

                    {status.type == 'error'
                        ? <Alert variant="danger">{status.mensagem}</Alert>
                        : ""}
                    {status.type == 'success'
                        ? <Alert variant="success">{status.mensagem}</Alert>
                        : ""}

                    {status.loading ? <Alert variant="warning">Enviando...</Alert> : ""}
                    <FloatingLabel
                        controlId="floatingInput"
                        label="Name"
                        className="mb-3"
                    >
                        <Form.Control type="text" value={values.name}/>
                    </FloatingLabel>

                    <FloatingLabel
                        controlId="floatingInput"
                        label="E-mail"
                        className="mb-3"
                    >
                        <Form.Control type="text" value={values.email}/>
                    </FloatingLabel>

                    <Form.Group className="mb-3" controlId="formBasicImage">
                        <Form.Label>
                            *Imagem:
                        </Form.Label>
                        <Form.Control type="file" name="image" 
                        onChange={(e) => setImage(e.target.files[0])}
                        />
                    </Form.Group>
                    {image ? 
                        (
                            <img 
                                src={URL.createObjectURL(image)}
                                alt="Imagem do usuário"
                                width="150"
                                height="150"
                            />
                        ) : (
                            <img 
                                src={endImage}
                                alt="Imagem do usuário"
                                width="150"
                                height="150"
                            />    
                        )
                    }

                    {status.loading
                        ? <Button variant="primary" disabled type="submit">Enviando...</Button>
                        : <Button variant="primary" type="submit">Enviar</Button>
                    }

                </Form>
            </Container>
        </>
    )
}