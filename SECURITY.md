# Guia de Segurança - Lovely Sex Day

## 📋 Resumo

Este documento descreve as medidas de segurança implementadas no site seguindo as diretrizes do OWASP Top 10.

## 🛡️ Medidas de Segurança Implementadas

### 1. Content Security Policy (CSP)

**Arquivo:** `project/public/_headers`

Implementado CSP rigoroso que:
- Permite scripts apenas do próprio domínio e Supabase
- Bloqueia carregamento de recursos de domínios não autorizados
- Previne ataques XSS via injection de scripts maliciosos
- Bloqueia frames externos (proteção contra clickjacking)

**Configuração:**
```
Content-Security-Policy: default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://wvqlnlcszlgmqboyhavt.supabase.co;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https: blob:;
  connect-src 'self' https://wvqlnlcszlgmqboyhavt.supabase.co;
  frame-ancestors 'none';
```

### 2. HTTP Security Headers

**Arquivo:** `project/public/_headers`

Headers de segurança implementados:
- **X-Frame-Options: DENY** - Previne clickjacking
- **X-Content-Type-Options: nosniff** - Previne MIME sniffing
- **X-XSS-Protection: 1; mode=block** - Proteção XSS do navegador
- **Referrer-Policy: strict-origin-when-cross-origin** - Controla informações de referência
- **Permissions-Policy** - Desabilita recursos não utilizados (câmera, microfone, etc.)
- **Strict-Transport-Security** - Força uso de HTTPS

### 3. Proteção XSS (Cross-Site Scripting)

**Arquivo:** `project/src/lib/security.ts`

Implementadas funções de sanitização usando DOMPurify:

- **`sanitizeHTML()`** - Sanitiza HTML permitindo apenas tags seguras
- **`sanitizeInput()`** - Remove todo HTML de inputs de usuário
- **`sanitizeURL()`** - Valida e sanitiza URLs para prevenir javascript: e data: URIs maliciosos

**Uso:**
```typescript
import { sanitizeHTML, sanitizeInput, sanitizeURL } from './lib/security';

// Sanitizar HTML rico (descrições de produtos)
const safeHTML = sanitizeHTML(userInput);

// Sanitizar texto simples (nomes, emails)
const safeText = sanitizeInput(userInput);

// Sanitizar URLs
const safeURL = sanitizeURL(link);
```

### 4. Proteção CSRF (Cross-Site Request Forgery)

**Arquivos:**
- `project/src/lib/security.ts`
- `project/src/components/admin/AdminLogin.tsx`

Implementado sistema de tokens CSRF:
- Token único gerado para cada sessão
- Armazenado em sessionStorage
- Validação em requisições sensíveis

**Funções:**
- `generateCSRFToken()` - Gera token aleatório criptograficamente seguro
- `storeCSRFToken()` - Armazena token na sessão
- `getCSRFToken()` - Recupera token para validação

### 5. Rate Limiting

**Arquivo:** `project/src/lib/security.ts`

Sistema de limitação de taxa para prevenir brute force:
- Máximo de 5 tentativas de login por minuto por email
- Implementado no login administrativo
- Bloqueio temporário após exceder limite

**Uso:**
```typescript
if (!rateLimiter.check(email, 5, 60000)) {
  throw new Error('Muitas tentativas. Aguarde 1 minuto.');
}
```

### 6. Validação de Entrada

**Arquivo:** `project/src/lib/security.ts`

Validações implementadas:
- **Email:** Formato RFC 5322 + limite de 254 caracteres
- **Senha:** Mínimo 8 caracteres, maiúscula, minúscula, número e caractere especial
- **URLs:** Apenas protocolos http:, https: e mailto:

**Funções:**
- `isValidEmail()` - Valida formato de email
- `validatePassword()` - Valida força da senha

### 7. Configuração Segura do Vite

**Arquivo:** `project/vite.config.ts`

Configurações de build seguras:
- **Remoção de console.logs** em produção (previne vazamento de informações)
- **Source maps desabilitados** em produção (previne engenharia reversa)
- **Code splitting** por vendor e supabase (isolamento de segurança)
- **Headers de segurança** no servidor de desenvolvimento

```typescript
build: {
  minify: 'terser',
  terserOptions: {
    compress: {
      drop_console: true,
      drop_debugger: true,
    },
  },
  sourcemap: false,
}
```

### 8. Segurança do Supabase

**Row Level Security (RLS):**
- Políticas RLS ativas em todas as tabelas
- Acesso público apenas para leitura de produtos e categorias
- Modificações requerem autenticação de administrador

**Arquivo:** `supabase/EXECUTE_AGORA.sql`

## 🔐 Checklist de Segurança

### Antes de Deploy

- [ ] Verificar se `.env` está no `.gitignore`
- [ ] Confirmar que chaves da API não estão hardcoded
- [ ] Testar políticas RLS no Supabase
- [ ] Validar CSP headers no navegador
- [ ] Executar `npm audit` e corrigir vulnerabilidades
- [ ] Verificar build de produção sem source maps
- [ ] Testar rate limiting no login
- [ ] Validar sanitização de inputs em formulários

### Manutenção Contínua

- [ ] Atualizar dependências mensalmente (`npm update`)
- [ ] Executar `npm audit` semanalmente
- [ ] Revisar logs de autenticação no Supabase
- [ ] Monitorar tentativas de login falhadas
- [ ] Backup regular do banco de dados
- [ ] Revisar e atualizar CSP conforme necessário

## 🚨 Vulnerabilidades Atuais

Execute para verificar:
```bash
npm audit
```

Para corrigir automaticamente (sem breaking changes):
```bash
npm audit fix
```

## 📚 Referências

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [MDN Web Security](https://developer.mozilla.org/en-US/docs/Web/Security)
- [Supabase Security Best Practices](https://supabase.com/docs/guides/auth/row-level-security)
- [DOMPurify Documentation](https://github.com/cure53/DOMPurify)

## 🔄 Próximas Melhorias Recomendadas

1. **Autenticação de Dois Fatores (2FA)** para administradores
2. **Logs de Auditoria** para todas ações administrativas
3. **Captcha** no formulário de login após múltiplas tentativas
4. **Monitoramento de Segurança** com ferramentas como Sentry
5. **Backup Automatizado** do banco de dados
6. **Testes de Penetração** periódicos
7. **WAF (Web Application Firewall)** na camada de CDN

## 📞 Suporte

Para reportar vulnerabilidades de segurança, entre em contato de forma privada antes de divulgar publicamente.
