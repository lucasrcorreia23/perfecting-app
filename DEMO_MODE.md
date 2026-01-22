# Modo Demo - ElevenLabs UI

## 📋 Visão Geral

O modo demo permite testar a interface do ElevenLabs **sem precisar da API** configurada. É perfeito para:

- Demonstrações e apresentações
- Desenvolvimento de UI
- Testes visuais
- Preview sem custos de API

## 🎯 Como Usar

### Ativar Modo Demo

No arquivo `app/(dashboard)/roleplays/scenario/[slug]/page.tsx`, na linha ~513:

```tsx
<VoiceInterface
  agent={...}
  roleplayId="current-roleplay"
  redirectToAnalytics={false}
  useElevenLabsAgent={false}
  demoMode={true}  // ✅ Modo demo ATIVADO
  onEnd={handleEndCall}
/>
```

### Ativar API Real

Para usar a API real do ElevenLabs:

```tsx
<VoiceInterface
  agent={...}
  roleplayId="current-roleplay"
  redirectToAnalytics={false}
  useElevenLabsAgent={true}   // ✅ Usar API real
  demoMode={false}             // ✅ Desativar demo
  onEnd={handleEndCall}
/>
```

## ⚙️ Configuração da API Real

Quando estiver pronto para usar a API real:

1. **Configure as variáveis de ambiente** (`.env.local`):
   ```env
   ELEVENLABS_API_KEY=your_api_key_here
   NEXT_PUBLIC_ELEVENLABS_AGENT_ID=your_agent_id_here
   ```

2. **Obtenha suas credenciais**:
   - API Key: https://elevenlabs.io/app/settings/api-keys
   - Agent ID: https://elevenlabs.io/app/conversational-ai

3. **Ative no código**:
   ```tsx
   useElevenLabsAgent={true}
   demoMode={false}
   ```

## 🎭 O que o Modo Demo Simula

### Estados Simulados

- ✅ **Conectando**: 2 segundos de delay inicial
- ✅ **Conectado**: Status verde "Ouvindo..."
- ✅ **Falando**: Alternância automática a cada 5 segundos
- ✅ **Transcrição**: Mensagens mockadas do agente e usuário
- ✅ **Orb animado**: Todos os estados visuais funcionando

### Mensagens Mockadas

**Agente:**
- "Entendo sua preocupação. Vamos explorar isso juntos."
- "Excelente ponto! Isso é muito importante no contexto de vendas."
- "Posso sugerir uma abordagem diferente para essa situação?"
- "Com base no que você disse, vejo algumas oportunidades aqui."

**Usuário:**
- "Como eu posso lidar com essa objeção?"
- "Qual seria a melhor forma de abordar esse cliente?"
- "Preciso de ajuda com o fechamento da venda."
- "O cliente está hesitante, o que devo fazer?"

## 🔄 Transição entre Modos

### Demo → Produção

1. Configure `.env.local` com credenciais reais
2. Altere props do componente:
   ```tsx
   useElevenLabsAgent={true}
   demoMode={false}
   ```
3. Reinicie o servidor de desenvolvimento

### Produção → Demo

1. Não precisa remover credenciais
2. Apenas altere as props:
   ```tsx
   useElevenLabsAgent={false}
   demoMode={true}
   ```
3. Reinicie o servidor

## 🎨 Identificação Visual

O modo demo adiciona "(Demo)" ao status de conexão:

- **Demo**: "Conectando... (Demo)"
- **Real**: "Conectando..."

## 📊 Funcionalidades

### Funcionam em Ambos os Modos

- ✅ Orb 3D animado
- ✅ Estados visuais (idle, listening, talking)
- ✅ Timer de duração
- ✅ Transcrição ao vivo
- ✅ Botão de encerrar chamada
- ✅ Status do microfone
- ✅ Redirecionamento para analytics

### Apenas no Modo Real

- 🎤 Captura de áudio real do microfone
- 🔊 Reprodução de áudio do agente
- 💬 Conversação real com IA
- 📡 WebRTC connection
- 🔐 Autenticação via signed URL

## 🚨 Importante

- O modo demo **não consome créditos** da API
- Use demo mode para **desenvolvimento e demonstração**
- Use API real para **produção e testes funcionais**
- O modo está **configurado por página**, não globalmente

## 📝 Notas Técnicas

### Implementação

O modo demo usa:
- Estados locais (`demoStatus`, `demoIsSpeaking`)
- Timers e intervals para simular comportamento
- Mensagens pré-definidas rotacionadas aleatoriamente
- Mesma interface visual do modo real

### Performance

- ✅ Sem chamadas de API
- ✅ Sem WebRTC overhead
- ✅ Sem processamento de áudio
- ✅ Ideal para desenvolvimento local

## 🔧 Troubleshooting

### Orb não aparece no demo?
- Verifique se `demoMode={true}` está definido
- Confirme que Three.js está instalado
- Veja console do browser para erros

### Transcrição não aparece?
- É normal demorar 2-5 segundos para as primeiras mensagens
- Mensagens aparecem durante alternância de estados
- Verifique console para erros de state

### Como saber qual modo está ativo?
- Procure "(Demo)" no chip de status
- Console mostra logs diferentes para cada modo
- Demo não pede permissão de microfone

## 📖 Documentação Adicional

- `README_ELEVENLABS.md` - Integração oficial completa
- `ELEVENLABS_OFFICIAL_SETUP.md` - Setup da API
- `QUICK_START.md` - Início rápido (5 min)
- `IMPLEMENTATION_SUMMARY.md` - Sumário técnico
