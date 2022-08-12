import React, { useState, useEffect } from "react";
import api from '../../services/api';
import { useHistory } from 'react-router-dom';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import { NavBar } from '../../components/UI/NavBar/NavBar'

const initialValue = {
    name: '',
    description: '',
    quantity: 0,
    price: 0,
    categorieId: ''

}

export const ProdutosForm = (props) => {

    const history = useHistory();

    const [id] = useState(props.match.params.id);
    const [procucts, setProducts] = useState(initialValue);
    const [categories, setCategories] = useState([]);
    const [acao, setAcao] = useState('Novo');
    const [status, setStatus] = useState({
        type: '',
        mensagem: '',
        loading: false
    })


    const valorInput = e => setProducts({
        ...values,
        [e.target.name]: e.target.value
    })

    const valorSelect = e => setProducts({
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
                        // setValues(response.data.user);
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
        // if (id) getUser();
   

    }, [])

    const getCategories = async () => {
        const headers = {
            'headers': {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
        }

        await api.get("/categories/all" , headers)
            .then((response) => {
                if (response.data.categories) {
                    setCategories(response.data.categories);
                } else {
                    setStatus({
                        type: 'warning',
                        mensagem: 'Categorias não encontrada!!!',
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
    useEffect( () => {
        getCategories()
    },[])
    
    

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
            await api.post("/products/create", values, headers)
                .then((response) => {
                    setStatus({ loading: false })
                    return history.push('/dashboard')
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
            await api.put("/products/update", values, headers)
                .then((response) => {
                    setStatus({ loading: false })
                    return history.push('/dashboard')
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
                    <h2>{acao} Produtos</h2>

                    {status.type == 'error'
                        ? <Alert variant="danger">{status.mensagem}</Alert>
                        : ""}
                    {status.type == 'success'
                        ? <Alert variant="success">{status.mensagem}</Alert>
                        : ""}

                    {status.loading ? <Alert variant="warning">Enviando...</Alert> : ""}

                    <Form.Group className="mb-3" controlId="formBasicName">
                        <Form.Label>Nome do Produto</Form.Label>
                        <Form.Control type="text" name="name" value={procucts.name} onChange={valorInput} placeholder="Entre com seu Nome" />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicDescrition">
                        <Form.Label>Descrição do Produto</Form.Label>
                        <Form.Control type="text" name="description" value={procucts.description} onChange={valorInput} placeholder="Descrição do Produtos" />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicDescrition">
                        <Form.Label>Quantidade</Form.Label>
                        <Form.Control type="number" name="quantity" value={procucts.quantity} onChange={valorInput}  />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicDescrition">
                        <Form.Label>Preço</Form.Label>
                        <Form.Control type="text" name="price" value={procucts.price} onChange={valorInput}  />
                    </Form.Group>

                    <Form.Select aria-label="categorieId" 
                    name="categorieId"
                    onChange={valorSelect} value={procucts.categorieId}>
                        <option>Selecione uma Categoria</option>
                        {categories.map(categorie => (
                            <option key={categorie.id} value={categorie.id}>{categorie.name}</option>
                        ))}
                    </Form.Select>

                    {status.loading
                        ? <Button variant="primary" disabled type="submit">Enviando...</Button>
                        : <Button variant="primary" type="submit">Enviar</Button>
                    }

                </Form>
            </Container>
        </>
    )
}