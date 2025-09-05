# Recoleta API

API para cadastro e gerenciamento de resíduos desenvolvida com NestJS, Prisma e MongoDB.

## 🚀 Recursos

- **Autenticação JWT** com nome e email no payload
- **CRUD completo** para resíduos, usuários e endereços
- **Mapeamento português → inglês** para campos de resíduo
- **Upload de imagens** em base64 (até 50MB)
- **Documentação Swagger** interativa
- **Banco MongoDB** com Prisma ORM

## 📚 Documentação

### Swagger UI (Recomendado)

Acesse a documentação interativa em: **http://localhost:3005/api**

- Interface visual para testar todas as rotas
- Autenticação JWT integrada
- Schemas e exemplos automáticos
- Try it out para executar requisições

### Documentação Manual

- [**WASTE_API.md**](./WASTE_API.md) - Documentação completa das rotas
- [**SWAGGER.md**](./SWAGGER.md) - Guia de uso do Swagger

## ⚡ Quick Start

```bash
# Instalar dependências
$ npm install

# Gerar cliente Prisma
$ npx prisma generate

# Iniciar servidor em desenvolvimento
$ npm run start:dev
```

**Servidor:** http://localhost:3005  
**Swagger:** http://localhost:3005/api

## 🗂️ Principais Endpoints

| Método  | Endpoint         | Descrição         |
| ------- | ---------------- | ----------------- |
| `POST`  | `/auth/signin`   | Login             |
| `GET`   | `/auth/validate` | Validar token     |
| `POST`  | `/user`          | Criar usuário     |
| `POST`  | `/waste`         | Cadastrar resíduo |
| `GET`   | `/waste`         | Listar resíduos   |
| `PATCH` | `/waste/:id`     | Atualizar resíduo |

## 🛠️ Tecnologias

- **NestJS** - Framework Node.js
- **Prisma** - ORM para MongoDB
- **JWT** - Autenticação
- **Swagger** - Documentação da API
- **TypeScript** - Linguagem de programação

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
$ npm run start:dev

# Build de produção
$ npm run build
$ npm run start:prod

# Testes
$ npm run test
$ npm run test:e2e

# Prisma
$ npx prisma generate
$ npx prisma studio
```

## 📋 Exemplo de Uso

### 1. Fazer Login

```bash
curl -X POST http://localhost:3005/auth/signin
  -H "Content-Type: application/json"
  -d '{"email": "user@example.com", "password": "senha123"}'
```

### 2. Cadastrar Resíduo

```bash
curl -X POST http://localhost:3005/waste
  -H "Authorization: Bearer SEU_TOKEN"
  -H "Content-Type: application/json"
  -d '{
    "waste": {
      "tipoResiduo": "plasticos",
      "peso": 2.5,
      "quantidade": 1,
      "unidade": "kg",
      "condicao": "usado",
      "embalagem": "não",
      "dataDescarte": "2025-09-05",
      "horaDescarte": "14:30"
    },
    "address": {
      "rua": "Rua das Flores",
      "numero": "123",
      "bairro": "Centro",
      "cidade": "São Paulo",
      "estado": "SP",
      "cep": "01234-567",
      "principal": true
    }
  }'
```

## 🎯 Recursos Especiais

### Mapeamento Automático

O sistema aceita campos em português e converte para o banco:

- `plasticos` → `PLASTIC`
- `eletronicos` → `ELECTRONICS`
- `organicos` → `ORGANIC`

### Autenticação Completa

- JWT com payload expandido (id, name, email)
- Rotas de validação GET e POST
- Guards automáticos para rotas protegidas

### Upload de Imagens

- Suporte a imagens base64
- Array de múltiplas imagens
- Limite de 50MB por requisição

## 📄 Licença

MIT

---

**✨ Para uma experiência completa, use o Swagger UI em http://localhost:3005/api**

  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->
