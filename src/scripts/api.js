let logado = true;

async function getTemp() {
    const res = await fetch('https://localhost:3000/data_retrieval/getTemp');
    const data = await res.json();

    if (res.status === 401) {
        logado = false;
        alert(data.message)
        return;
    }

    if (res.status === 400)
        alert(data.message)
    else {
        document.getElementById('last-temp').innerText = data.lastTemp;

        data.temperatura.forEach(temp => {
            const markup = `<li>${temp}</li>`;

            document.getElementById('all-temps').insertAdjacentHTML('beforeend', markup);
        });
    }
}

async function getHum() {
    const res = await fetch('https://localhost:3000/data_retrieval/getHum');
    const data = await res.json();

    if (res.status !== 200)
        alert(data.message)
    else {
        document.getElementById('last-hum').innerText = data.lastHum;

        data.humidade.forEach(hum => {
            const markup = `<li>${hum}</li>`;

            document.getElementById('all-hums').insertAdjacentHTML('beforeend', markup);
        });
    }
}

async function getLum() {
    const res = await fetch('https://localhost:3000/data_retrieval/getLum');
    const data = await res.json();

    if (res.status !== 200)
        alert(data.message)
    else {
        document.getElementById('last-lum').innerText = data.lastLum;

        data.luminosidade.forEach(lum => {
            const markup = `<li>${lum}</li>`;

            document.getElementById('all-lums').insertAdjacentHTML('beforeend', markup);
        });
    }
}

async function getFire() {
    const res = await fetch('https://localhost:3000/data_retrieval/getFire');
    const data = await res.json();

    if (res.status !== 200)
        alert(data.message)
    else {
        const timestamp = data.lastOccurrence;
        const dateObject = new Date(timestamp);
        const offset = dateObject.getTimezoneOffset();

        const final_date = new Date(dateObject.getTime() - (offset * 60 * 1000));
        const date = final_date.toISOString();
        document.getElementById('last-fire').innerText = date.split('T')[0] + " " + date.split('T')[1].split('.')[0];
    }
}

let alarme_status = false;
async function getAlarm() {
    const res = await fetch('https://localhost:3000/data_retrieval/getAlarm');
    const data = await res.json();

    if (res.status !== 200)
        alert(data.message)
    else {
        if (data.alarme) {
            document.getElementById('alarme').checked = true;
            alarme_status = true;
        }
        else {
            document.getElementById('alarme').checked = false;
            alarme_status = false;
        }
    }
}

async function changeAlarm() {
    if (!logado)
        return;

    if (alarme_status) {
        const res = await fetch('https://localhost:3000/commands/disableAlarm');
        const data = await res.json();

        if (res.status === 401) {
            logado = false;
            alert(data.message)
            return;
        }

        if (res.status === 400)
            alert(data.message)
        else {
            if (data.message === "ok") {
                alarme_status = false;
                document.getElementById('alarme').checked = false;
            }
        }

    } else {
        const res = await fetch('https://localhost:3000/commands/activateAlarm');
        const data = await res.json();

        if (res.status === 401) {
            logado = false;
            alert(data.message)
            return;
        }

        if (res.status === 400)
            alert(data.message)
        else {
            if (data.message === "ok") {
                alarme_status = true;
                document.getElementById('alarme').checked = true;
            }
        }
    }
}

let luz_divisao1_status = false;
let luz_divisao2_status = false;
async function getLights() {
    const res = await fetch('https://localhost:3000/data_retrieval/getLights');
    const data = await res.json();

    if (res.status !== 200)
        alert(data.message)
    else {
        if (data.divisao1) {
            document.getElementById('divisao1').checked = true;
            luz_divisao1_status = true;
        }
        else {
            document.getElementById('divisao1').checked = false;
            luz_divisao1_status = false;
        }

        if (data.divisao2) {
            document.getElementById('divisao2').checked = true;
            luz_divisao2_status = true;
        }
        else {
            document.getElementById('divisao2').checked = false;
            luz_divisao2_status = false;
        }
    }
}

async function changeLight(divisao) {
    if (!logado)
        return;

    if (eval("luz_" + divisao + "_status")) {
        const res = await fetch('https://localhost:3000/commands/disableLight', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                divisao: divisao
            })
        });
        const data = await res.json();

        if (res.status === 401) {
            logado = false;
            alert(data.message)
            return;
        }

        if (res.status === 400)
            alert(data.message)
        else {
            if (data.message === "ok") {
                eval("luz_" + divisao + "_status = false;");
                document.getElementById(divisao).checked = false;
            }
        }

    } else {
        const res = await fetch('https://localhost:3000/commands/activateLight', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                divisao: divisao
            })
        });
        const data = await res.json();

        if (res.status === 401) {
            logado = false;
            alert(data.message)
            return;
        }

        if (res.status === 400)
            alert(data.message)
        else {
            if (data.message === "ok") {
                eval("luz_" + divisao + "_status = true;");
                document.getElementById(divisao).checked = true;
            }
        }
    }
}

let janela1_status = false;
async function getWindows() {
    const res = await fetch('https://localhost:3000/data_retrieval/getWindows');
    const data = await res.json();

    if (res.status !== 200)
        alert(data.message)
    else {
        if (data.janela1) {
            document.getElementById('janela1').innerText = "Fechar janela1";
            janela1_status = true;
        }
        else {
            document.getElementById('janela1').innerText = "Abrir janela1";
            janela1_status = false;
        }

        if (data.janela2) {
            document.getElementById('janela2').innerText = "Fechar janela2";
            janela2_status = true;
        }
        else {
            document.getElementById('janela2').innerText = "Abrir janela2";
            janela2_status = false;
        }
    }
}

async function changeWindow(janela) {
    if (!logado)
        return;

    if (eval(janela + "_status")) {
        const res = await fetch('https://localhost:3000/commands/disableWindow', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                janela: janela
            })
        });
        const data = await res.json();

        if (res.status === 401) {
            logado = false;
            alert(data.message)
            return;
        }

        if (res.status === 400)
            alert(data.message)
        else {
            if (data.message === "ok") {
                eval(janela + "_status = false;")
                document.getElementById(janela).checked = false;
            }
        }

    } else {
        const res = await fetch('https://localhost:3000/commands/activateWindow', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                janela: janela
            })
        });
        const data = await res.json();

        if (res.status === 401) {
            logado = false;
            alert(data.message)
            return;
        }

        if (res.status === 400)
            alert(data.message)
        else {
            if (data.message === "ok") {
                eval(janela + "_status = true;");
                document.getElementById(janela).checked = true;
            }
        }
    }
}

// Chamar funções
getTemp().then(() => {
    if (logado) {
        getHum();
        getLum();
        getFire();
        getAlarm();
        getLights();
        getWindows();
    }
})