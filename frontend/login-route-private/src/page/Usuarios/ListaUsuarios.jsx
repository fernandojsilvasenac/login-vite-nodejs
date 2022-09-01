import React, { useEffect, useState, useContext } from "react";
import { Link } from 'react-router-dom';
import api from "../../services/api";
import { Context } from "../../Context/AuthContext";
import { Table, Container, Button, Alert } from 'react-bootstrap';
import { NavBar } from '../../components/UI/NavBar/NavBar'
import './styles.css'
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { useHistory } from 'react-router-dom';


export const ListaUsuarios = () =>{
    const { authenticated, handleLogout} = useContext(Context);
    const history = useHistory();

    const URL_IMG = 'http://localhost:3032';
    const image = URL_IMG + '/files/users/';
    const avatar = 'avatar-icon.png';

    const [data, setData] = useState([]);

    const [status, setStatus] = useState({
        type:'',
        mensagem:'',
        loading: true
    });

    const confirmDelete = (user) => {
    
        confirmAlert({
          title: "Excluir Usuários",
          message:
            "Deseja Excluir o usuário " +
            user.name +
            "?",
          buttons: [
            {
              label: "Sim",
              onClick: () => handleDelete(user.id)
            },
            {
              label: "Não",
              onClick: () => history.push('/dashboard')
            }
          ]
        });
      };

    const handleDelete = async (idUser) =>{
        const headers = {
            'headers': {
                'Authorization': 'Bearer ' + localStorage.getItem('token')

            },
        }          
        await api.delete("/user/"+idUser, headers)
        .then((response) =>{
            setStatus({
                type:'success',
                mensagem: response.data.mensagem,
                loading:true
            })
            getUsers();

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


    const getUsers = async () =>{

        const headers = {
            'headers': {
                'Authorization': 'Bearer ' + localStorage.getItem('token')

            },
        }   
        
        await api.get("/user/all", headers)
        .then((response) =>{
            setData(response.data.users);
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
        getUsers();
    }, [])


    return(
        <>
            <NavBar />                    
            <Container>
            {status.loading ? <Alert variant="warning">Carregando...</Alert> : ""}
            <div className="btnNovo">
            <h1>Usuários</h1>
            <Button variant="outline-success">
                <Link className="noLink" to="/usuarios/novo">Novo Usuário</Link>
            </Button>
            </div>
            <Table striped bordered hover>  
            <thead>
                <tr>
                    <th>#</th>
                    <th>Foto</th>
                    <th>Name</th>
                    <th>E-mail</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
            {(!status.loading &&
                data.map(user =>(
                    <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>
                            {user.image ? 
                                (
                                    <a href={image+user.image} target="_blank" rel="noopener noreferrer">
                                        <img width='50' height='50' src={image+user.image}></img>
                                    </a>
                                ) : (
                                    <img width='50' height='50' src={image+avatar}></img>
                                )
                            }
                        </td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td className="spaceFlex">
                        <Button variant="outline-warning">
                            <Link className="noLink " to={"/usuarios/editar/"+user.id}>Editar</Link>
                        </Button>
                        <Button variant="outline-danger" onClick={() => confirmDelete(user)}>
                            Excluir
                        </Button>
                        </td>
                    </tr>
                ))

            )}
            </tbody>
            </Table>            
        </Container>
        </>
    )
}




