# 📱 MCP Todo App

Uma aplicação de tarefas (TODO) moderna desenvolvida com **Expo Router**, **SQLite** e **React Native**, com suporte completo a temas dark/light e integração MCP (Model Context Protocol).

## 🎯 Funcionalidades

### ✅ Gestão de Tarefas

- **Adicionar tarefas** - Interface intuitiva para criar novas tarefas
- **Marcar como concluída** - Toggle rápido para completar tarefas
- **Eliminar tarefas** - Remoção individual ou em massa
- **Persistência local** - Dados salvos com SQLite KV Store

### 🎨 Sistema de Temas

- **Modo Dark/Light** - Alternância instantânea entre temas
- **Persistência de preferência** - Tema salvo localmente
- **UI dinâmica** - Todos os elementos se adaptam ao tema
- **Status bar automática** - Adapta-se ao tema selecionado

### 📱 Navegação

- **Tab Navigation** - Duas abas principais
  - **Add & Complete Tasks** - Gestão geral de tarefas
  - **Delete Tasks** - Foco na remoção de tarefas
- **Expo Router** - Navegação baseada em arquivos
- **Deep linking** - URLs funcionais em todas as plataformas

## 🛠️ Tecnologias

### Core Framework

- **Expo SDK 54** - Framework principal
- **React Native** - Interface nativa
- **TypeScript** - Tipagem estática
- **Expo Router v6** - Navegação file-based

### Banco de Dados

- **expo-sqlite** - SQLite nativo
- **KV Store** - Armazenamento chave-valor
- **Persistência local** - Dados mantidos entre sessões

### Ferramentas de Desenvolvimento

- **EAS Build** - Sistema de build na nuvem
- **MCP Integration** - Model Context Protocol
- **expo-mcp** - Ferramentas MCP específicas da Expo

## 📁 Estrutura do Projeto

```
mcp/
├── app/                          # Rotas da aplicação
│   ├── _layout.tsx              # Layout raiz com ThemeProvider
│   ├── modal.tsx                # Tela modal
│   └── (tabs)/                  # Grupo de navegação por tabs
│       ├── _layout.tsx          # Layout das tabs
│       ├── index.tsx            # Tab: Add & Complete Tasks
│       └── explore.tsx          # Tab: Delete Tasks
├── components/                   # Componentes reutilizáveis
│   ├── themed-view.tsx          # View com suporte a temas
│   ├── themed-text.tsx          # Text com suporte a temas
│   ├── haptic-tab.tsx           # Tab com feedback háptico
│   └── ui/                      # Componentes de UI
│       ├── icon-symbol.tsx      # Ícones do sistema
│       └── collapsible.tsx      # Componente expansível
├── contexts/                     # Contextos React
│   └── theme-context.tsx        # Contexto global de tema
├── hooks/                        # Custom hooks
│   ├── use-theme-toggle.ts      # Hook de alternância de tema
│   ├── use-theme-color.ts       # Hook de cores por tema
│   └── use-color-scheme.ts      # Hook de esquema de cores
├── constants/                    # Constantes e configurações
│   └── theme.ts                 # Definições de cores e temas
├── assets/                       # Recursos estáticos
│   └── images/                  # Imagens e ícones
├── app.json                      # Configuração da app Expo
├── eas.json                      # Configuração do EAS Build
├── package.json                  # Dependências e scripts
└── README.md                     # Este arquivo
```

## 🚀 Instalação e Configuração

### Pré-requisitos

- **Node.js** 18+
- **npm** ou **yarn**
- **Expo CLI**
- **EAS CLI** (para builds)

### 1. Clone e Instale

```bash
git clone <repository-url>
cd mcp
npm install
```

### 2. Configuração do Ambiente

```bash
# Instalar Expo CLI (se necessário)
npm install -g @expo/cli

# Instalar EAS CLI (se necessário)
npm install -g eas-cli
```

### 3. Executar em Desenvolvimento

```bash
# Iniciar servidor de desenvolvimento
npm start
# ou
npx expo start

# Com MCP ativo
EXPO_UNSTABLE_MCP_SERVER=1 npx expo start
```

## 📱 Comandos de Desenvolvimento

### Servidor de Desenvolvimento

```bash
# Servidor padrão
npm start

# Servidor com MCP
EXPO_UNSTABLE_MCP_SERVER=1 npx expo start

# Limpar cache
npx expo start --clear

# Modo tunnel (para dispositivos remotos)
npx expo start --tunnel
```

### Plataformas Específicas

```bash
# Abrir no iOS Simulator
npx expo start --ios

# Abrir no Android Emulator
npx expo start --android

# Abrir no navegador web
npx expo start --web
```

### Ferramentas de Debug

```bash
# Abrir dev tools
npx expo start --dev-client

# Logs detalhados
npx expo start --verbose

# Modo offline
npx expo start --offline
```

## 🏗️ Sistema de Build (EAS)

### Configuração EAS

```bash
# Inicializar EAS no projeto
eas init

# Login no Expo
eas login

# Configurar credenciais
eas credentials
```

### Profiles de Build

#### Development Build

