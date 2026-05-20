require('dotenv').config();

const express = require('express');
const axios = require('axios');
const { Sequelize, DataTypes } = require('sequelize');
const app = express();
const cors = require('cors');

const port = process.env.PORT || 3000;

app.use(express.json());

const sequelize = new Sequelize({
    dialect: process.env.DB_DIALECT,
    storage: process.env.DB_STORAGE
});

// DEFINIÇÃO DA TABELA
const PlanoAula = sequelize.define('PlanoAula', {
    titulo: { type: DataTypes.STRING, allowNull: false },
    objetivo: { type: DataTypes.TEXT },
    ementa: { type: DataTypes.TEXT },
    dataPrevista: { type: DataTypes.DATEONLY },
    disciplina: { type: DataTypes.STRING },
    conteudos: { type: DataTypes.JSON },
    recursosApoio: { type: DataTypes.JSON },
    tags: { type: DataTypes.JSON }
});

const { z } = require('zod');
app.use(cors());

const planoAulaSchema = z.object({

    titulo: z.string({
        required_error: "O título é obrigatório",
        invalid_type_error: "O título precisa ser um texto (string)"
    })
        .min(3, "O título precisa ter pelo menos 3 caracteres")
        .regex(/[a-zA-ZÀ-ÿ]/, "O título deve conter pelo menos uma letra"),

    objetivo: z.string().optional(),
    ementa: z.string().optional(),

    dataPrevista: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
        message: "A data deve estar no formato AAAA-MM-DD"
    }).optional(),

    disciplina: z.string({
        invalid_type_error: "A disciplina precisa ser um texto (string)"
    }).optional(),

    conteudos: z.array(z.string({
        invalid_type_error: "Cada item do conteúdo precisa ser um texto"
    })).optional(),

    recursosApoio: z.array(z.string({
        invalid_type_error: "Cada recurso de apoio precisa ser um texto"
    })).optional(),

    tags: z.array(z.string({
        invalid_type_error: "Cada tag precisa ser um texto"
    })).optional()
});

app.get('/', async (req, res) => {
    res.json({ active: true });
});

app.get('/health', async (req, res) => {
    res.json({ active: true });
});

// ROTA DE LISTAGEM (READ)
app.get('/planos', async (req, res) => {
    try {
        const planos = await PlanoAula.findAll({
            order: [
                ['id', 'DESC']
            ]
        });

        res.json(planos);
    } catch (error) {
        console.error("Erro ao buscar planos:", error);
        res.status(500).json({ mensagem: "Erro interno no servidor." });
    }
});

// ROTA DE CADASTRO (CREATE)
app.post('/planos', async (req, res) => {
    try {
        const dadosValidados = planoAulaSchema.parse(req.body);
        const novoPlano = await PlanoAula.create(dadosValidados);
        res.status(201).json(novoPlano);

    } catch (error) {
        if (error.issues) {
            const listaDeErros = error.issues.map(iss => iss.message);
            return res.status(400).json({ erros: listaDeErros });
        }

        console.error("Erro ao cadastrar:", error);
        res.status(500).json({ mensagem: 'Erro interno no servidor.' });
    }
});

// ROTA DE EDIÇÃO (PUT)
app.put('/planos/:id', async (req, res) => {
    try {
        const dadosValidados = planoAulaSchema.partial().parse(req.body);

        const id = req.params.id;

        const [linhasAfetadas] = await PlanoAula.update(dadosValidados, {
            where: { id: id }
        });

        if (linhasAfetadas === 0) {
            return res.status(404).json({ mensagem: 'Plano não encontrado' });
        }

        const planoAtualizado = await PlanoAula.findByPk(id);
        res.json(planoAtualizado);

    } catch (error) {
        if (error.issues) {
            const listaDeErros = error.issues.map(iss => iss.message);
            return res.status(400).json({ erros: listaDeErros });
        }
        console.error("Erro no PUT:", error);
        res.status(500).json({ mensagem: 'Erro interno ao atualizar.' });
    }
});

// ROTA DE EDIÇÃO (PATCH)
app.patch('/planos/:id', async (req, res) => {
    try {
        const dadosValidados = planoAulaSchema.partial().parse(req.body);
        const id = req.params.id;

        const [linhasAfetadas] = await PlanoAula.update(dadosValidados, {
            where: { id: id }
        });

        if (linhasAfetadas === 0) {
            return res.status(404).json({ mensagem: 'Plano não encontrado' });
        }

        const planoAtualizado = await PlanoAula.findByPk(id);
        res.json(planoAtualizado);

    } catch (error) {
        if (error.issues) {
            const listaDeErros = error.issues.map(iss => iss.message);
            return res.status(400).json({ erros: listaDeErros });
        }
        console.error("Erro no PATCH:", error);
        res.status(500).json({ mensagem: 'Erro interno ao atualizar.' });
    }
});

// ROTA DE EXCLUSÃO (DELETE)
app.delete('/planos/:id', async (req, res) => {
    try {
        const id = req.params.id;

        const linhasDeletadas = await PlanoAula.destroy({ where: { id } });

        if (linhasDeletadas === 0) {
            return res.status(404).json({ mensagem: 'Plano não encontrado' });
        }

        res.json({ mensagem: 'Plano excluído com sucesso!' });

    } catch (error) {
        console.error("Erro ao deletar:", error);
        res.status(500).json({ mensagem: 'Erro interno ao tentar excluir o plano.' });
    }
});

// ROTA DE INTEGRACAO SMART ASSIST COM IA VIA n8n
app.post('/api/smart-assist', async (req, res) => {
    const { titulo, disciplina, ementa } = req.body;

    const N8N_WEBHOOK_URL = 'http://localhost:5678/webhook-test/d343e6ee-d485-40e8-849d-6552bedd3e10';

    try {
        // Envia os dados para o n8n de forma limpa e aguarda a resposta
        const respostaN8n = await axios.post(N8N_WEBHOOK_URL, {
            titulo,
            disciplina,
            ementa
        });

        // O axios já faz o parse do JSON automaticamente, basta repassar o.data pro front
        res.json(respostaN8n.data);

    } catch (erro) {
        console.error("Erro ao conectar ou processar dados com o n8n:", erro.message);
        res.status(500).json({ 
            erro: "Não foi possível processar a recomendação com a IA.",
            detalhes: erro.message 
        });
    }
});

sequelize.sync().then(() => {
    app.listen(port, () => {
        console.log(`Servidor rodando em http://localhost:${port}`);
    });
});