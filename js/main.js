// SCROLL SUAVE DOS LINKS DO MENU

const links = document.querySelectorAll("nav a");

links.forEach(link => {

    link.addEventListener("click", evento => {

        evento.preventDefault();

        const id = link.getAttribute("href");

        const secao = document.querySelector(id);

        if(secao){

    secao.scrollIntoView({
        behavior:"smooth"
    });

}

    });

});


// ANIMAÇÃO AO SCROLL

const sections = document.querySelectorAll(
    ".history, .titles, .players, .stadium, .gallery, .contact, aside"
);

window.addEventListener("scroll", () => {

    sections.forEach(secao => {

        const topo = secao.getBoundingClientRect().top;

        if(topo < window.innerHeight - 100){

            secao.classList.add("mostrar");

        }

    });

});


// BOTÕES DA HERO

const btnHistoria = document.querySelector(".hero button:nth-child(1)");
const btnElenco = document.querySelector(".hero button:nth-child(2)");

btnHistoria.addEventListener("click", () => {
    document.querySelector("#history")
        .scrollIntoView({ behavior: "smooth" });
});

btnElenco.addEventListener("click", () => {
    document.querySelector("#players")
        .scrollIntoView({ behavior: "smooth" });
});


// EFEITO HOVER NOS CARDS DOS JOGADORES

const playerCards = document.querySelectorAll(".players article");

playerCards.forEach(card => {

    card.addEventListener("mousemove", e => {

        const x = e.offsetX;
        const y = e.offsetY;

        card.style.background = `
            radial-gradient(
                circle at ${x}px ${y}px,
                rgba(15,61,30,0.8),
                #111
            )
        `;

    });

    card.addEventListener("mouseleave", () => {

        card.style.background = "#111";

    });

});


// CONTADOR DE TÍTULOS

const numeros = document.querySelectorAll(".titles h3");

let ativado = false;

window.addEventListener("scroll", () => {

    const secaoTitulos =
    document.querySelector(".titles");

    const topo =
    secaoTitulos.getBoundingClientRect().top;

    if(topo < window.innerHeight - 100 && !ativado){

        numeros.forEach(numero => {

            let atual = 0;

            const alvo =
            Number(numero.textContent);

            const intervalo = setInterval(() => {

                atual++;

                numero.textContent = atual;

                if(atual >= alvo){

                    clearInterval(intervalo);

                }

            }, 80);

        });

        ativado = true;

    }

});


// MUDAR HEADER AO ROLAR

const header = document.querySelector("header");

window.addEventListener("scroll", () => {

    if(window.scrollY > 50){

        header.style.background = "#07150d";

        header.style.boxShadow =
        "0 0 20px rgba(0,0,0,0.5)";

    }

    else{

        header.style.background = "#0f3d1e";

        header.style.boxShadow = "none";

    }

});


// EFEITO DE ENTRADA DA HERO

window.addEventListener("load", () => {

    const heroTexto =
    document.querySelector(".hero article");

    heroTexto.style.opacity = "1";

    heroTexto.style.transform =
    "translateY(0)";

});

const listaJogos =
document.querySelector(".lista-jogos");

const filtroJogos =
document.querySelector("#filtroJogos");

let partidas = [];

fetch(
"https://corsproxy.io/?https://api.football-data.org/v4/competitions/2013/matches",
{
    headers: {
    "X-Auth-Token": CONFIG.API_KEY
}
})

.then(resposta => resposta.json())

.then(dados => {

    partidas = dados.matches.filter(jogo =>

    (
        jogo.homeTeam.shortName === "Palmeiras"

        ||

        jogo.awayTeam.shortName === "Palmeiras"
    )

).slice(0,15);

    mostrarJogos("todos");

});

function mostrarJogos(filtro){

    listaJogos.innerHTML = "";

    let jogosFiltrados = partidas;

    jogosFiltrados = partidas.filter(jogo => {

        const golsCasa =
        jogo.score.fullTime.home;

        const golsFora =
        jogo.score.fullTime.away;

        const palmeirasCasa =
        jogo.homeTeam.shortName
        === "Palmeiras";

        let resultado;

        if(golsCasa === golsFora){

            resultado = "empates";

        }

        else if(

            (palmeirasCasa && golsCasa > golsFora)

            ||

            (!palmeirasCasa && golsFora > golsCasa)

        ){

            resultado = "vitorias";

        }

        else{

            resultado = "derrotas";

        }

        if(filtro === "todos"){

            return true;

        }

        return resultado === filtro;

    });

    jogosFiltrados.forEach(jogo => {

        listaJogos.innerHTML += `

            <article class="jogo-card">

                <section class="times">

                    <section class="time">

                        <img
                            src="${jogo.homeTeam.crest}"
                            alt="${jogo.homeTeam.name}"
                        >

                        <h3>
                            ${jogo.homeTeam.shortName}
                        </h3>

                    </section>

                    <section class="placar">

                        <span>
                            ${jogo.score.fullTime.home}
                        </span>

                        <p>X</p>

                        <span>
                            ${jogo.score.fullTime.away}
                        </span>

                    </section>

                    <section class="time">

                        <img
                            src="${jogo.awayTeam.crest}"
                            alt="${jogo.awayTeam.name}"
                        >

                        <h3>
                            ${jogo.awayTeam.shortName}
                        </h3>

                    </section>

                </section>

                <section class="info-jogo">

                    <p>
                        ${new Date(
                            jogo.utcDate
                        ).toLocaleDateString("pt-BR")}
                    </p>

                    <p>
                        ${jogo.competition.name}
                    </p>

                </section>

            </article>

        `;

    });

}

filtroJogos.addEventListener("change", () => {

    mostrarJogos(
        filtroJogos.value
    );

});

const listaPlayers = document.querySelector(".lista-players");

let elenco = [];

// ✔️ CARREGA ELENCO JSON
fetch("./dado/elenco.json")
.then(res => {
    console.log("STATUS ELENCO:", res.status);
    return res.json();
})
.then(data => {
    console.log("ELENCO:", data);
    elenco = data;
    montarElenco();
})
.catch(err => {
    console.error("ERRO ELENCO:", err);
});

// ✔️ BUSCA FOTO (Wikipedia)
async function buscarFoto(nome){

    try {
        const res = await fetch(
            `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(nome)}`
        );

        const data = await res.json();

        return data.thumbnail?.source || "./img/default-player.png";

    } catch {
        return "./img/default-player.png";
    }
}

// ✔️ MONTA ELENCO (RÁPIDO + SEGURO)
async function montarElenco(){

    if(!listaPlayers) return;

    listaPlayers.innerHTML = "<p>Carregando elenco...</p>";

    const cards = await Promise.all(
        elenco.map(async (jogador) => {

           const foto =
    jogador.foto && jogador.foto.trim() !== ""
        ? jogador.foto
        : await buscarFoto(jogador.nome);

            return `
                <article class="player-card">

                    <div class="numero">${jogador.numero}</div>

                    <img src="${foto}" alt="${jogador.nome}">

                    <h3>${jogador.nome}</h3>

                    <p>${jogador.posicao}</p>

                </article>
            `;
        })
    );

    listaPlayers.innerHTML = cards.join("");
}