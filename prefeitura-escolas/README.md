# 📚 Prefeitura Escolas — Desafio Técnico React Native

Aplicativo móvel para gerenciamento de escolas públicas e turmas, desenvolvido como desafio técnico utilizando React Native com Expo.

---

## 📱 Screenshots

<p align="center">
  <img src="../images-readme/WhatsApp Image 2026-04-13 at 10.11.25 (1).jpeg" width="180" alt="Lista de escolas" />
  <img src="../images-readme/WhatsApp Image 2026-04-13 at 10.11.22 (1).jpeg" width="180" alt="Modal nova escola" />
  <img src="../images-readme/WhatsApp Image 2026-04-13 at 10.11.22 (2).jpeg" width="180" alt="Confirmação de exclusão" />
  <img src="../images-readme/WhatsApp Image 2026-04-13 at 10.11.25.jpeg" width="180" alt="Lista de turmas" />
  <img src="../images-readme/WhatsApp Image 2026-04-13 at 10.11.24.jpeg" width="180" alt="Filtro de turmas" />
  <img src="../images-readme/WhatsApp Image 2026-04-13 at 10.11.23.jpeg" width="180" alt="Modal nova turma" />
  <img src="../images-readme/WhatsApp Image 2026-04-13 at 10.11.22.jpeg" width="180" alt="Tela Sobre" />
</p>

---

## 📋 Sobre o Projeto

A prefeitura de uma cidade no interior do país enfrenta dificuldades no controle das escolas públicas. Este aplicativo centraliza o cadastro das escolas e de suas turmas, substituindo o controle manual em planilhas Excel.

### Funcionalidades

**Módulo de Escolas**

- Listar escolas (nome, endereço, número de turmas)
- Adicionar nova escola (nome e endereço obrigatórios)
- Editar e excluir escola
- Busca por nome ou endereço em tempo real
- Banner de modo offline quando sem conexão

**Módulo de Turmas**

- Listar turmas vinculadas à escola selecionada
- Cadastrar nova turma (nome, turno e ano letivo)
- Editar e excluir turma
- Filtro por turno (Manhã / Tarde / Noite)
- Filtro por ano letivo

---

## 🛠️ Stack Tecnológica

| Tecnologia         | Versão   | Uso                     |
| ------------------ | -------- | ----------------------- |
| Node.js            | 18+      | Runtime                 |
| Expo SDK           | ~54.0.33 | Plataforma              |
| React              | 19.1.0   | UI                      |
| React Native       | 0.81.5   | Mobile                  |
| TypeScript         | ~5.9.2   | Tipagem estática        |
| Expo Router        | ~6.0.23  | Navegação file-based    |
| Gluestack UI v3    | —        | Componentes de UI       |
| NativeWind 4       | —        | Tailwind CSS para RN    |
| Zustand            | ^5.0.12  | Gerenciamento de estado |
| AsyncStorage       | ^2.2.0   | Persistência offline    |
| Jest               | ^29      | Testes unitários        |
| Testing Library RN | ^13      | Testes de componentes   |

---

## 📦 Instalação e Execução

### Pré-requisitos

- Node.js 18 ou superior
- npm 9+
- Expo Go instalado no celular **ou** emulador Android/iOS configurado

### Passos

```bash
# 1. Clone o repositório
git clone https://github.com/pedroblome/cadmus-react-native
cd cadmus-react-native/prefeitura-escolas

# 2. Instale as dependências
npm install

# 3. Inicie o servidor de desenvolvimento
npx expo start
```

Após iniciar, escaneie o QR code com o **Expo Go** (Android) ou a câmera (iOS).

---

## 🔧 Mock de Back-end

O projeto **não utiliza MSW** (incompatível com o engine Hermes do React Native). Em seu lugar, foi implementado um interceptor customizado de `global.fetch` em [`src/infra/mock/server.ts`](src/infra/mock/server.ts).

### Como funciona

- Intercepta todas as chamadas `fetch` para `http://localhost:3000/api/*`
- Roteia por pathname + método HTTP (sem dependência de APIs do browser)
- Mantém estado em memória que **sobrevive ao Fast Refresh** (via `global.__mockSchools` / `global.__mockClasses`)
- Ativado automaticamente em modo `__DEV__` no [`app/_layout.tsx`](app/_layout.tsx)

### Endpoints disponíveis

