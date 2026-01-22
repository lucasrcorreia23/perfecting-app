# 🎙️ Quick Start: ElevenLabs Integration

## ⚡ Início Rápido (5 minutos)

### 1. Configure a API Key

```bash
# 1. Copie o template
cp .env.example .env.local

# 2. Abra o arquivo
notepad .env.local  # Windows
# ou
nano .env.local     # Mac/Linux
```

### 2. Adicione sua chave ElevenLabs

```env
NEXT_PUBLIC_ELEVENLABS_API_KEY=sk_sua_chave_real_aqui
```

**Onde conseguir:** https://elevenlabs.io/app/settings/api-keys

### 3. (Opcional) Teste uma voz

Visite https://elevenlabs.io/app/voice-lab e escolha ou clone vozes.

### 4. Use no código

```tsx
import { VoiceInterface } from "@/components/roleplay";

// Modo real com ElevenLabs
<VoiceInterface 
  agent={agent}
  useRealVoice={true}  // ← Ativa ElevenLabs
/>

// Modo simulação (padrão)
<VoiceInterface 
  agent={agent}
  useRealVoice={false}
/>
```

### 5. Inicie o servidor

```bash
npm run dev
```

Acesse http://localhost:3000 e teste um roleplay!

---

## 🎯 Status Atual

### ✅ Já Implementado
- Hook `useVoiceCall` com integração ElevenLabs
- Componente `VoiceInterface` atualizado
- Cliente ElevenLabs em `lib/elevenlabs/client.ts`
- Reconhecimento de voz (Web Speech API)
- Síntese de voz (ElevenLabs TTS)
- Fallback automático para simulação
- Controles: mute, pause, disconnect
- Transcrição em tempo real

### 🔄 Como Funciona

```
1. Usuário clica "Iniciar Chamada"
   ↓
2. Sistema pede permissão do microfone
   ↓
3. Agente fala (ElevenLabs TTS)
   ↓
4. Sistema ouve usuário (Web Speech API)
   ↓
5. Processa resposta (função simulada*)
   ↓
6. Agente responde (ElevenLabs TTS)
   ↓
7. Volta ao passo 4

* Pode ser substituído por GPT-4/Claude
```

### 🎨 Voice IDs Disponíveis (Pre-built)

```typescript
// Vozes femininas
"21m00Tcm4TlvDq8ikWAM"  // Rachel - profissional, clara
"AZnzlk1XvdvUeBnXmlld"  // Domi - confiante, forte
"EXAVITQu4vr4xnSDxMaL"  // Bella - suave, amigável
"MF3mGyEYCl7XYWbV9V6O"  // Elli - emotiva, expressiva

// Vozes masculinas
"ErXwobaYiN019PkySvjV"  // Antoni - storytelling
"TxGEqnHWrfWFTfGW9XjX"  // Josh - casual, jovem
"VR6AewLTigWG4xSOukaG"  // Arnold - autoritária
"pNInz6obpgDQGcFmaJgB"  // Adam - profunda
"yoZ06aMxZJJ28mfd3POQ"  // Sam - dinâmica
```

Configure em `lib/mock-data.ts`:

```typescript
{
  id: "char-1",
  name: "Carlos Mendes",
  voiceId: "TxGEqnHWrfWFTfGW9XjX", // Josh
  // ...
}
```

---

## 💰 Custos ElevenLabs

| Plano      | Preço/mês | Caracteres |
|------------|-----------|------------|
| Free       | $0        | 10.000     |
| Starter    | $5        | 30.000     |
| Creator    | $22       | 100.000    |
| Pro        | $99       | 500.000    |

**Estimativa:** Uma conversa de 5 min ≈ 1.000-2.000 caracteres

---

## 🐛 Problemas Comuns

### "API key not set"
```bash
# Certifique-se de:
1. Criar .env.local na raiz do projeto
2. Adicionar NEXT_PUBLIC_ELEVENLABS_API_KEY=...
3. Reiniciar npm run dev
```

### "Microfone não funciona"
```
1. Verifique permissões no navegador
2. Use HTTPS em produção (HTTP só funciona em localhost)
3. Teste em Chrome/Edge (melhor suporte)
```

### "Áudio não toca"
```
1. Verifique se voiceId é válido
2. Teste o voice ID em elevenlabs.io
3. Veja console do browser para erros
```

### "401 Unauthorized"
```
API key inválida ou expirada.
Gere nova em: elevenlabs.io/app/settings/api-keys
```

---

## 📚 Documentação Completa

- **Setup Detalhado**: `ELEVENLABS_SETUP.md`
- **Integração Técnica**: `README_INTEGRATION.md`
- **Código do Hook**: `hooks/useVoiceCall.ts`
- **Cliente ElevenLabs**: `lib/elevenlabs/client.ts`

---

## 🚀 Próximos Passos (Opcional)

1. **Integrar LLM**: Substituir respostas simuladas por GPT-4/Claude
2. **Customizar vozes**: Clonar vozes específicas para cada personagem
3. **Streaming**: Usar `textToSpeechStream()` para menor latência
4. **Analytics**: Adicionar análise de sentimento em tempo real

---

## 📞 Exemplo de Uso Completo

```tsx
"use client";

import { VoiceInterface } from "@/components/roleplay";
import { useState } from "react";

export default function RoleplayCallPage() {
  const [isCallEnded, setIsCallEnded] = useState(false);

  const agent = {
    id: "1",
    name: "Carlos Mendes",
    role: "Diretor de TI",
    avatar: "https://i.pravatar.cc/150?u=carlos",
    voiceId: "TxGEqnHWrfWFTfGW9XjX", // Josh (ElevenLabs)
    personality: "Profissional, direto ao ponto",
    context: "Estou avaliando soluções de TI para nossa empresa",
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {!isCallEnded ? (
        <VoiceInterface
          agent={agent}
          roleplayId="1"
          useRealVoice={true}  // ← Ativa ElevenLabs
          onEnd={() => setIsCallEnded(true)}
          redirectToAnalytics={true}
        />
      ) : (
        <div className="text-center">
          <h2 className="text-2xl font-bold">Chamada Encerrada</h2>
          <p className="text-gray-600 mt-2">
            Redirecionando para analytics...
          </p>
        </div>
      )}
    </div>
  );
}
```

---

**Pronto! 🎉** A integração com ElevenLabs está completa e funcionando.
