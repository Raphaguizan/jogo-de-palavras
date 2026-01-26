let palavras = [];
let palavrasPorCategoria = {};
let hideTimer = null;
let closerTimer = null;
let timerInt, prepInt;
let timeLeft = 0;
let paused = false;
let escondida = false;

const STORAGE_KEY = "categoriasSelecionadas";

const categorias = {
    Objetos: "words/palavras_objetos.txt",
    Abstratos: "words/palavras_abstratos.txt",
    Ações: "words/palavras_verbos.txt",
    CEP: "words/palavras_CEP.txt",
    Filmes: "words/palavras_filmes.txt",
    Famosos: "words/palavras_famosos.txt",
    Bandas: "words/palavras_bandas.txt",
    Adulto: "words/palavras_adulto.txt"
};

function go(id) {
    // esconde todas as telas
    document.querySelectorAll(".screen").forEach(screen => {
        screen.classList.remove("active");
    });

    // mostra a tela desejada
    const target = document.getElementById(id);
    if (target) {
        target.classList.add("active");
    } else {
        console.warn(`Tela com id "${id}" não encontrada`);
    }
}

async function carregarCategorias(){
    const box = document.getElementById("categoriasBox");
    box.innerHTML = "";

    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    let index = 0;

    for (const [nome, arquivo] of Object.entries(categorias)) {
        const txt = await fetch(arquivo).then(r => r.text());
        const lista = txt.split("\n").filter(Boolean);
        palavrasPorCategoria[nome] = lista;

        const checked = saved ? saved.includes(nome) : index < 2;

        const div = document.createElement("div");
        div.className = "category";
        div.innerHTML = `
            <label>
                <input type="checkbox" value="${nome}" ${checked ? "checked" : ""}>
                ${nome.toUpperCase()}
            </label>
            <span class="count">${lista.length}</span>
        `;

        div.querySelector("input").addEventListener("change", salvarCategorias);
        box.appendChild(div);
        index++;
    }

    const totalDiv = document.createElement("div");
    totalDiv.className = "total";
    totalDiv.id = "totalPalavras";
    box.appendChild(totalDiv);

    atualizarPalavras();
}

function salvarCategorias(){
    const selecionadas = [...document.querySelectorAll("#categoriasBox input:checked")]
        .map(c => c.value);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(selecionadas));
    atualizarPalavras();
}

function atualizarPalavras(){
    palavras = [];
    document.querySelectorAll("#categoriasBox input:checked").forEach(c =>
        palavras.push(...palavrasPorCategoria[c.value])
    );
    palavras = [...new Set(palavras)];

    document.getElementById("totalPalavras").textContent =
        `Total selecionado: ${palavras.length} palavras`;
}

/* UI */
function toggleDropdown(){
    document.getElementById("catDropdown").classList.toggle("open");
}

function go(id){
    atualizarPalavras();
    document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
    document.getElementById(id).classList.add("active");
}

/* JOGO 1 */
function sortearLista(){
    const qtd = +document.getElementById("qtd").value;
    document.getElementById("lista").innerHTML =
        palavras.sort(()=>0.5-Math.random()).slice(0,qtd)
        .map((p,i)=>`${i+1}. ${p}`).join("<br>");
}

/* JOGO 2 */
function sortearPalavra(){
    document.getElementById("palavra").textContent =
        palavras[Math.floor(Math.random()*palavras.length)];
    toggleHide(false);
    hideTimer = setInterval(()=> toggleHide(true), 3000);
}

function toggleHide(v=null){
    clearInterval(hideTimer);
    escondida = v!==null ? v : !escondida;
    document.getElementById("palavra").classList.toggle("hidden", escondida);
}

/* TIMER */
function startTimer(){
    clearInterval(closerTimer);
    stopTimer();
    toggleHide(true);

    const total = +document.getElementById("tempo").value;
    const display = document.getElementById("overlayTimer");
    document.getElementById("timerOverlay").classList.add("active");

    let prep = 3;
    display.textContent = "EM\n" + prep;

    prepInt = setInterval(()=>{
        prep--;
        if(prep>0){
            display.textContent = "EM\n" + prep;
        } else {
            clearInterval(prepInt);
            document.getElementById("startSound").play();
            timeLeft = total;
            display.textContent = timeLeft;
            timerInt = setInterval(runTimer,1000);
        }
    },1000);
}

function runTimer(){
    if(paused) return;
    const d = document.getElementById("overlayTimer");
    timeLeft--;
    d.textContent = timeLeft;

    if(timeLeft<=3 && timeLeft > 0){
        d.classList.add("red");
        document.getElementById("beep").play();
    }
    if(timeLeft<=0){
        clearInterval(timerInt);
        d.textContent = "⏰";
        document.getElementById("alarm").play();
        navigator.vibrate?.([300,100,300]);
        closerTimer = setTimeout(stopTimer, 5000);
    }
}

function pauseTimer(){ paused = !paused; }

function stopTimer(){
    clearInterval(timerInt);
    clearInterval(prepInt);
    paused=false;
    document.getElementById("timerOverlay").classList.remove("active");
}

carregarCategorias();
import { db } from "./firebase.js";
console.log("Firebase conectado:", db);
