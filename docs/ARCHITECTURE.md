# Arquitetura — Tech Challenge Fase 3

## Camadas (Clean Architecture)

```
presentation/     → UI, Providers, Hooks (React)
core/domain/      → Entidades, contratos, casos de uso (regras de negócio)
core/infrastructure/ → Firebase, cache criptografado, RxJS
core/di/          → Injeção de dependências (container)
app/              → Rotas Expo Router (telas finas)
```

### Regra de dependência

- `domain` **não importa** Firebase nem React.
- `infrastructure` implementa interfaces do `domain`.
- `presentation` consome `useCases` via `container` e Context API.

## State Management

- **AuthProvider**: sessão global do usuário.
- **TransactionsProvider**: única inscrição Firestore + cache + métricas derivadas.

## Programação reativa

`FirebaseTransactionRepository.observeUserTransactions()` expõe `Observable` (RxJS).  
O `TransactionsProvider` assina uma vez e compartilha com toda a árvore React.

## Cache

`TransactionCacheService` persiste snapshot criptografado (chave no `expo-secure-store`, payload no `AsyncStorage`).

## Segurança

- Credenciais Firebase em variáveis `EXPO_PUBLIC_*` (arquivo `.env`, não versionado).
- Chave de criptografia do cache no Secure Store.
- Regras Firestore/Storage no Firebase Console (ver README principal).
