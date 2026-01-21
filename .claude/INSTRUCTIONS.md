# Claude Code - Instrucoes do Projeto

## REGRA CRITICA #1: globals.css

O arquivo `app/globals.css` contem estilos ESSENCIAIS para os componentes HeroUI funcionarem corretamente.

### Secao protegida: HEROUI COMPONENT FIXES (linhas ~73-205)

Esta secao CORRIGE bugs visuais do HeroUI:
- Labels flutuando incorretamente
- Fundos transparentes em inputs
- Loading de botoes travando
- Dropdowns sem estilo

**NUNCA** remova ou modifique esta secao. Se os componentes quebrarem, a solucao e:

1. Limpar o cache: `npm run clean`
2. Reiniciar o dev server: `npm run dev`

### Se precisar adicionar estilos

Adicione APOS a secao `END HEROUI COMPONENT FIXES`, nunca dentro dela.

---

## REGRA CRITICA #2: Nao use !important

Os overrides do HeroUI funcionam por especificidade CSS, nao por !important.
Usar !important pode quebrar estados internos dos componentes (hover, focus, loading).

---

## REGRA CRITICA #3: Componentes HeroUI

Sempre use `variant="bordered"` para inputs e selects:

```tsx
<Input variant="bordered" />
<Select variant="bordered" />
<Autocomplete variant="bordered" />
```

---

## Estrutura do globals.css

```
1. @import "tailwindcss"
2. @source HeroUI theme
3. :root - Variaveis CSS
4. @theme inline - Tailwind v4
5. Base styles (html, body)
6. HEROUI COMPONENT FIXES  <-- NAO MEXA
7. Typography
8. Focus/Selection
9. Scrollbar
10. Animations
```

---

## Comandos uteis

```bash
# Limpar cache (resolve maioria dos bugs visuais)
npm run clean

# Dev com cache limpo
npm run dev:clean

# Build de producao
npm run build
```

---

## Checklist antes de modificar CSS

- [ ] Estou modificando a secao HEROUI COMPONENT FIXES? **PARE**
- [ ] Estou adicionando !important? **NAO FACA**
- [ ] O componente HeroUI quebrou? **npm run clean**
