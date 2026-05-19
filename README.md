# Sistema de Gerenciamento de Planos de Aula - API Backend

Esta é a API RESTful robusta desenvolvida para gerenciar o ecossistema do Sistema de Planos de Aula. O sistema lida com a persistência de dados em banco relacional, validação estrita de dados antes da inserção e fornece os endpoints necessários para o ecossistema do frontend.

## 🚀 Tecnologias Utilizadas

- **Node.js**: Ambiente de execução para JavaScript no servidor.
- **Express**: Framework para roteamento de requisições HTTP e gerenciamento de middlewares.
- **Sequelize (ORM)**: Mapeamento objeto-relacional para abstração e consultas ao banco de dados.
- **Zod**: Biblioteca de validação de esquemas para garantir a integridade dos dados trafegados.
- **Dotenv**: Componente para carregamento seguro de variáveis de ambiente do sistema.
- **CORS**: Middleware configurado para liberação de acessos de origens externas controladas.

## 📋 Funcionalidades Técnicas

- **Persistência de Dados Estruturados:** Manipulação avançada de arrays nativos (como conteúdos, tags e recursos) convertidos em estruturas de dados relacionais e JSON.
- **Validação de Payload Dinâmica:** Tratamento e resposta automatizada com status `400 Bad Request` detalhando falhas de preenchimento de campos obrigatórios ou formatos incorretos.
- **Ordenação Nativa:** Rota de listagem configurada para priorizar o retorno cronológico estável por ID decrescente diretamente na consulta ao banco de dados.

## 🔧 Instalação e Execução Local

### Pré-requisitos
- Node.js instalado (versão 16 ou superior).

### Passos para Configuração

## ⚠️ Atenção: Estrutura do Repositório

Devido a uma duplicação durante o envio dos commits, os arquivos atualizados da aplicação encontram-se isolados dentro do diretório `/api`. Os arquivos localizados na raiz deste repositório estão desatualizados.

1. Clone este repositório e acesse a pasta raiz:
   ```bash
   cd lesson-plan-manager-api/api
Instale as dependências listadas no projeto: npm install
Crie um arquivo .env na raiz do diretório do backend e configure os parâmetros:
PORT=
DB_DIALECT=sqlite
DB_STORAGE=database.sqlite
Inicie o servidor da API: npm run dev
O terminal exibirá a confirmação de inicialização na porta configurada.
🛣️ Estrutura de Endpoints da API

HTTP
GET /
Descrição: Retorna o status operacional da API e a hora atual do servidor para monitoramento de integridade.

Resposta Sucesso (200 OK): ```json
{ "status": "OK", "timestamp": "2026-05-18T23:28:37.000Z" }


HTTP
GET /planos
Descrição: Recupera todos os registros de planos de aula salvos. Retorna os itens em ordem decrescente de ID (mais recentes primeiro).

Resposta Sucesso (200 OK): Array contendo os objetos de planos de aula.

HTTP
POST /planos
Descrição: Valida a estrutura dos dados via esquema do Zod e realiza a inserção de um novo plano de aula no banco de dados.

Payload Necessário: Objeto JSON completo contendo todos os campos do modelo.

Resposta Sucesso (201 Created): Retorna o objeto do plano recém-criado, incluindo o id gerado automaticamente.

HTTP
PUT /planos/:id
Descrição: Atualiza de forma integral os dados cadastrais de um plano de aula existente correspondente ao parâmetro :id.

Payload Necessário: Objeto JSON com as novas informações a serem aplicadas.

Resposta Sucesso (200 OK): Confirmação da alteração com os dados atualizados.

HTTP
DELETE /planos/:id
Descrição: Remove de forma definitiva o registro de plano de aula do banco de dados correspondente ao parâmetro :id.

Resposta Sucesso (200 OK): Mensagem de confirmação da remoção.

💾 Modelo de Dados Aceito (JSON)
Abaixo encontra-se a estrutura exigida pelas rotas POST e PUT:

JSON
{
  "titulo": "Estruturas de Dados Dinâmicas",
  "disciplina": "Algoritmos",
  "dataPrevista": "2026-05-20",
  "objetivo": "Compreender o gerenciamento de ponteiros e nós em memória através de listas encadeadas.",
  "ementa": "Alocação dinâmica, ponteiros, estruturas de nós e operações de inserção/remoção em listas simples.",
  "conteudos": [
    "Ponteiros em C/C++",
    "Conceito de Nó de Memória",
    "Listas Encadeadas Simples"
  ],
  "recursosApoio": [
    "Quadro branco",
    "IDE para demonstração prática"
  ],
  "tags": [
    "Algoritmos",
    "Ponteiros",
    "Estrutura de Dados"
  ]
}