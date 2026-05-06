# Tech Challenge Fase 3 - App de Gerenciamento de Transações Financeiras

Um aplicativo móvel para gerenciamento pessoal de transações financeiras, desenvolvido com React Native e Expo. Permite aos usuários rastrear entradas (depósitos) e saídas (transferências), visualizar saldo em tempo real, fazer upload de recibos e analisar dados financeiros através de dashboards interativos.

---

## 🚀 Tecnologias Utilizadas

### Framework e Linguagem

- **Expo** (v54.0.33) - Framework universal para React Native
- **React Native** (0.81.5) com React 19.1.0
- **TypeScript** (5.9.2) - Para tipagem estática e segurança de código
- **Expo Router** (6.0.23) - Sistema de roteamento baseado em arquivos

### Backend e Serviços

- **Firebase** (12.10.0):
  - Authentication para gerenciamento de usuários
  - Firestore para banco de dados em tempo real
  - Storage para upload de arquivos (recibos)

### UI e Animações

- React Navigation (abas inferiores e gaveta)
- React Native SVG para renderização de gráficos
- React Native Reanimated para animações suaves
- @expo/vector-icons para ícones

### Desenvolvimento

- ESLint para linting de código
- TypeScript para configuração de compilação

---

## 📱 Funcionalidades Principais

### 🔐 Sistema de Autenticação

- Cadastro de usuários com validação de nome, email e senha
- Login com tratamento de erros (usuário não encontrado, credenciais inválidas)
- Logout e persistência de sessão
- Proteção de rotas baseada em estado de autenticação

### 💰 Dashboard Financeiro

- Cálculo de saldo em tempo real
- Gráfico de pizza animado mostrando distribuição de depósitos/transferências
- Análise de volume diário de transações
- Toggle para mostrar/ocultar saldo

### 📊 Gerenciamento de Transações

- Criar transações (depósitos e transferências)
- Editar transações existentes
- Excluir transações com confirmação
- Filtragem por categoria (todas/depósitos/transferências) e período
- Carregamento lazy de transações (5 itens por vez)

### 📎 Gerenciamento de Recibos

- Upload de recibos junto com transações (imagens ou PDFs)
- Armazenamento seguro no Firebase Storage
- Vinculação de recibos às transações no Firestore
- Visualização/download de links de recibos

---

## 🏗️ Estrutura do Projeto

```
├── app/
├── components/
├── hooks/
├── services/
├── types/
├── utils/
└── mocks/
```

---

## 🛠️ Instalação e Execução

### Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn
- Conta no Firebase

### Passos de Instalação

```bash
git clone <url-do-repositorio>
cd tech-challenge-fase3
npm install
```

Para rodar

```bash
npm run start
```

---

## 📖 Como Usar

### Primeiro Acesso

1. Vá para "Cadastrar"
2. Crie sua conta
3. Faça login

### Adicionando Transações

1. Acesse "Transações"
2. Clique em "Nova Transação"
3. Preencha os dados
4. (Opcional) Anexe recibo

---

# 🔥 Integração com Firebase

Este projeto utiliza o Firebase como backend para autenticação, persistência de dados e armazenamento de arquivos (recibos).
A integração foi feita utilizando o SDK Web do Firebase com React Native (Expo).

---

## 🧩 Serviços utilizados

### 🔐 Authentication

- Cadastro de usuários
- Login/logout
- Controle de sessão

**Método:** Email e senha

---

### 🗄️ Cloud Firestore

- Armazena transações
- Atualização em tempo real (`onSnapshot`)

---

### ☁️ Cloud Storage

- Armazena recibos
- Gera URLs públicas

---

## ⚙️ Configuração

### Arquivo: `services/firebase.ts`

```ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_AUTH_DOMAIN",
  projectId: "SEU_PROJECT_ID",
  storageBucket: "SEU_STORAGE_BUCKET",
  messagingSenderId: "SEU_SENDER_ID",
  appId: "SEU_APP_ID",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
```

---

## 🗂️ Estrutura de dados

### Coleção: `transactions`

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

---

## 🔄 Fluxo de transações

### Criar

- Salva no Firestore
- Upload opcional no Storage

### Listar

```ts
onSnapshot(query, callback);
```

### Editar

- Atualiza dados
- Pode substituir recibo

### Remover

- Remove do Firestore
- Remove recibo (opcional)

---

## 📤 Upload de recibos

```ts
const receiptData = await uploadReceipt({
  transactionId,
  file,
  fileName,
  contentType,
});

await attachReceiptToTransaction(transactionId, receiptData);
```

**Path:**

```
receipts/{userId}/{transactionId}/{fileName}
```

---

## 📥 Visualização

Mobile:

```ts
Linking.openURL(url);
```

Web:

```ts
window.open(url, "_blank");
```

---

## 🔐 Regras de segurança

### Firestore

```js
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

### Storage

```js
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

## ⚠️ Pontos importantes

- Autenticação obrigatória
- Usuário acessa apenas seus dados
- Usar `downloadURL`
- Evitar passar URLs grandes

---

## 💰 Custos

- ~5GB storage
- ~1GB/dia download

Plano Blaze só cobra uso excedente.

---

## 🐛 Problemas comuns

- 403 → regras incorretas
- Recibo não abre → URL errada
- Erro 400 → URL quebrada

---

## 🔧 Scripts

```bash
npm start
npm run android
npm run ios
npm run web
```

---
