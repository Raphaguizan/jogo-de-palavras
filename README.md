# 🎲 Jogo de Palavras

Um aplicativo web simples e divertido para jogar em grupo com família e amigos, focado em **sorteio de palavras**, **jogos de desenho**, **mímica**, **adivinhação** e desafios com **temporizador**.

O projeto foi pensado para funcionar perfeitamente em **celular (modo portrait)** e pode ser acessado diretamente pelo navegador ou salvo na tela inicial como um app.

👉 **Acesse o app aqui:**  
🔗 https://raphaguizan.github.io/jogo-de-palavras/

---

## 🕹️ Jogos disponíveis

### 📝 1. Sortear Palavras
- Sorteia uma quantidade configurável de palavras
- Ideal para jogos de desenho, mímica ou criatividade
- Mostra as palavras numeradas na tela

### ⏱️ 2. Palavra + Timer
- Sorteia uma palavra secreta
- Possibilidade de esconder/mostrar a palavra
- Temporizador com:
  - Tempo de preparação
  - Som de início
  - Bipes nos últimos segundos
  - Alarme e vibração no final
- Tela de contagem regressiva em overlay (bloqueia interação)

---

## 📂 Sistema de categorias

O app possui um sistema de **categorias de palavras**, onde o jogador pode escolher quais listas serão usadas no jogo.

- Cada categoria é um arquivo `.txt`
- É possível selecionar várias categorias ao mesmo tempo
- O app faz a **união das palavras selecionadas**
- Mostra:
  - Quantidade de palavras por categoria
  - Total de palavras selecionadas
- A seleção é salva automaticamente no navegador (`localStorage`)

Categorias atuais incluem, por exemplo:
- Objetos
- Verbos / Ações
- Filmes
- Bandas
- Famosos
- Adulto
- CEP
- Abstratos

## ➕ Adicionando novos jogos

Este projeto foi pensado para crescer 🚀  

Você pode adicionar novos jogos:
- Criando uma nova tela (`.screen`) no HTML
- Reutilizando o sistema de palavras já existente
- Aproveitando o sistema de categorias
- Usando os sons e o overlay de timer, se quiser

Sugestões de jogos futuros:
- Mímica por equipes
- Stop / Adedonha
- Desenho com tema e pontuação
- Palavra proibida
- Verdade ou desafio (com categorias)

---

## 🛠️ Tecnologias usadas

- HTML5
- CSS3
- JavaScript puro (Vanilla JS)
- GitHub Pages (deploy gratuito)

Sem frameworks, sem build, sem complicação 😉

---

## 📱 Compatibilidade

- ✅ Android
- ✅ iOS
- ✅ Desktop
- Funciona offline após carregar (dependendo do cache do navegador)
- Pode ser salvo como atalho na tela inicial

---

## 📄 Licença

Projeto sob licença MIT.  
Sinta-se livre para usar, modificar e compartilhar.

---

Feito com ❤️ para jogar em grupo e dar risada.
