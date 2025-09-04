# SME-Prova-Serap-Itens-Frontend

1 - instalar o nvm para o node
    instalar seguindo as instruções neste site https://github.com/coreybutler/nvm-windows
    nvm install 22
    nvm use 22

2 - Criar um arquivo lauch.json com este conteudo para o botão play do vscode funcionar

    {
        // Use IntelliSense to learn about possible attributes.
        // Hover to view descriptions of existing attributes.
        // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
        "version": "0.2.0",
        "configurations": [

            {
                "type": "chrome",
                "request": "launch",
                "name": "Launch Chrome against localhost",
                "url": "http://localhost:3000",
                "webRoot": "${workspaceFolder}"
            }
        ]
    }

2 - rodar os seguinte comandos para executar o projeto
    npm i -g yarn
    yarn --version
    yarn install
    yarn dev