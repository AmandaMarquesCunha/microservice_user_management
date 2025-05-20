# UsersAddresses

Sistema web para gestão de usuários e endereços, desenvolvido em Angular 15.

## Funcionalidades

- **Autenticação de Usuário:**
  - Login com email e senha.
  - Cadastro de novos usuários.
- **Gestão de Usuários (apenas para administradores):**
  - Listagem paginada de usuários.
  - Criação, edição e exclusão de usuários.
  - Atribuição de perfis (ADMIN, USER).
- **Gestão de Endereços:**
  - Listagem paginada de endereços.
  - Criação, edição e exclusão de endereços vinculados a usuários.
  - Busca automática de dados pelo CEP.
- **Perfil do Usuário:**
  - Visualização e edição dos próprios dados.
  - Visualização e gerenciamento dos próprios endereços.
- **Interface Moderna:**
  - Utilização de Bootstrap para modais e layout responsivo.
  - Feedback visual com Toastr para notificações.

## Requisitos

- Node.js >= 16.x
- Angular CLI >= 15.x
- Bootstrap 5
- ngx-toastr

## Instalação

1. Clone o repositório:
   ```bash
   git clone <repo-url>
   cd users-addresses
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Execute o servidor de desenvolvimento:
   ```bash
   npm start
   ```
   Acesse `http://localhost:4200/` no navegador.

## Scripts Disponíveis

- `npm start` — Inicia o servidor de desenvolvimento.
- `npm test` — Executa os testes unitários.
- `ng build` — Realiza o build de produção.

## Estrutura Principal

- `src/app/pages/login` — Tela de login e cadastro.
- `src/app/pages/users` — Listagem, formulário e perfil de usuários.
- `src/app/pages/addresses` — Listagem e formulário de endereços.
- `src/app/components` — Componentes reutilizáveis (navbar, tabela, spinner).
- `src/app/services` — Serviços para autenticação, usuários e endereços.

## Configuração do ambiente

No arquivo `src/environments/environment.ts`, configure a URL da API local conforme o exemplo abaixo:

```typescript
export const environment = {
  production: false,
  apiUrl: "http://localhost:8080/api",
};
```

Certifique-se de que a propriedade `apiUrl` aponte para a rota local do backend utilizada pela aplicação.

## Observações

- Apenas usuários autenticados podem acessar as funcionalidades.
- Apenas administradores podem gerenciar outros usuários.
- O sistema utiliza modais para formulários e confirmações.

## Licença

Este projeto é apenas para fins de estudo e demonstração.