```bash
# Build local para desenvolvimento
eas build --profile development --platform android --local
eas build --profile development --platform ios --local

# Build no servidor
eas build --profile development --platform all
```

#### Preview Build

```bash
# Build para testes internos
eas build --profile preview --platform android
eas build --profile preview --platform ios
```

#### Production Build

```bash
# Build para produção
eas build --profile production --platform all
eas build --profile production --platform android
eas build --profile production --platform ios
```

### Configurações EAS (eas.json)

```json
{
  "cli": {
    "version": ">= 5.2.0",
    "appVersionSource": "local"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {}
  }
}
```

## 🎨 Sistema de Temas

### Implementação

O app possui um sistema de temas robusto com:

- **Contexto Global** - `ThemeProvider` no nível raiz
- **Persistência** - Tema salvo no SQLite
- **Componentes Temáticos** - `ThemedView` e `ThemedText`
- **Alternância Instantânea** - Sem necessidade de reload

### Cores Definidas

```typescript
export const Colors = {
  light: {
    text: "#000000",
    background: "#fff",
    tint: "#007AFF",
    tabIconDefault: "#666666",
    tabIconSelected: "#007AFF",
  },
  dark: {
    text: "#ECEDEE",
    background: "#151718",
    tint: "#fff",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: "#fff",
  },
};
```

## 💾 Gestão de Dados

### SQLite KV Store

```typescript
import Storage from "expo-sqlite/kv-store";

// Salvar dados
await Storage.setItem("todos", JSON.stringify(todos));

// Carregar dados
const storedTodos = await Storage.getItem("todos");

// Salvar preferência de tema
await Storage.setItem("user_theme_preference", theme);
```

### Estrutura de Dados

```typescript
interface Todo {
  id: string; // ID único da tarefa
  text: string; // Texto da tarefa
  completed: boolean; // Status de conclusão
  createdAt: number; // Timestamp de criação
}
```

## 🔧 Ferramentas MCP

### Comandos Disponíveis

```bash
# Buscar documentação Expo
mcp_search_documentation "expo router navigation"

# Adicionar biblioteca
mcp_add_library expo-sqlite

# Gerar contexto para agentes
mcp_generate_agents_md

# Aprender tópicos específicos
mcp_learn expo-router
```

### Integração MCP

- **expo-mcp@0.1.13** - Pacote MCP da Expo
- **Documentação em tempo real** - Acesso à docs atualizada
- **Assistência de desenvolvimento** - Suporte contextual

## 📊 Scripts Disponíveis

```json
{
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web",
    "reset-project": "node ./scripts/reset-project.js"
  }
}
```

## 🌐 Deploy e Distribuição

### Exportação Web

```bash
# Exportar para web estática
npx expo export --platform web

# Servir localmente
npx serve dist
```

### Submissão para Stores

```bash
# Submeter para App Store
eas submit --platform ios

# Submeter para Google Play
eas submit --platform android

# Submeter para ambas
eas submit --platform all
```

## 🐛 Troubleshooting

### Problemas Comuns

#### Erro SQLite WASM (Web)

```bash
# Instalar dependência WASM
npm install @sqlite.org/sqlite-wasm

# Verificar metro.config.js
# Deve incluir: config.resolver.assetExts.push('wasm')
```

#### Build EAS Falha

```bash
# Verificar configurações
eas build:configure

# Limpar credenciais
eas credentials

# Build com logs detalhados
eas build --profile development --platform android --verbose
```

#### Temas Não Atualizam

- Verificar se `ThemeProvider` está no nível raiz
- Confirmar uso do contexto correto
- Checar persistência no SQLite

### Logs e Debug

```bash
# Logs do dispositivo
npx expo logs --device

# Debug remoto
npx expo start --dev-client

# Inspecionar bundle
npx expo export --dev --dump-sourcemap
```

## 📈 Performance

### Otimizações Implementadas

- **React Compiler** - Otimização automática
- **Typed Routes** - Navegação tipada
- **KV Store** - Acesso rápido aos dados
- **Componentes Memoizados** - Redução de re-renders

### Métricas de Bundle

```
Web Bundles:
- entry.js: 2.88 MB
- worker.js: 141 kB

Static Routes: 7
- / (index): 31.2 kB
- /explore: 31.2 kB
- /modal: 34.7 kB
```

## 🤝 Contribuição

### Estrutura de Desenvolvimento

1. **Fork** o repositório
2. **Create** uma branch para sua feature
3. **Commit** suas mudanças
4. **Push** para a branch
5. **Abra** um Pull Request

### Padrões de Código

- **TypeScript** obrigatório
- **ESLint** configurado
- **Prettier** para formatação
- **Comentários** em código complexo

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👥 Autores

- **Carlos Lima** - Desenvolvimento inicial e MCP integration

## 🔗 Links Úteis

- [Expo Documentation](https://docs.expo.dev/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [EAS Build](https://docs.expo.dev/build/introduction/)
- [SQLite KV Store](https://docs.expo.dev/versions/latest/sdk/sqlite/)
- [React Native](https://reactnative.dev/)

---

**Desenvolvido com ❤️ usando Expo e MCP**
