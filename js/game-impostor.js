import { db } from "./firebase.js";
import {
    ref,
    remove,
    set,
    get,
    onValue,
    update,
    onDisconnect
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

/* ---------- STATE ---------- */

let playerName = "";
let roomCode = "";
let isHost = false;
let revealed = false;
let playerId = crypto.randomUUID();
let hideTimer = null;

/* ---------- UTIL ---------- */

function gerarNomeAleatorio() {
    const nomes = ["Gato", "Cachorro", "Dragão", "Ninja", "Pirata", "Fantasma"];
    return nomes[Math.floor(Math.random() * nomes.length)] + Math.floor(Math.random() * 100);
}

/* ---------- INIT ---------- */

function initImpostor() {
    const saved = localStorage.getItem("impostor_nome");
    playerName = saved || gerarNomeAleatorio();

    const input = document.getElementById("impostorNome");
    if (input) input.value = playerName;
}

/* ---------- LOBBY ---------- */

function salvarNome() {
    const input = document.getElementById("impostorNome");
    playerName = input.value.trim() || gerarNomeAleatorio();
    localStorage.setItem("impostor_nome", playerName);
}

/* ---------- CRIAR SALA ---------- */

async function criarSala() {

    salvarNome();
    isHost = true;
    roomCode = Math.random().toString(36).substring(2, 7).toUpperCase();

    const roomRef = ref(db, `rooms/${roomCode}`);
    const playerRef = ref(db, `rooms/${roomCode}/players/${playerId}`);

    await set(roomRef, {
        hostId: playerId,
        hostName: playerName,
        started: false,
        palavra: "",
        players: {}
    });

    await set(playerRef, {
        name: playerName,
        impostor: false
    });

    // 🔥 REMOVE PLAYER se desconectar
    onDisconnect(playerRef).remove();

    // 🔥 REMOVE SALA se host cair
    onDisconnect(roomRef).remove();

    entrarSalaUI();
}

/* ---------- ENTRAR SALA ---------- */

async function entrarSala() {

    document.getElementById("roomError").textContent = "";
    salvarNome();
    isHost = false;

    roomCode = document
        .getElementById("codigoInput")
        .value.trim()
        .toUpperCase();

    if (!roomCode) {
        alert("Digite o código da sala");
        return;
    }

    const roomRef = ref(db, `rooms/${roomCode}`);
    const snapshot = await get(roomRef);

    if (!snapshot.exists()) {
        document.getElementById("roomError").textContent = "Sala não encontrada";
        return;
    }

    const playerRef = ref(db, `rooms/${roomCode}/players/${playerId}`);

    await set(playerRef, {
        name: playerName,
        impostor: false
    });

    // 🔥 Auto remove ao cair conexão
    onDisconnect(playerRef).remove();

    entrarSalaUI();
}

/* ---------- UI ENTRAR ---------- */

function entrarSalaUI() {

    document.getElementById("codigoSala").textContent = roomCode;
    document.getElementById("hostArea").style.display = isHost ? "block" : "none";
    document.getElementById("playerArea").style.display = isHost ? "none" : "block";

    escutarSala();

    go("impostor-game");
}

/* ---------- INICIAR PARTIDA ---------- */

async function iniciarPartida() {

    if (!window.palavras || window.palavras.length === 0) {
        alert("Nenhuma palavra carregada");
        return;
    }

    const palavra =
        window.palavras[Math.floor(Math.random() * window.palavras.length)];

    const playersSnap = await get(ref(db, `rooms/${roomCode}/players`));

    if (!playersSnap.exists()) return;

    const players = Object.keys(playersSnap.val());

    const impostorId =
        players[Math.floor(Math.random() * players.length)];

    const updates = {
        started: true,
        palavra
    };

    players.forEach(id => {
        updates[`players/${id}/impostor`] = id === impostorId;
    });

    await update(ref(db, `rooms/${roomCode}`), updates);
}

/* ---------- LISTENER ---------- */

function escutarSala() {

    const roomRef = ref(db, `rooms/${roomCode}`);

    onValue(roomRef, snapshot => {

        if (!snapshot.exists()) {
            alert("A sala foi encerrada");
            sairSalaLocal();
            go("impostor-lobby");
            return;
        }

        const data = snapshot.val();

        atualizarListaJogadores(data.players);

        // partida começou
        if (data.started) {

            const me = data.players[playerId];
            if (!me) return;

            if (me.impostor) {
                mostrarMensagem("VOCÊ É O IMPOSTOR");
            } else {
                mostrarMensagem("PALAVRA: " + data.palavra);
            }
        }
    });
}

/* ---------- UI ---------- */

function atualizarListaJogadores(players) {

    const ul = document.getElementById("impostorPlayersList");
    if (!ul) return;

    ul.innerHTML = "";

    Object.values(players).forEach(p => {
        const li = document.createElement("li");
        li.textContent = p.name;
        ul.appendChild(li);
    });
}

/* ---------- MENSAGEM ---------- */

function mostrarMensagem(texto) {

    const box = document.getElementById("impostorMensagem");

    box.textContent = texto;
    box.classList.remove("hidden");

    revealed = true;

    clearTimeout(hideTimer);
    hideTimer = setTimeout(ocultarMensagem, 10000);
}

function ocultarMensagem() {

    const box = document.getElementById("impostorMensagem");

    box.classList.add("hidden");
    revealed = false;
}

function toggleMensagem() {

    const box = document.getElementById("impostorMensagem");

    revealed = !revealed;
    box.classList.toggle("hidden", !revealed);

    if (revealed) {
        clearTimeout(hideTimer);
        hideTimer = setTimeout(ocultarMensagem, 10000);
    }
}

/* ---------- SAIR ---------- */

function sairSalaLocal() {
    roomCode = "";
    isHost = false;
    revealed = false;
}

async function sairSala() {

    if (!roomCode) {
        go("menu");
        return;
    }

    const roomRef = ref(db, `rooms/${roomCode}`);
    const playerRef = ref(db, `rooms/${roomCode}/players/${playerId}`);

    if (isHost) {

        await remove(roomRef); // destrói sala

    } else {

        await remove(playerRef); // sai apenas
    }

    sairSalaLocal();

    go("impostor-lobby");
}

/* ---------- EXPOR ---------- */

Object.assign(window, {
    initImpostor,
    criarSala,
    entrarSala,
    iniciarPartida,
    toggleMensagem,
    sairSala
});