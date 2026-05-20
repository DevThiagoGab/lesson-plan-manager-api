# 📚 Sistema de Gerenciamento de Planos de Aula com Smart Assist (IA)

Este é um sistema web completo desenvolvido para facilitar a criação, organização, filtragem e armazenamento de planos de aula. O grande diferencial do projeto é o **Smart Assist**, uma funcionalidade inteligente integrada ao **n8n** que consome a API do Google Gemini para sugerir automaticamente conteúdos, recursos de apoio e tags personalizadas com base apenas no título e na ementa informados pelo professor.

O projeto adota uma arquitetura desacoplada, dividida entre um ecossistema Frontend (`app`) e uma API REST Backend (`api`), garantindo facilidade de manutenção.

---

## 🚀 Funcionalidades Principais

* **Cadastro de Planos de Aula:** Armazenamento estruturado com título, disciplina, ementa, data, objetivo, conteúdos, recursos e tags.
* **Smart Assist (IA):** Preenchimento automático, inteligente e editável dos campos dinâmicos conteúdos, recursos e tags utilizando inteligência artificial.
* **Campos Dinâmicos:** Interface flexível que permite adicionar e remover múltiplos campos de conteúdos, recursos e tags em tempo real.
* **Listagem e Filtros Avançados:** Busca preditiva por título, filtros por disciplina, tags específicas e intervalo de datas.
* **Ordenação Inteligente:** Organização dos planos por ordem alfabética ou por data de cadastro no banco (mais recentes/antigos).

---

## 🛠️ Tecnologias Utilizadas

### Frontend (`app`)
* **HTML5 & CSS3:** Estrutura limpa, sem dependências de frameworks visuais pesados, priorizando a semântica e a organização.
* **JavaScript (Vanilla):** Manipulação dinâmica do DOM para criação/remoção de inputs e consumo assíncrono da API local via `fetch`.

### Backend (`api`)
* **Node.js & Express:** Ambiente de execução e framework para construção da API REST e gerenciamento de rotas.
* **Sequelize ORM:** Abstração, modelagem e gerenciamento de consultas do banco de dados através de objetos JavaScript.
* **SQLite:** Banco de dados relacional leve e baseado em arquivo, ideal para persistência local rápida e sem necessidade de configurações complexas de servidores de banco de dados.
* **ZOD:** Biblioteca de validação de dados.

### Automação & Inteligência Artificial
* **n8n:** Plataforma de *workflow automation* rodando localmente que atua como middleware seguro entre o backend do sistema e os servidores do Google.
* **Google Gemini 2.5 Flash:** Modelo de linguagem de última geração utilizado para analisar o escopo pedagógico da aula e retornar recomendações estritamente estruturadas em formato JSON.

---

## 📐 Arquitetura do Fluxo de Dados (Smart Assist)

O fluxo de integração da inteligência artificial opera da seguinte forma:
1. O usuário preenche os campos **Título do Plano**, **Disciplina** e **Ementa** no navegador e clica em **Gerar Recomendações com IA**.
2. O JavaScript do Frontend valida os dados e realiza uma requisição `POST` para o servidor Node.js local (`http://localhost:3000/api/smart-assist`).
3. A API Express recebe os dados e os repassa de forma segura para o endpoint do **Webhook do n8n**.
4. O n8n intercepta a requisição, aciona o nó **Basic LLM Chain** conectado ao modelo **Gemini 2.5 Flash** injetando o prompt acadêmico.
5. O Gemini processa a ementa e gera uma string JSON contendo as listas de sugestões.
6. O n8n devolve a resposta para a API Node.js, que repassa os dados limpos para o Frontend.
7. O Frontend realiza o parse do JSON e utiliza a função de manipulação de elementos dinâmicos para renderizar e preencher as caixas de texto automaticamente na tela.

---

## 🔧 Configuração do Ambiente e Execução

Para rodar e testar o projeto na sua máquina local, siga o passo a passo detalhado abaixo. O processo está dividido entre a preparação do ambiente, clonagem dos arquivos e inicialização dos serviços.