| Método | Endpoint                 | Descrição                         |
| ------ | ------------------------ | --------------------------------- |
| GET    | `/api/schools`           | Lista todas as escolas            |
| POST   | `/api/schools`           | Cria nova escola                  |
| GET    | `/api/schools/:id`       | Busca escola por ID               |
| PUT    | `/api/schools/:id`       | Atualiza escola                   |
| DELETE | `/api/schools/:id`       | Remove escola e turmas vinculadas |
| GET    | `/api/classes?schoolId=` | Lista turmas (filtro por escola)  |
| POST   | `/api/classes`           | Cria nova turma                   |
| GET    | `/api/classes/:id`       | Busca turma por ID                |
| PUT    | `/api/classes/:id`       | Atualiza turma                    |
| DELETE | `/api/classes/:id`       | Remove turma                      |

### Dados de seed

O app inicia com 4 escolas e 8 turmas pré-cadastradas (definidas em [`src/infra/msw/seed.ts`](src/infra/msw/seed.ts)).

---

## 🧪 Testes

```bash
# Rodar todos os testes
npm test

# Modo watch (re-executa ao salvar)
npm run test:watch
```

### Cobertura

| Arquivo de teste                | O que cobre                                                                                     |
| ------------------------------- | ----------------------------------------------------------------------------------------------- |
| `__tests__/SchoolCard.test.tsx` | Renderização, contador de turmas, eventos de press e Alert de exclusão                          |
| `__tests__/ClassCard.test.tsx`  | Renderização, badge de turno (3 variações), eventos de press e Alert de exclusão                |
| `__tests__/useSchools.test.ts`  | Carregamento, filtro por nome/endereço, create, remove, modo offline, erro sem cache            |
| `__tests__/useClasses.test.ts`  | Carregamento, filtro por turno, filtro por ano, filtro combinado, `availableYears`, add, remove |

---

## 🏗️ Arquitetura

```
prefeitura-escolas/
├── app/                        # Rotas (Expo Router)
│   ├── _layout.tsx             # Root layout + inicialização do mock
│   ├── (tabs)/
│   │   ├── _layout.tsx         # Navegação por abas
│   │   ├── index.tsx           # Tab "Escolas" — lista principal
│   │   └── two.tsx             # Tab "Sobre"
│   └── schools/
│       └── [id].tsx            # Detalhe da escola + turmas
│
├── src/
│   ├── features/               # Módulos por domínio
│   │   ├── schools/
│   │   │   ├── components/     # SchoolCard, SchoolFormModal, SchoolListEmpty
│   │   │   ├── hooks/          # useSchools (busca, CRUD, isOffline)
│   │   │   ├── services/       # schoolsService (HTTP)
│   │   │   ├── store/          # schoolsStore (Zustand + persist)
│   │   │   └── types/          # School, CreateSchoolInput, UpdateSchoolInput
│   │   └── classes/
│   │       ├── components/     # ClassCard, ClassFormModal, ClassListEmpty
│   │       ├── hooks/          # useClasses (filtros de turno/ano, CRUD)
│   │       ├── services/       # classesService (HTTP)
│   │       ├── store/          # classesStore (Zustand + persist)
│   │       └── types/          # SchoolClass, Shift, CreateClassInput, UpdateClassInput
│   └── infra/
│       ├── http/               # client.ts — wrapper de fetch com tratamento 204
│       ├── mock/               # server.ts — interceptor fetch (substitui MSW)
│       └── msw/                # seed.ts — dados iniciais
│
└── __tests__/                  # Testes unitários (Jest + Testing Library)
```

### Padrões aplicados

- **Repository Pattern** — `schoolsService` / `classesService` isolam o transporte HTTP
- **Custom Hooks** — `useSchools` e `useClasses` encapsulam lógica de negócio
- **Zustand com persist** — estado global + sincronização com AsyncStorage
- **Feature-based organization** — cada domínio é autossuficiente

---

## 📱 Persistência Offline

O app usa o **middleware `persist` do Zustand** com `AsyncStorage` como storage adapter.

- Os dados das escolas e turmas são salvos localmente ao receber respostas da API
- Se o dispositivo ficar offline, o app exibe os dados do cache e mostra um **banner amarelo** de modo offline
- Ao reconectar, os dados são atualizados automaticamente (na próxima abertura da tela)

---

## 📌 Decisões técnicas

**Por que não usar MSW?**
O MSW v2 depende de `Event`, `EventTarget`, `MessageEvent` e `BroadcastChannel` — APIs do browser que não existem no engine **Hermes** do React Native. Em vez disso, foi implementado um interceptor direto de `global.fetch` sem nenhuma dependência de browser.

**Por que AsyncStorage v2.2.0 e não v3?**
A v3 requer um **dev build** do Expo. A v2.2.0 é compatível com o **Expo Go**, que é a forma mais simples de testar o app sem configuração adicional.
