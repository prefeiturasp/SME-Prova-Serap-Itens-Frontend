import { Button } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";

const ListarItemNovo = () => {
    const navigate = useNavigate();

    const handleNovoItem = () => {
        // Vai para o formulário no modo "criação"
        navigate('/itens/novo/pagina1');
    };
    return (
        <div>
            <h1>Listar Item </h1>
            <Button type="primary" onClick={handleNovoItem}>
                + Novo Item
            </Button>
        </div>
    );
};

export default ListarItemNovo;
