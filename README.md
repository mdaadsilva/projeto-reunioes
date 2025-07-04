# Projeto 1: Sistema de Agendamento de Reuniões

Aplicação Full-Stack desenvolvida para gerenciar o agendamento de salas de reunião, como parte de um processo de avaliação de habilidades.

## Funcionalidades Implementadas

* **API Backend (ASP.NET Core)**
    * CRUD completo para Salas.
    * CRUD completo para Reservas (Criar, Listar, Cancelar, Reagendar).
    * Validação de regras de negócio (conflito de horários, horário comercial).
    * Endpoints de agregação para estatísticas (total de reuniões, horas livres).
    * Persistência de dados com NHibernate e PostgreSQL.

* **Interface Frontend (React)**
    * Dashboard para gerenciamento de Salas com tabela de dados (`DataGrid`).
    * Busca, ordenação e paginação de salas (server-side).
    * Criação, Edição e Exclusão de salas através de janelas de diálogo (modais).
    * Página dedicada para realizar novas reservas.
    * Visualização de reservas existentes por sala.
    * Design profissional e responsivo utilizando a biblioteca de componentes MUI.

## Tecnologias Utilizadas

* **Backend**: ASP.NET Core, C#, NHibernate, PostgreSQL.
* **Frontend**: React, Vite, MUI (Material-UI), Axios, React Router, Day.js.
* **Versionamento**: Git e GitHub.

## Pré-requisitos

* [.NET SDK](https://dotnet.microsoft.com/download) (versão 8.0 ou superior)
* [Node.js e npm/yarn](https://nodejs.org/) (versão 18 ou superior)
* [PostgreSQL](https://www.postgresql.org/download/)

## Como Executar o Projeto

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/mdaadsilva/projeto-reunioes
    ```

2.  **Configure o Banco de Dados:**
    * Crie um banco de dados no PostgreSQL chamado `reuniao`.
    * Execute o script `schema.sql` (que está na raiz do projeto) para criar as tabelas.

3.  **Execute o Backend (API):**
    * Navegue até a pasta da API: `cd backend`
    * Altere o arquivo `appsettings.json` com a sua senha do PostgreSQL.
    * Rode o comando: `dotnet run`
    * A API estará rodando em `https://localhost:7279` (ou outra porta especificada).

4.  **Execute o Frontend:**
    * Em um novo terminal, navegue até a pasta do frontend: `cd frontend`
    * Instale as dependências: `npm install` (ou `yarn`)
    * Rode o comando: `npm run dev` (ou `yarn dev`)
    * A aplicação estará acessível em `http://localhost:5173`.
