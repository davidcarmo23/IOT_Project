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
        graphTemperatura(data.temperatura)
    }
}

async function getHum() {
    const res = await fetch('https://localhost:3000/data_retrieval/getHum');
    const data = await res.json();

    if (res.status !== 200)
        alert(data.message)
    else
        graphHumidade(data.humidade)
}

async function getLum() {
    const res = await fetch('https://localhost:3000/data_retrieval/getLum');
    const data = await res.json();

    if (res.status !== 200)
        alert(data.message)
    else
        graphLuminosidade(data.luminosidade)
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
            document.getElementById('janela1').checked = true;
            janela1_status = true;
        }
        else {
            document.getElementById('janela1').checked = false;
            janela1_status = false;
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

async function lockHouse() {
    if (!logado)
        return;

    const res = await fetch('https://localhost:3000/commands/lockHouse');
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
            luz_divisao2_status = false;
            janela1_status = false;
            alarme_status = true;

            document.getElementById('divisao1').checked = false;
            document.getElementById('divisao2').checked = false;
            document.getElementById('janela1').checked = false;
            document.getElementById('alarme').checked = true;

            alert('House locked')
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

// Gráficos
// grafico Temperatura
function graphTemperatura(array) {
    const ctx = document.getElementById('Temperatura').getContext('2d');
    const Temperatura = new Chart(ctx, {
        type: 'line',
        options: {
            scales: {
                y: {
                    min: 5,
                    max: 25,
                    ticks: {
                        stepSize: 5
                    }
                }
            }
        },
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Temperature',
                    data: array,
                    fill: false,
                    borderColor: 'rgb(16, 36, 68)',
                    tension: 0.1
                },
            ],
        },
        plugins: {
            legend: {
                display: false
            }
        }
    });
}

// grafico humidade
function graphHumidade(array) {
    const ctx = document.getElementById('Humidade').getContext('2d');
    const Humidade = new Chart(ctx, {
        type: 'line',
        options: {
            scales: {
                y: {
                    min: 40,
                    max: 80,
                    ticks: {
                        stepSize: 5
                    }
                }
            }
        },
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Humidity',
                    data: array,
                    fill: false,
                    borderColor: 'rgb(16, 36, 68)',
                    tension: 0.1
                },
            ],
        },
        plugins: {
            legend: {
                display: false
            }
        }
    });
}

// grafico Luminosidade
function graphLuminosidade(array) {
    const ctx = document.getElementById('Luminosidade').getContext('2d');
    const Luminosidade = new Chart(ctx, {
        type: 'line',
        options: {
            scales: {
                y: {
                    min: 300,
                    max: 900,
                    ticks: {
                        stepSize: 5
                    }
                }
            }
        },
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Luminosity',
                    data: array,
                    fill: false,
                    borderColor: 'rgb(16, 36, 68)',
                    tension: 0.1
                },
            ],
        },
        plugins: {
            legend: {
                display: false
            }
        }
    });
}