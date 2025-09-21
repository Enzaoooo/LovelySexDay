# Lovely Sex Day - E-commerce Completo

## 🚀 Como executar o projeto no VS Code

### Pré-requisitos
- Node.js (versão 18 ou superior)
- npm ou yarn
- VS Code

### Comandos para executar:

1. **Instalar dependências:**
```bash
npm install
```

2. **Executar em modo de desenvolvimento:**
```bash
npm run dev
```

3. **Compilar para produção:**
```bash
npm run build
```

4. **Visualizar build de produção:**
```bash
npm run preview
```

### 🔐 Recursos de Segurança Implementados

1. **Hash de Senhas:** SHA256 com salt personalizado
2. **Criptografia AES:** Para dados sensíveis
3. **Tokens Criptografados:** Sistema próprio de autenticação
4. **Rate Limiting:** Proteção contra ataques de força bruta
5. **Sanitização:** Limpeza de dados de entrada
6. **Validação:** Email, telefone e força de senha
7. **IDs Seguros:** Geração criptográfica de identificadores
8. **Sessões Criptografadas:** Proteção de dados de sessão
9. **Proteção contra Timing Attacks:** Comparação segura
10. **Proteção de Dados:** localStorage criptografado

### 📱 Acesso ao Sistema

**Área Pública:** 
- URL: `http://localhost:5173/`

**Área Administrativa:**
- URL: `http://localhost:5173/admin`
- Usuário: `admin`
- Senha: `admin123`

### 📞 Configurações

- **WhatsApp:** +55 12 98222-6485
- **Paleta de Cores:** Roxo (#8B5CF6), Rosa (#EC4899), Preto
- **Design:** Moderno, sofisticado e responsivo

### 🛠️ Tecnologias Utilizadas

- React 18 + TypeScript
- Vite (Build tool)
- Tailwind CSS (Estilização)
- Lucide React (Ícones)
- crypto-js (Criptografia AES)

### 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── admin/          # Área administrativa
│   ├── common/         # Componentes compartilhados
│   └── public/         # Área pública
├── context/            # Context API
├── data/              # Dados mock
├── hooks/             # Custom hooks
├── types/             # TypeScript types
└── utils/             # Utilitários e segurança
```

### 🔧 Scripts Disponíveis

- `npm run dev` - Servidor de desenvolvimento
- `npm run build` - Build para produção
- `npm run preview` - Preview do build
- `npm run lint` - Verificar código

### 📋 Funcionalidades

**Área Pública:**
- Catálogo de produtos com filtros
- Carrinho de compras
- Finalização via WhatsApp
- Design responsivo
- Busca avançada

**Área Administrativa:**
- CRUD de produtos
- CRUD de categorias
- Configurações do sistema
- Dashboard com estatísticas
- Sistema de autenticação seguro

### 🛡️ Segurança

O sistema implementa múltiplas camadas de segurança:
- Criptografia end-to-end
- Proteção contra ataques comuns
- Validação rigorosa de dados
- Sessões seguras
- Rate limiting

### 📞 Suporte

WhatsApp: +55 12 98222-6485