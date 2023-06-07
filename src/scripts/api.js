let logado = true;

async function getTemp() {
    const res = await fetch('https://localhost:3000/getTemp');
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
    const res = await fetch('https://localhost:3000/getHum');
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
    const res = await fetch('https://localhost:3000/getLum');
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
    const res = await fetch('https://localhost:3000/getFire');
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
    const res = await fetch('https://localhost:3000/getAlarm');
    const data = await res.json();

    if (res.status !== 200)
        alert(data.message)
    else {
        if (data.alarme) {
            document.getElementById('alarme').innerText = "Desativar alarme";
            alarme_status = true;
        }
        else {
            document.getElementById('alarme').innerText = "Ativar alarme";
            alarme_status = false;
        }
    }
}

async function mudarAlarme() {
    if (!logado)
        return;

    if (alarme_status) {
        const res = await fetch('https://localhost:3000/disableAlarm');
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
                document.getElementById('alarme').innerText = "Ativar alarme";
            }
        }

    } else {
        const res = await fetch('https://localhost:3000/activateAlarm');
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
                document.getElementById('alarme').innerText = "Desativar alarme";
            }
        }
    }
}

let luz_divisao1_status = false;
let luz_divisao2_status = false;
async function getLuzes() {
    const res = await fetch('https://localhost:3000/getLuzes');
    const data = await res.json();

    if (res.status !== 200)
        alert(data.message)
    else {
        if (data.divisao1) {
            document.getElementById('divisao1').innerText = "Desativar luz divisao1";
            luz_divisao1_status = true;
        }
        else {
            document.getElementById('divisao1').innerText = "Ativar luz divisao1";
            luz_divisao1_status = false;
        }

        if (data.divisao2) {
            document.getElementById('divisao2').innerText = "Desativar luz divisao2";
            luz_divisao2_status = true;
        }
        else {
            document.getElementById('divisao2').innerText = "Ativar luz divisao2";
            luz_divisao2_status = false;
        }
    }
}

async function mudarLuz1() {
    if (!logado)
        return;

    if (luz_divisao1_status) {
        const res = await fetch('https://localhost:3000/disableLuz', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                divisao: "divisao1"
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
                luz_divisao1_status = false;
                document.getElementById('divisao1').innerText = "Ativar luz divisao1";
            }
        }

    } else {
        const res = await fetch('https://localhost:3000/activateLuz', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                divisao: "divisao1"
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
                luz_divisao1_status = true;
                document.getElementById('divisao1').innerText = "Desativar luz divisao1";
            }
        }
    }
}

async function mudarLuz2() {
    if (!logado)
        return;

    if (luz_divisao2_status) {
        const res = await fetch('https://localhost:3000/disableLuz', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                divisao: "divisao2"
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
                luz_divisao2_status = false;
                document.getElementById('divisao2').innerText = "Ativar luz divisao2";
            }
        }

    } else {
        const res = await fetch('https://localhost:3000/activateLuz', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                divisao: "divisao2"
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
                luz_divisao2_status = true;
                document.getElementById('divisao2').innerText = "Desativar luz divisao2";
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
        getLuzes();
    }
})