import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import api from "../../services/api";
import { Table, Container, Button, Alert } from 'react-bootstrap';
import { NavBar } from '../../components/UI/NavBar/NavBar'
import './styles.css'
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { useHistory } from 'react-router-dom';


export const ListaCategories = () =>{
    const history = useHistory();

    const [data, setData] = useState([]);
    const [page, setPage] = useState("");
    const [lastPage, setLastPage] = useState("");

    const [status, setStatus] = useState({
        type:'',
        mensagem:'',
        loading: true
    });

    const confirmDelete = (categories) => {
    
        confirmAlert({
          title: "Excluir Categorias",
          message:
            "Deseja Excluir a Categoria " +
            categories.name +
            "?",
          buttons: [
            {
              label: "Sim",
              onClick: () => handleDelete(categories.id)
            },
            {
              label: "Não",
              onClick: () => history.push('/dashboard')
            }
          ]
        });
      };

    const handleDelete = async (idCategories) =>{
        const headers = {
            'headers': {
                'Authorization': 'Bearer ' + localStorage.getItem('token')

            },
        }          
        await api.delete("/categories/show/"+idCategories, headers)
        .then((response) =>{
            setStatus({
                type:'success',
                mensagem: response.data.mensagem,
                loading:true
            })
            getCategories();

        }).catch((err) =>{
            if(err.response){
                setStatus({
                    type:'error',
                    mensagem: err.response.data.mensagem
                })
            } else {
                setStatus({
                    type:'error',
                    mensagem: 'Erro: Tente mais tarde!'
                })
            }
        })        
    }


    const getCategories = async (page) =>{
        if (page === undefined) {
            page = 3
        }
        setPage(page);

        const headers = {
            'headers': {
                'Authorization': 'Bearer ' + localStorage.getItem('token')

            },
        }   
        
        await api.get("/categories/all/pages/" + page, headers)
        .then((response) =>{
            setData(response.data.categories);
            setLastPage(response.data.lastPage);
            setStatus({loading:false})
        }).catch((err) =>{
            if(err.response){
                setStatus({
                    type:'error',
                    mensagem: err.response.data.mensagem
                })
            } else {
                setStatus({
                    type:'error',
                    mensagem: 'Erro: Tente mais tarde!'
                })
            }
        })
    }

    useEffect( () =>{
        getCategories();
    }, [])


    return(
        <>
            <NavBar />                    
            <Container>
            {status.loading ? <Alert variant="warning">Carregando...</Alert> : ""}
            <div className="btnNovo">
            <h1>Categorias</h1>
            <Button variant="outline-success">
                <Link className="noLink" to="/usuarios/novo">Novo Categoria</Link>
            </Button>
            </div>
            <Table striped bordered hover>  
            <thead>
                <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Descrição</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
            {(!status.loading &&
                data.map(categorie =>(
                    <tr key={categorie.id}>
                        <td>{categorie.id}</td>
                        <td>{categorie.name}</td>
                        <td>{categorie.description}</td>
                        <td className="spaceFlex">
                        <Button variant="outline-warning">
                            <Link className="noLink " to={"/categories/edit/"+categorie.id}>Editar</Link>
                        </Button>
                        <Button variant="outline-danger" onClick={() => confirmDelete(categorie)}>
                            Excluir
                        </Button>
                        </td>
                    </tr>
                ))

            )}
            </tbody>
            </Table>
            {/* primeira página */}
            {
                page !== 1
                ? <Button type="button" onClick={ () => getCategories(1)}>Primeira</Button>
                : <Button type="button" disabled>Primeira</Button>                
            }{" "}

            {/* antes da pagina que o usuário está */}
            {
                page !== 1
                ? <Button type="button" onClick={ () => getCategories(page -1)}>{page -1}</Button>
                : ""
            }{" "}


            {/* página atual */}
            <Button type="button" disabled>{page}</Button>{" "}

            
            {/* página depois da página atual */}

            { page + 1 <= lastPage
                ? <Button type="button" onClick={ () => getCategories(page + 1)}>{page+1}</Button>
                : ""
            }{" "}


            {/* ultima página */}
            { page !== lastPage 
                ? <Button type="button" onClick={ () => getCategories(lastPage)}>Ultima</Button>
                : <Button type="button" disabled>Ultima</Button>
            }
            

        </Container>
        </>
    )
}




