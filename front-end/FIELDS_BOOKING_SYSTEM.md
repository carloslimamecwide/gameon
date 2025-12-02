# Sistema de Reserva de Campos - FootMatch

## 📋 Visão Geral

O FootMatch agora inclui um sistema completo de busca e reserva de campos de futebol com funcionalidades avançadas de geolocalização e filtros inteligentes.

## 🌟 Principais Funcionalidades

### 🎯 Busca por Localização

- **GPS Automático**: Detecta automaticamente sua localização atual
- **Cálculo de Distância**: Mostra campos ordenados por proximidade usando a fórmula Haversine
- **Permissões Inteligentes**: Gerenciamento seguro de permissões de localização

### 🔍 Sistema de Filtros

- **Busca por Nome**: Encontre campos pelo nome ou endereço
- **Filtro por Tipo**: 5v5, 7v7, 11v11 ou todos
- **Ordenação por Distância**: Campos mais próximos aparecem primeiro

### ⚽ Gestão de Reservas

- **Horários em Tempo Real**: Visualize slots disponíveis e ocupados
- **Reserva Instantânea**: Reserve um campo com apenas alguns toques
- **Confirmação Visual**: Modal detalhado com resumo da reserva

### 📱 Interface Otimizada

- **Design Responsivo**: Otimizado para iOS e Android
- **Indicadores Visuais**: Status de localização, disponibilidade e preços
- **Navegação Intuitiva**: Tab dedicada com ícone 🏟️

## 🛠️ Estrutura Técnica

### Componentes Principais

#### `FieldsScreen` (`/app/(tabs)/fields.tsx`)

- **Estado de Localização**: Gerencia GPS e permissões
- **Lista de Campos**: Renderiza campos com distâncias calculadas
- **Modal de Reserva**: Interface completa de booking

#### Tipos TypeScript

```typescript
interface Field {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  distance?: number;
  rating: number;
  pricePerHour: number;
  type: "5v5" | "7v7" | "11v11";
  amenities: string[];
  availableSlots: TimeSlot[];
}

interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  available: boolean;
  price: number;
}
```

### 📍 Geolocalização

#### Configuração (`app.json`)

```json
{
  "plugins": [
    [
      "expo-location",
      {
        "locationAlwaysAndWhenInUsePermission": "Permitir que o $(PRODUCT_NAME) use sua localização para encontrar campos próximos.",
        "locationWhenInUsePermission": "Permitir que o $(PRODUCT_NAME) use sua localização para encontrar campos próximos."
      }
    ]
  ]
}
```

#### Cálculo de Distância (Fórmula Haversine)

```typescript
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Raio da Terra em km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};
```

## 🎨 Design System

### Estados de Localização

- **🔄 Carregando**: Indicador com spinner durante busca GPS
- **✅ Sucesso**: "📍 Campos próximos à sua localização"
- **⚠️ Erro**: Mensagem explicativa para problemas de permissão

### Cards de Campo

- **Header**: Nome, endereço, distância, rating e tipo
- **Amenidades**: Tags coloridas com facilidades disponíveis
- **Horários**: Scroll horizontal com slots disponíveis/ocupados
- **Cores**: Verde para disponível, cinza para ocupado

### Modal de Reserva

- **Resumo**: Informações completas do campo e horário
- **Preço**: Destaque visual para valor da reserva
- **Amenidades**: Lista detalhada de facilidades incluídas
- **Ações**: Cancelar ou confirmar reserva

## 📊 Dados Mock (Lisboa)

O sistema usa dados de exemplo com coordenadas reais de Lisboa:

1. **Campo do Bairro** (38.7223, -9.1393)

   - Tipo: 5v5
   - Preço: €25-35/hora
   - Amenidades: Balneários, Estacionamento, Bar

2. **Complexo Desportivo Central** (38.7436, -9.1426)

   - Tipo: 7v7
   - Preço: €35-45/hora
   - Amenidades: Balneários, Estacionamento, Bar, Iluminação

3. **Estádio Municipal** (38.7564, -9.1549)
   - Tipo: 11v11
   - Preço: €50-60/hora
   - Amenidades: Balneários, Estacionamento, Bar, Iluminação, Bancadas

## 🚀 Futuras Melhorias

### Próximas Funcionalidades

- [ ] **Integração com API Real**: Conectar com base de dados de campos
- [ ] **Sistema de Pagamento**: Integração com Stripe/PayPal
- [ ] **Avaliações**: Sistema de reviews e ratings
- [ ] **Fotos**: Upload e galeria de imagens dos campos
- [ ] **Reservas Recorrentes**: Agendamento semanal/mensal
- [ ] **Notificações**: Push notifications para confirmações
- [ ] **Mapa Interativo**: Visualização de campos no mapa
- [ ] **Filtros Avançados**: Por preço, amenidades, horário

### Melhorias Técnicas

- [ ] **Cache de Localização**: Persistir última localização conhecida
- [ ] **Offline Support**: Funcionalidade básica sem internet
- [ ] **Otimizações de Performance**: Lazy loading e virtualization
- [ ] **Analytics**: Tracking de uso e conversões

## 📝 Como Usar

1. **Acesse a Tab Campos** (🏟️)
2. **Permita Localização** quando solicitado
3. **Aguarde o Carregamento** dos campos próximos
4. **Use os Filtros** para refinar a busca
5. **Escolha um Campo** da lista ordenada por distância
6. **Selecione um Horário** disponível (verde)
7. **Confirme a Reserva** no modal detalhado
8. **Receba Confirmação** com todos os detalhes

## 🔧 Configuração de Desenvolvimento

### Dependências

```bash
npx expo install expo-location
```

### Permissões iOS

```xml
<key>NSLocationWhenInUseUsageDescription</key>
<string>Permitir localização para encontrar campos próximos</string>
```

### Permissões Android

```xml
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
```

---

**FootMatch** - Sistema completo de gestão e reserva de campos de futebol com tecnologia avançada de geolocalização! 🏟️⚽
