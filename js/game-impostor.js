// game-impostor.js

let playerName = "";
let roomCode = "";
let isHost = false;
let revealed = false;

/* ---------- UTIL ---------- */

function gerarNomeAleatorio() {
    const nomes = ["Gato", "Cachorro", "Dragão", "Ninja", "Pirata", "Fantasma"];
    return nomes[Math.floor(Math.random() * nomes.length)] + Math.floor(Math.random() * 100);
}

/* ---------- TELA INICIAL ---------- */

function initImpostor() {
    const saved = localStorage.getItem("impostor_nome");
    playerName = saved || gerarNomeAleatorio();

    const input = document.getElementById("impostorNome");
    if (input) input.value = playerName;
}

function salvarNome() {
    const input = document.getElementById("impostorNome");
    playerName = input.value.trim() || gerarNomeAleatorio();
    localStorage.setItem("impostor_nome", playerName);
}

function criarSala() {
    salvarNome();
    isHost = true;
    roomCode = Math.random().toString(36).substring(2, 7).toUpperCase();

    document.getElementById("codigoSala").textContent = roomCode;
    document.getElementById("hostArea").style.display = "block";
    document.getElementById("playerArea").style.display = "none";
}

function entrarSala() {
    salvarNome();
    isHost = false;

    roomCode = document.getElementById("codigoInput").value.trim().toUpperCase();
    if (!roomCode) return alert("Digite o código da sala");

    document.getElementById("codigoSala").textContent = roomCode;
    document.getElementById("hostArea").style.display = "none";
    document.getElementById("playerArea").style.display = "block";
}

/* ---------- JOGO ---------- */

function iniciarPartida() {
    // placeholder: depois isso vem do Firebase
    const isImpostor = Math.random() < 0.25;

    const texto = isImpostor
        ? "🚨 VOCÊ É O IMPOSTOR"
        : "🎨 PALAVRA: EXEMPLO";

    mostrarMensagem(texto);
}

function mostrarMensagem(texto) {
    const box = document.getElementById("impostorMensagem");
    box.textContent = texto;
    box.classList.remove("hidden");

    revealed = true;

    setTimeout(() => ocultarMensagem(), 10000);
}

function ocultarMensagem() {
    document.getElementById("impostorMensagem").classList.add("hidden");
    revealed = false;
}

function toggleMensagem() {
    const box = document.getElementById("impostorMensagem");
    revealed = !revealed;
    box.classList.toggle("hidden", !revealed);
}

/* ---------- EXPOR PARA O HTML ---------- */

Object.assign(window, {
    initImpostor,
    criarSala,
    entrarSala,
    iniciarPartida,
    ocultarMensagem,
    toggleMensagem
});
