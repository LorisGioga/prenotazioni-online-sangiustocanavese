const orariDisponibili = [
    "08:10-08:30", "08:35-08:55", "09:00-09:20", "09:25-09:45", "09:50-10:10",
    "10:15-10:35", "10:40-11:00", "Riserva 1", "Riserva 2", "Riserva 3", "Riserva 4"
];

const postiPerOrario = {
    "08:10-08:30": 5, "08:35-08:55": 5, "09:00-09:20": 5, "09:25-09:45": 5, "09:50-10:10": 5,
    "10:15-10:35": 5, "10:40-11:00": 5, "Riserva 1": 1, "Riserva 2": 1, "Riserva 3": 1, "Riserva 4": 1
};

let prenotazioni = {};
let utentiPrenotati = new Map();

const orarioSelect = document.getElementById("orario");

// Popoliamo il menu a tendina
orariDisponibili.forEach(orario => {
    prenotazioni[orario] = [];
    let option = document.createElement("option");
    option.value = orario;
    option.textContent = `${orario} (${postiPerOrario[orario]} posti disponibili)`;
    orarioSelect.appendChild(option);
});

function prenotaOrario() {
    let nome = document.getElementById("nome").value.trim();
    let cognome = document.getElementById("cognome").value.trim();
    let orarioScelto = orarioSelect.value;
    let identificativo = nome + " " + cognome;

    if (nome === "" || cognome === "") {
        alert("Inserisci il tuo nome e cognome!");
        return;
    }

    if (utentiPrenotati.has(identificativo)) {
        alert("Hai già effettuato una prenotazione!");
        return;
    }

    if (prenotazioni[orarioScelto].length >= postiPerOrario[orarioScelto]) {
        alert("Questo orario è già pieno. Scegli un altro orario.");
        return;
    }

    prenotazioni[orarioScelto].push(identificativo);
    utentiPrenotati.set(identificativo, orarioScelto);
    aggiornaListaPrenotazioni();
}

function annullaPrenotazione() {
    let nome = document.getElementById("nome").value.trim();
    let cognome = document.getElementById("cognome").value.trim();
    let identificativo = nome + " " + cognome;

    if (!utentiPrenotati.has(identificativo)) {
        alert("Non hai ancora effettuato una prenotazione!");
        return;
    }

    let orarioPrenotato = utentiPrenotati.get(identificativo);
    prenotazioni[orarioPrenotato] = prenotazioni[orarioPrenotato].filter(n => n !== identificativo);
    utentiPrenotati.delete(identificativo);
    aggiornaListaPrenotazioni();
}

function aggiornaListaPrenotazioni() {
    let lista = document.getElementById("prenotazioni-list");
    lista.innerHTML = "";

    orariDisponibili.forEach(orario => {
        let postiRimasti = postiPerOrario[orario] - prenotazioni[orario].length;
        let tr = document.createElement("tr");

        let nomeList = prenotazioni[orario].map((n, i) => `${i + 1}. ${n}`).join("<br>") || "-";
        let postiClass = postiRimasti === 0 ? "zero-posti" : "";

        tr.innerHTML = `
            <td>${orario}</td>
            <td>${nomeList}</td>
            <td class="${postiClass}">${postiRimasti} posti disponibili</td>
        `;
        lista.appendChild(tr);
    });

    // Aggiorna il menu a tendina
    Array.from(orarioSelect.options).forEach(option => {
        let orario = option.value;
        let postiRimasti = postiPerOrario[orario] - prenotazioni[orario].length;
        option.textContent = `${orario} (${postiRimasti} posti disponibili)`;
        if (postiRimasti === 0) {
            option.style.color = "red";
        } else {
            option.style.color = "black";
        }
    });
}

function scaricaTabella() {
    let csvContent = "data:text/csv;charset=utf-8,Orario,Nome,Posti Rimasti\n";
    orariDisponibili.forEach(orario => {
        let line = `${orario},"${prenotazioni[orario].join(" / ") || "-"}",${postiPerOrario[orario] - prenotazioni[orario].length}`;
        csvContent += line + "\n";
    });

    let encodedUri = encodeURI(csvContent);
    let link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "prenotazioni.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function resetPrenotazioni() {
    let password = prompt("Inserisci la password per azzerare le prenotazioni:");
    if (password === "webmaster") {
        prenotazioni = {};
        utentiPrenotati.clear();
        orariDisponibili.forEach(orario => prenotazioni[orario] = []);
        aggiornaListaPrenotazioni();
        alert("Prenotazioni resettate!");
    } else {
        alert("Password errata!");
    }
}