### Pré-requisitos Fundamentais
Antes de começar, certifique-se de ter instalado em sua máquina:
* **Git:** Para clonar e gerenciar os repositórios.
* **Node.js** (Versão 18 ou superior recomendada): Para rodar o ecossistema do backend.
* **n8n:** Plataforma de automação instalada e rodando localmente.

---

### 1. Clonando os Repositórios

Como o projeto adota uma arquitetura desacoplada, você precisará clonar os dois repositórios do ecossistema para a mesma máquina (ou para pastas organizadas de sua preferência).

Abra o seu terminal e execute os comandos abaixo para baixar os códigos:

# Crie ou acesse uma pasta de sua preferência para organizar o projeto
```bash
cd caminho/para/seus/projetos
```

# Clone o repositório do Backend (API)
git clone [https://github.com/DevThiagoGab/lesson-plan-manager-api.git](https://github.com/DevThiagoGab/lesson-plan-manager-api.git)

# Clone o repositório do Frontend (APP)
git clone [https://github.com/DevThiagoGab/lesson-plan-manager-app.git](https://github.com/DevThiagoGab/lesson-plan-manager-app.git)

### 2. Configurando e Executando a API (Backend)

### 2.1: Acessar a pasta do servidor
No terminal, entre na pasta do projeto que foi clonada
```bash
cd seu-repositorio-api
```

### 2.2: Instalar as dependências do Node.js
Instale todos os pacotes e frameworks necessários configurados no arquivo package.json (como express, sequelize, sqlite3, dotenv e cors). Este comando gerará automaticamente a pasta local node_modules:

```bash
npm install
```

### 2.3: Configurar as Variáveis de Ambiente (.env)
A API utiliza um arquivo oculto de configuração para evitar expor portas do servidor e URLs locais diretamente no código fonte.

Na raiz da pasta api, crie um arquivo chamado exatamente .env (certifique-se de incluir o ponto inicial e remover qualquer extensão como .txt).

Abra o arquivo em seu editor de código e configure as variáveis do .env.example:

### 2.4: Inicializar o Banco de Dados e o Servidor
O projeto utiliza o Sequelize com a sincronização automática ativada (sequelize.sync()). Isso significa que na primeira inicialização, o arquivo do banco de dados SQLite será criado e todas as tabelas serão estruturadas de forma automatizada, sem a necessidade de rodar scripts SQL manuais.

Para rodar o projeto utilizando o Nodemon (que monitora arquivos e reinicia o servidor automaticamente a cada alteração feita no código), execute:

```bash
npm run dev
```

### 2.5: Validar a Inicialização
Após rodar o comando, verifique se o terminal exibe as mensagens de sucesso confirmando o fluxo:

Servidor Express rodando com sucesso na porta 3000

Banco de dados SQLite sincronizado com sucesso!

Um arquivo de banco de dados (ex: database.sqlite) será gerado automaticamente na estrutura de pastas da sua API, confirmando que o sistema está pronto para salvar os planos de aula.

### 3: Configurando e Executando o APP (Frontend)

Navegue até a pasta do frontend:

```bash
cd caminho/para/o/app
```
Por se tratar de uma aplicação construída em JavaScript Puro (Vanilla) e HTML5, você não precisa rodar instaladores do npm neste diretório.

Certifique-se no início do arquivo script.js de que a constante ou endpoint de requisição aponta para o endereço correto da sua API local (http://localhost:3000).

Abra o arquivo index.html diretamente no seu navegador de preferência ou inicie-o utilizando a extensão Live Server do VS Code para desenvolvimento em tempo real.

### 4: Configurando o Workflow no n8n

Para que a inteligência artificial responda ao sistema, monte o seguinte fluxo gráfico no painel do seu n8n:

Nó Webhook: Configurado com o método POST e respondendo imediatamente ao receber os dados.

Nó Basic LLM Chain: Conectado ao nó do Webhook. No prompt, instrua a IA a ler as variáveis {{ $json.body.titulo }} e {{ $json.body.ementa }} enviadas pelo sistema.

Nó Google Gemini Chat Model: Conectado à base inferior da Chain. Configure suas credenciais da API Key do Google AI Studio e selecione explicitamente no campo Model (usando a opção Expression) o modelo: gemini-2.5-flash

### 4.1 Formato do Prompt: 
Certifique-se de exigir que o Gemini retorne estritamente um objeto JSON puro, sem blocos de código markdown, seguindo a estrutura exata abaixo:

Você é um assistente acadêmico especialista em planos de aula. Baseado nas informações abaixo, gere recomendações complementares.

Título da Aula: 
Disciplina: 
Ementa: 

Responda ESTRITAMENTE com um objeto JSON válido, sem blocos de código markdown (sem aspas triplas de crase ou a palavra "json"), contendo exatamente a seguinte estrutura:
{
  "conteudos": ["Item 1", "Item 2", "Item 3"],
  "recursosApoio": ["Recurso 1", "Recurso 2"],
  "tags": ["Tag1", "Tag2", "Tag3"]
}

Nó Respond to Webhook: Conectado ao final da Chain para devolver a string gerada pela IA de volta para a nossa API Node.js.

## 🔌 Documentação da API (Endpoints)

A API roda por padrão em `http://localhost:3000` e expõe os endpoints listados abaixo para gerenciamento dos planos de aula e integração com a Inteligência Artificial.

---

### 🟢 1. Monitoramento e Saúde da API
Verificação rápida para atestar se o servidor Express e os microsserviços estão online.

* **URL:** `/health` ou `/`
* **Método:** `GET`
* **Resposta de Sucesso (200 OK):**
  ```json
  { "active": true }

### 🔵 2. Listar Todos os Planos de Aula
Retorna todos os planos de aula persistidos no banco de dados SQLite, ordenados automaticamente pelos IDs mais recentes (DESC).

* **URL:** /planos
* **Método:** GET
* **Resposta de Sucesso (200 OK):**

### 🟢 3. Cadastrar Novo Plano de Aula
Realiza a validação estrita dos dados via Zod Schema e persiste o novo registro no banco de dados.

* **URL:** /planos
* **Método:** POST
* **Corpo da Requisição (Body JSON):**
* **Resposta de Sucesso (201 Created):** Retorna o objeto completo criado com o id gerado.

* **Respostas de Erro de Validação (400 Bad Request):**
Ocorre quando as regras do Zod (como tamanho mínimo ou formato de data) são violadas

### 🟡 4. Atualizar Plano de Aula (Completo ou Parcial)
Atualiza os dados de um plano existente com base no ID passado como parâmetro na URL. Os métodos PUT e PATCH aceitam atualizações parciais de forma segura.

* **URL:** /planos/:id (Exemplo: /planos/1)
* **Método:** PUT ou PATCH
* **Corpo da Requisição (Body JSON):** Envie apenas os campos que deseja alterar.
* **Resposta de Sucesso (200 OK):** Retorna o objeto com as modificações aplicadas e salvas.
* **Respostas de Erro:**
* **404 Not Found:** Se o ID informado não existir no banco de dados.
* **400 Bad Request:** Se os dados enviados violarem as tipagens e regras do Zod.

### 🔴 5. Excluir Plano de Aula
Deleta permanentemente do banco de dados o plano de aula correspondente ao ID informado.

* **URL:** /planos/:id (Exemplo: /planos/1)
* **Método:** DELETE
* **Resposta de Sucesso (200 OK):**
* **Resposta de Erro (404 Not Found):** Se o ID não for localizado.

### 🤖 6. Smart Assist (Integração com IA via n8n)
Endpoint estratégico que serve como ponte de comunicação rápida. Ele recebe os parâmetros iniciais inseridos pelo professor, dispara-os para o webhook ativo do n8n para consulta ao modelo Gemini 2.5 Flash, e retorna a resposta formatada para preenchimento dinâmico na tela.

* **URL:** /api/smart-assist
* **Método:** POST
* **Corpo da Requisição (Body JSON):**
* **Resposta de Sucesso (200 OK):** Retorna as matrizes criadas pela Inteligência Artificial prontas para uso do Frontend:
* **Resposta de Erro (500 Internal Server Error):** Caso o workflow do n8n ou os servidores do Gemini estejam offline/indisponíveis:

👤 Desenvolvedor
Nome: Thiago Gabriel
Função: Software Developer
GitHub: DevThiagoGab