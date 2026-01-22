# 🎙️ ElevenLabs Conversational AI (Agents) - Setup Oficial

Esta é a integração **oficial** usando o SDK `@elevenlabs/react` e ElevenLabs Agents.

## 🆚 Diferença entre as abordagens

### Abordagem Oficial (Atual) ✅
- SDK oficial `@elevenlabs/react`
- **ElevenLabs Conversational AI (Agents)**
- WebRTC para baixa latência
- Conversação bidirecional em tempo real
- Gerenciamento automático de turnos
- Contexto e personalidade do agente

### Abordagem Manual (Anterior) ❌
- Cliente customizado (apenas TTS)
- Web Speech API do browser
- Sistema de conversa simulado
- Maior latência
- Gerenciamento manual

---

## 📋 Pré-requisitos

1. Conta ElevenLabs - [Criar conta](https://elevenlabs.io/app/sign-up)
2. API Key da ElevenLabs
3. Agent criado no painel ElevenLabs

---

## 🚀 Setup Rápido

### 1. Criar um Agent no ElevenLabs

<Steps>
  <Step>
    Acesse o [painel de Agents](https://elevenlabs.io/app/conversational-ai)
  </Step>
  <Step>
    Clique em **"Create New Agent"**
  </Step>
  <Step>
    Configure o agente:
    - **Name**: Nome do seu agente (ex: "Carlos Mendes - Diretor de TI")
    - **Voice**: Escolha uma voz (ex: "Josh" para masculino profissional)
    - **Personality**: Descreva o comportamento do agente
    - **Context**: Adicione informações sobre o cenário
    - **First Message**: Mensagem inicial (ex: "Olá! Eu sou Carlos, Diretor de TI...")
  </Step>
  <Step>
    **Copie o Agent ID** - você vai precisar dele
  </Step>
  <Step>
    Configure se o agente é **público ou privado**:
    - **Público**: Qualquer um com o Agent ID pode usar
    - **Privado**: Requer signed URL (mais seguro)
  </Step>
</Steps>

### 2. Configurar Variáveis de Ambiente

Crie/edite `.env.local`:

```env
# ElevenLabs API Key (obrigatória para agentes privados)
ELEVENLABS_API_KEY=sk_sua_chave_aqui

# Agent ID (obrigatório)
NEXT_PUBLIC_ELEVENLABS_AGENT_ID=seu_agent_id_aqui
```

**Onde conseguir:**
- **API Key**: https://elevenlabs.io/app/settings/api-keys
- **Agent ID**: https://elevenlabs.io/app/conversational-ai (copie do agente criado)

### 3. Reiniciar o servidor

```bash
npm run dev
```

### 4. Testar

Acesse um roleplay e clique em "Iniciar Chamada". O sistema vai:
1. Pedir permissão do microfone
2. Conectar via WebRTC com o agente
3. Agente dá boas-vindas
4. Você pode conversar naturalmente!

---

## 🔐 Autenticação (Agentes Privados)

Se seu agente é **privado**, a rota de API já está configurada:

```typescript
// app/api/get-signed-url/route.ts
// ✅ Já implementado no projeto
```

O sistema automaticamente:
1. Busca signed URL do servidor
2. Usa a URL para autenticar
3. Inicia a sessão WebRTC

---

## 🎛️ Configuração do Agent (Avançado)

No painel ElevenLabs, você pode configurar:

### Personalidade
```
Você é um Diretor de TI de uma empresa de médio porte.
Você é profissional, objetivo e um pouco cético com novas tecnologias.
Gosta de ver ROI claro e métricas concretas.
```

### Contexto
```
Sua empresa tem 500 funcionários e está avaliando soluções de cloud.
Orçamento anual de TI: $2M. Principais preocupações: segurança, integração, suporte.
```

### First Message
```
Olá! Sou Carlos Mendes, Diretor de TI da TechCorp. 
Vi que vocês têm uma solução de cloud. Pode me contar mais?
```

### Knowledge Base (Opcional)
- Faça upload de documentos (PDF, DOCX)
- Adicione URLs de websites
- O agente usará essas informações nas respostas

### Tools & Functions (Opcional)
- Integre APIs externas
- Acesse banco de dados
- Execute ações personalizadas

---

## 🔧 Uso no Código

### Básico (Auto-start)

```tsx
import { VoiceInterface } from "@/components/roleplay";

<VoiceInterface
  agent={agent}
  roleplayId="1"
  useElevenLabsAgent={true} // Padrão
/>
```

### Avançado (Controle manual)

```tsx
"use client";

import { useConversation } from "@elevenlabs/react";

export function MyComponent() {
  const conversation = useConversation({
    onConnect: () => console.log('Connected!'),
    onDisconnect: () => console.log('Disconnected'),
    onMessage: (message) => console.log(message),
    onError: (error) => console.error(error),
  });

  const start = async () => {
    await navigator.mediaDevices.getUserMedia({ audio: true });
    
    // Se agente é PRIVADO:
    const response = await fetch("/api/get-signed-url");
    const { signedUrl } = await response.json();
    await conversation.startSession({ signedUrl });

    // Se agente é PÚBLICO:
    await conversation.startSession({
      agentId: 'YOUR_AGENT_ID',
      connectionType: 'webrtc'
    });
  };

  return (
    <div>
      <button onClick={start}>Start</button>
      <button onClick={() => conversation.endSession()}>Stop</button>
      <p>Status: {conversation.status}</p>
      <p>{conversation.isSpeaking ? 'Agent speaking' : 'Listening'}</p>
    </div>
  );
}
```

---

## 🎯 Estados da Conversação

```typescript
conversation.status
// 'disconnected' | 'connecting' | 'connected'

conversation.isSpeaking
// true quando agente está falando

conversation.startSession()
// Inicia conversação

conversation.endSession()
// Encerra conversação
```

---

## 📊 Mensagens (Transcript)

```typescript
onMessage: (message) => {
  console.log(message.source); // 'user' | 'ai'
  console.log(message.message); // Texto da mensagem
}
```

---

## 💰 Custos

| Plano       | Preço/mês | Minutos de conversação |
|-------------|-----------|------------------------|
| Free        | $0        | 10 minutos             |
| Starter     | $5        | 30 minutos             |
| Creator     | $22       | 100 minutos            |
| Pro         | $99       | 500 minutos            |
| Scale       | $330      | 2.000 minutos          |

**Nota**: Conversas usando Agents são cobradas por **minutos de conversação**, não por caracteres.

---

## 🐛 Troubleshooting

### "Failed to get signed URL"
```bash
# Verifique:
1. ELEVENLABS_API_KEY está correta no .env.local
2. NEXT_PUBLIC_ELEVENLABS_AGENT_ID está correto
3. Reiniciou npm run dev após adicionar as variáveis
```

### "Agent not found"
```bash
# Certifique-se de que:
1. Agent ID está correto (copie do painel)
2. Agent está ativo (não deletado)
3. Se privado, API key tem permissão
```

### "Microfone não funciona"
```bash
# Verifique:
1. Permissões do navegador (chrome://settings/content/microphone)
2. Use HTTPS em produção (HTTP só localhost)
3. Teste em Chrome/Edge (melhor suporte WebRTC)
```

### "Connection timeout"
```bash
# Possíveis causas:
1. Firewall bloqueando WebRTC
2. Rede corporativa restritiva
3. VPN interferindo
```

### Signed URL expira
```bash
# Signed URLs duram ~5 minutos
# Conversas já iniciadas continuam funcionando
# Novas conversas precisam de nova URL
```

---

## 🔄 Migração da Abordagem Anterior

Se você estava usando a abordagem manual (TTS + Speech Recognition):

**Antes:**
```tsx
<VoiceInterface useRealVoice={true} />
```

**Agora:**
```tsx
<VoiceInterface useElevenLabsAgent={true} />
```

**Benefícios da migração:**
- ✅ Latência 3-5x menor (WebRTC vs HTTP)
- ✅ Conversação natural (sem gerenciamento manual)
- ✅ Contexto persistente
- ✅ Interrupções naturais
- ✅ Suporte oficial
- ✅ Escalabilidade

---

## 📚 Recursos

- [Documentação Oficial](https://elevenlabs.io/docs/conversational-ai/quickstart)
- [SDK React](https://www.npmjs.com/package/@elevenlabs/react)
- [Exemplo Next.js Oficial](https://github.com/elevenlabs/elevenlabs-examples/tree/main/examples/conversational-ai/nextjs)
- [Painel de Agents](https://elevenlabs.io/app/conversational-ai)
- [API Reference](https://elevenlabs.io/docs/api-reference/conversational-ai)

---

## 🎓 Próximos Passos

1. **Criar múltiplos agentes** - um para cada personagem do roleplay
2. **Adicionar Knowledge Base** - documentos sobre produtos/serviços
3. **Configurar Tools** - integrar com CRM, banco de dados, etc.
4. **Análise de conversas** - usar transcrições para analytics
5. **Fine-tuning** - ajustar personalidade baseado em feedback

---

## ✅ Checklist de Setup

- [ ] Criar conta ElevenLabs
- [ ] Obter API Key
- [ ] Criar Agent no painel
- [ ] Copiar Agent ID
- [ ] Configurar `.env.local`
- [ ] Reiniciar `npm run dev`
- [ ] Testar conversação
- [ ] Ajustar personalidade do agente
- [ ] (Opcional) Adicionar Knowledge Base
- [ ] (Opcional) Configurar Tools

**Pronto! 🎉** Agora você tem uma integração oficial e profissional com ElevenLabs Conversational AI.
