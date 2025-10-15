import { Button } from "antd";
import React from "react";
import { useOutletContext } from "react-router";

const CadastrarItemNovoElaboracao = () => {

    const { form, handleVoltarPrimeiraPagina } = useOutletContext<any>();

    const handleVoltarClick = () => {
        console.log("🔙 Dados do form ao voltar:", form.getFieldsValue());
        handleVoltarPrimeiraPagina();
    };


    return (
        <div>
            <h1>Cadastrar Item Novo - Elaboração</h1>
            <Button onClick={handleVoltarClick}>Voltar para Página 1</Button>
        </div>
    );
};

export default CadastrarItemNovoElaboracao;
