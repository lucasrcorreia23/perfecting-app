# Configuração ElevenLabs

Este guia explica como configurar a integração com ElevenLabs para síntese de voz realista nos roleplays.

## 1. Obter API Key

1. Acesse [elevenlabs.io](https://elevenlabs.io/)
2. Crie uma conta ou faça login
3. Vá em **Profile Settings** → **API Keys**
4. Copie sua API key

## 2. Configurar variáveis de ambiente

1. Crie um arquivo `.env.local` na raiz do projeto:

```bash
# Na raiz do projeto
touch .env.local
```

2. Adicione sua API key:

```env
NEXT_PUBLIC_ELEVENLABS_API_KEY=sua_chave_api_aqui
```

## 3. Escolher Vozes

Cada personagem precisa de um `voiceId` da ElevenLabs. Você pode:

### Opção A: Usar vozes pré-construídas

Vozes padrão disponíveis:
- `21m00Tcm4TlvDq8ikWAM` - Rachel (feminina, profissional)
- `AZnzlk1XvdvUeBnXmlld` - Domi (feminina, confiante)
- `EXAVITQu4vr4xnSDxMaL` - Bella (feminina, soft)
- `ErXwobaYiN019PkySvjV` - Antoni (masculina, storytelling)
- `MF3mGyEYCl7XYWbV9V6O` - Elli (feminina, emotiva)
- `TxGEqnHWrfWFTfGW9XjX` - Josh (masculina, casual)
- `VR6AewLTigWG4xSOukaG` - Arnold (masculina, autoritária)
- `pNInz6obpgDQGcFmaJgB` - Adam (masculina, profunda)
- `yoZ06aMxZJJ28mfd3POQ` - Sam (masculina, dinâmica)

### Opção B: Clonar sua própria voz

1. No painel ElevenLabs, vá em **Voice Lab** → **Add Generative or Cloned Voice**
2. Faça upload de amostras de áudio (1-5 minutos)
3. Copie o `voice_id` gerado

## 4. Atualizar personagens

No arquivo `lib/mock-data.ts`, certifique-se de que cada personagem tem um `voiceId` válido:

```typescript
{
  id: "char-1",
  name: "Carlos Mendes",
  voiceId: "21m00Tcm4TlvDq8ikWAM", // Voice ID da ElevenLabs
  // ...
}
```

## 5. Ativar integração real

No arquivo onde você usa o componente de roleplay, passe `useRealVoice={true}`:

```typescript
<VoiceInterface 
  agent={agent} 
  useRealVoice={true}  // ← Ativa ElevenLabs
/>
```

## 6. Testar

1. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

2. Acesse um roleplay e clique em "Iniciar Chamada"
3. Permita acesso ao microfone quando solicitado
4. Fale algo e aguarde a resposta sintetizada

## Limites e Custos

- **Free tier**: 10.000 caracteres/mês
- **Starter**: $5/mês - 30.000 caracteres
- **Creator**: $22/mês - 100.000 caracteres
- **Pro**: $99/mês - 500.000 caracteres

Cada resposta do agente consome caracteres baseado no tamanho do texto.

## Fallback (Modo Simulação)

Se a API key não estiver configurada, o sistema automaticamente usa o modo simulação:
- Reconhecimento de voz nativo do browser (Web Speech API)
- Sem síntese de voz
- Funcionalidade básica mantida

## Troubleshooting

### Erro: "NEXT_PUBLIC_ELEVENLABS_API_KEY is not set"

→ Certifique-se de criar o arquivo `.env.local` e adicionar a chave

### Erro: "ElevenLabs API error: 401"

→ Sua API key está inválida ou expirada. Gere uma nova.

### Erro: "Erro no reconhecimento de voz"

→ Verifique se deu permissão ao microfone no browser
→ Teste em navegadores modernos (Chrome, Edge, Safari)

### Áudio não reproduz

→ Verifique se o `voiceId` do personagem é válido
→ Teste o voice ID diretamente no painel ElevenLabs

## Próximos passos (Opcional)

Para melhorar ainda mais a experiência:

1. **Integrar LLM (GPT-4)**: Substituir `generateAgentResponse()` por chamadas a OpenAI/Anthropic
2. **Ajustar configurações de voz**: Personalizar `stability`, `similarityBoost` por personagem
3. **Streaming de áudio**: Usar `textToSpeechStream()` para respostas mais rápidas
4. **Análise de sentimento**: Processar transcrições em tempo real
