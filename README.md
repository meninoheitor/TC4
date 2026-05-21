# Tech Challenge Fase 3 — App de Gerenciamento Financeiro

**Repositório:** [https://github.com/meninoheitor/TC4](https://github.com/meninoheitor/TC4)

Aplicativo mobile de finanças pessoais desenvolvido com **React Native**, **Expo** e **Firebase**, evoluído com **Clean Architecture**, **gerenciamento de estado centralizado**, **cache criptografado**, **programação reativa (RxJS)** e otimizações de performance.

---

## Funcionalidades

- Cadastro e login com Firebase Authentication (email e senha)
- Dashboard com saldo, entradas, saídas e gráficos (pizza e fluxo diário)
- CRUD de transações (depósito e transferência)
- Filtros por categoria e período
- Upload e visualização de recibos (imagem ou PDF)
- Atualização em tempo real via Firestore
- Ocultar/mostrar saldo no header
- Validação de saldo em transferências (criação e edição)
- Logout e rotas protegidas por autenticação

---

## Tecnologias utilizadas

| Categoria | Tecnologia |
|-----------|------------|
| Framework | Expo 54, React Native 0.81, React 19 |
| Linguagem | TypeScript 5.9 |
| Navegação | Expo Router 6, React Navigation (tabs) |
| Backend (BaaS) | Firebase Auth, Firestore, Storage |
| Estado global | React Context API + Providers |
| Reatividade | RxJS (streams do Firestore) |
| Cache | AsyncStorage + criptografia (chave no Secure Store / fallback) |
| Segurança | `expo-secure-store`, `expo-crypto`, variáveis de ambiente |
| UI | React Native SVG, Reanimated, Expo Vector Icons |

---

## Requisitos da Fase 3 (proposta do challenge)

| Requisito | Implementação no projeto |
|-----------|--------------------------|
| Arquitetura modular | Pastas `core/`, `presentation/`, `app/`, `components/` |
| State management avançado | `AuthProvider` e `TransactionsProvider` |
| Clean Architecture | Domain, Infrastructure, Presentation + DI |
| Lazy loading | Dashboard com `React.lazy` + `Suspense` |
| Cache | `TransactionCacheService` + `EncryptedCache` (TTL 5 min) |
| Programação reativa | Firestore → `Observable` (RxJS) no `TransactionsProvider` |
| Segurança | `.env`, Secure Store, regras Firebase, exclusão de recibos no Storage |

---

## Arquitetura do projeto

```
tech-challenge-fase-03/
├── app/                      # Telas (Expo Router) — camada de apresentação
├── presentation/             # Providers e hooks de UI
│   ├── providers/            # AuthProvider, TransactionsProvider
│   └── hooks/
├── core/
│   ├── domain/               # Entidades, contratos, casos de uso
│   ├── infrastructure/       # Firebase, cache, RxJS
│   └── di/                   # Container de injeção de dependências
├── components/               # Componentes visuais reutilizáveis
├── services/                 # Facades de compatibilidade
├── utils/
├── types/
└── docs/ARCHITECTURE.md      # Detalhes da arquitetura
```

### Clean Architecture (resumo)

| Camada | Responsabilidade | Exemplo |
|--------|------------------|---------|
| **Domain** | Regras de negócio puras | `CreateTransactionUseCase`, `FinanceCalculator` |
| **Infrastructure** | Detalhes técnicos | `FirebaseTransactionRepository`, `EncryptedCache` |
| **Presentation** | Estado da UI e React | `AuthProvider`, `useTransactions` |
| **App** | Rotas e composição de telas | `app/login.tsx`, `app/(tabs)/index.tsx` |

> A regra de ouro: o `domain` **nunca** importa Firebase nem React.

---

## Melhorias implementadas

### Arquitetura e estado

- Separação em camadas **presentation / domain / infrastructure**
- **Use Cases** para login, CRUD de transações e upload de recibos
- **Um único listener** Firestore via `TransactionsProvider` (evita listeners duplicados)
- **Container DI** em `core/di/container.ts`

### Performance

- **Lazy loading** do dashboard (`React.lazy` + `Suspense`)
- **Cache criptografado** de transações (TTL 5 min) para exibição mais rápida
- Ordenação no cliente para evitar índice composto obrigatório no Firestore

### Programação reativa

- Firestore adaptado para `Observable` com RxJS (`shareReplay`, `catchError`)

### Segurança

- Credenciais Firebase via **`.env`** (`EXPO_PUBLIC_*`) ou fallback de desenvolvimento
- Chave de criptografia do cache no **Secure Store** (com fallback no AsyncStorage na web)
- Exclusão de recibo no **Storage** ao deletar transação
- Validação de saldo corrigida na **edição** de transferências

---

## Pré-requisitos

- Node.js 18+
- npm ou yarn
- Conta no [Firebase Console](https://console.firebase.google.com/)
- [Expo Go](https://expo.dev/go) (mobile) ou emulador Android/iOS

---

## Passo a passo para rodar localmente

### 1. Clonar e instalar

```bash
git clone https://github.com/meninoheitor/TC4.git
cd TC4
npm install
```

> Se a pasta local tiver outro nome (ex.: `tech-challenge-fase-03`), use o nome da sua pasta após o clone.

### 2. Configurar variáveis de ambiente (recomendado)

```bash
cp .env.example .env
```

Edite o `.env` com os dados do Firebase (Configurações do projeto → Seus apps → SDK):

```env
EXPO_PUBLIC_FIREBASE_API_KEY=...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=...
EXPO_PUBLIC_FIREBASE_PROJECT_ID=...
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=...
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
EXPO_PUBLIC_FIREBASE_APP_ID=...
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=...
```

> Sem `.env`, o app usa configuração padrão de desenvolvimento. Para produção, configure sempre o `.env`.

### 3. Configurar Firebase

1. Ative **Authentication** (Email/Senha)
2. Crie o banco **Firestore**
3. Ative **Storage**
4. Aplique as regras de segurança (seção abaixo)

### 4. Executar o app

```bash
npm start
```

Recomendado após mudanças de dependências:

```bash
npx expo start -c
```

Depois escaneie o QR Code (Expo Go) ou pressione:

- `a` — Android
- `i` — iOS
- `w` — Web (alguns recursos nativos, como Secure Store, usam fallback na web)

Outros scripts:

```bash
npm run android
npm run ios
npm run web
npm run lint
```

---

## Como usar o app

1. **Cadastre-se** em “Cadastrar” (nome, email, senha)
2. **Faça login**
3. Na aba **Início**, veja saldo, gráficos e análise financeira
4. Na aba **Transações**, filtre, edite, exclua ou crie novas transações
5. Ao criar, opcionalmente **anexe um recibo** (imagem ou PDF)
6. Use o ícone de **olho** no header para ocultar/mostrar saldo
7. Use **logout** no header para sair

---

## Integração Firebase

### Coleção `transactions`

```json
{
  "userId": "uid-do-usuario",
  "type": "deposito",
  "value": 500,
  "description": "Depósito inicial",
  "createdAt": "timestamp",
  "receipt": {
    "fileName": "recibo.png",
    "storagePath": "receipts/{userId}/{transactionId}/arquivo.png",
    "downloadURL": "https://...",
    "contentType": "image/png"
  }
}
```

### Regras Firestore

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /transactions/{transactionId} {
      allow create: if request.auth != null
        && request.resource.data.userId == request.auth.uid;
      allow read, update, delete: if request.auth != null
        && resource.data.userId == request.auth.uid;
    }
  }
}
```

### Regras Storage

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /receipts/{userId}/{transactionId}/{fileName} {
      allow read, write: if request.auth != null
        && request.auth.uid == userId;
    }
  }
}
```

---

## Fluxo para desenvolvedores

### Adicionar uma nova regra de negócio

1. Crie o caso de uso em `core/domain/use-cases/`
2. Registre no `core/di/container.ts`
3. Consuma no Provider ou na tela via `container.useCases...`

### Acessar transações na UI

```tsx
import { useTransactions } from "@/hooks/useTransactions";

const { transactions, balance, loading, fromCache } = useTransactions();
```

### Autenticação na UI

```tsx
import { useAuth } from "@/hooks/useAuth";

const { user, login, logout, loading } = useAuth();
```

---

## Problemas comuns

| Problema | Solução |
|----------|---------|
| Erro 403 no Firebase | Verifique regras Firestore/Storage |
| App sem dados | Confirme login e `userId` nas transações |
| Variáveis vazias | Copie `.env.example` → `.env` |
| Recibo não abre | Confirme `downloadURL` no documento |
| `SecureStore... is not a function` | Rode `npx expo install expo-secure-store expo-crypto` e `npx expo start -c`. Prefira **Expo Go** (mobile) |
| Erro após atualizar dependências | `npx expo start -c` para limpar cache do Metro |

---

## Documentação adicional

- [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) — visão técnica das camadas

---

## Scripts

| Comando | Descrição |
|---------|-----------|
| `npm start` | Inicia o Expo |
| `npm run android` | Abre no Android |
| `npm run ios` | Abre no iOS |
| `npm run web` | Abre no navegador |
| `npm run lint` | Executa ESLint |

---

Desenvolvido como entrega do **Tech Challenge — Fase 3**.
