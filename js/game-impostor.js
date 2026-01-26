/*************************************************
 * JOGO DO IMPOSTOR — LÓGICA LOCAL (SEM FIREBASE)
 *************************************************/

// ---------- ESTADO ----------
let impostorState = {
    role: null, // "host" | "player"
    roomCode: null,
    playerName: "",
    isImpostor: false,
    revealTimer: null
};

// ---------- UTIL ----------
function gerarCodigoSala() {
    return Math.random().toString(36).substring(2, 6).toUpperCase();
}

function nomeAleatorio() {
    const nomes = ["Azul", "Verde", "Vermelho", "Roxo", "Amarelo", "Laranja"];
    return "Jogador " + nomes[Math.floor(Math.random() * nomes.length)];
}

// ---------- INIT ----------
(function initImpostor() {
    const input = document.getElementById("impostorPlayerName");
    if (!input) return;

    const salvo = localStorage.getItem("impostorPlayerName");
    input.value = salvo || nomeAleatorio();

    input.addEventListener("input", () => {
        localStorage.setItem("impostorPlayerName", input.value.trim());
    });
})();

// ---------- TELA LOBBY ----------
function impostorHost() {
    impostorState.role = "host";
    impostorState.playerName =
        document.getElementById("impostorPlayerName").value.trim();

    impostorState.roomCode = gerarCodigoSala();

    go("impostor-game");
    mostrarHost();
}

function impostorJoin() {
    impostorState.role = "player";
    impostorState.playerName =
        document.getElementById("impostorPlayerName").value.trim();

    impostorState.roomCode =
        document.getElementById("impostorRoomCode").value.trim().toUpperCase();

    if (!impostorState.roomCode) {
        alert("Digite o código da sala");
        return;
    }

    go("impostor-game");
    mostrarJogador();
}

// ---------- UI ----------
function mostrarHost() {
    document.getElementById("impostorRoomCodeLabel").textContent =
        impostorState.roomCode;

    document.getElementById("impostor-host-panel").style.display = "block";
    document.getElementById("impostor-waiting").style.display = "none";
    document.getElementById("impostor-reveal").style.display = "none";

    // Mock de jogadores
    atualizarListaJogadores([
        impostorState.playerName,
        "Jogador 2",
        "Jogador 3"
    ]);
}

function mostrarJogador() {
    document.getElementById("impostor-host-panel").style.display = "none";
    document.getElementById("impostor-waiting").style.display = "block";
    document.getElementById("impostor-reveal").style.display = "none";
}

function atualizarListaJogadores(lista) {
    const ul = document.getElementById("impostorPlayersList");
    ul.innerHTML = "";
    lista.forEach(n => {
        const li = document.createElement("li");
        li.textContent = n;
        ul.appendChild(li);
    });
}

// ---------- JOGO ----------
function impostorStartGame() {
    // Sorteio local
    const palavras = window.palavras || ["avião", "banana", "computador"];
    const palavra = palavras[Math.floor(Math.random() * palavras.length)];

    impostorState.isImpostor = Math.random() < 0.25;

    revelarImpostor(
        impostorState.isImpostor
            ? "🚨 VOCÊ É O IMPOSTOR 🚨"
            : `A palavra é:\n${palavra}`
    );
}

function revelarImpostor(texto) {
    document.getElementById("impostor-waiting").style.display = "none";
    document.getElementById("impostor-reveal").style.display = "block";

    const reveal = document.getElementById("impostorRevealText");
    reveal.textContent = texto;

    clearTimeout(impostorState.revealTimer);
    impostorState.revealTimer = setTimeout(impostorHide, 10000);
}

function impostorHide() {
    document.getElementById("impostor-reveal").style.display = "none";
    document.getElementById("impostor-waiting").style.display = "block";
}
