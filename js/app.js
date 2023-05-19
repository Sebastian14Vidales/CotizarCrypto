// https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD


function iniciarApp() {

    const criptomonedaLista = document.querySelector('#criptomonedas');
    const moneda = document.querySelector('#moneda');
    const formulario = document.querySelector('#formulario');
    const resultado = document.querySelector('#resultado');

    let id;

    const infoMonedas = {
        moneda: '',
        cripto: ''
    };

    obtenerCriptomoneda();
    criptomonedaLista.addEventListener('change', seleccionarCripto);
    moneda.addEventListener('change', seleccionarMoneda);
    formulario.addEventListener('submit', validarMonedas);

    async function obtenerCriptomoneda() {
        const url = `https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD`;
        // fetch(url)
        //     .then(respuesta => respuesta.json())
        //     .then(datos => recorrerCriptoLista(datos.Data))

        const respuesta = await fetch(url);
        const resultado = await respuesta.json();
        recorrerCriptoLista(resultado.Data)
    }

    function recorrerCriptoLista(monedas) {
        monedas.forEach(moneda => {
            const { Name, FullName } = moneda.CoinInfo;
            const option = document.createElement('option');
            option.textContent = `${FullName}`;
            option.value = Name;

            criptomonedaLista.appendChild(option);
        });
    }

    async function seleccionarMoneda(e) {
        id = e.target.value;

        const url = `https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=${id}`
        // fetch(url)
        //     .then(respuesta => respuesta.json())
        //     .then(datos => infoMonedas.moneda = datos.Data)

        const respuesta = await fetch(url);
        const resultado = await respuesta.json();
        infoMonedas.moneda = resultado.Data;
    }

    function seleccionarCripto(e) {
        const cripto = e.target.value;
        infoMonedas.cripto = cripto;
    }

    function validarMonedas(e) {
        e.preventDefault();
        const { moneda, cripto } = infoMonedas;

        if (!moneda.length || !cripto.length) {
            const errorDiv = document.createElement('div');
            errorDiv.classList.add('error');
            errorDiv.textContent = 'Ambos campos deben ser obligatorios';
            formulario.appendChild(errorDiv);

            setTimeout(() => {
                errorDiv.remove();
            }, 3000);
            return;
        }
        filtrarMonedas();
    }

    function filtrarMonedas() {
        const { moneda, cripto } = infoMonedas;
        const coin = moneda.filter(mone => mone.CoinInfo.Name === cripto);
        if (coin.length) {
            mostrarHTML(coin);
            return;
        }
    }

    function mostrarHTML(coin) {
        const { PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE } = coin[0].DISPLAY[id];
        limpiarHTML();

        // Creando contenido de la moneda
        const datosConsulta = document.createElement('div');
        datosConsulta.classList.add('text-center');
        datosConsulta.innerHTML = `
            <p class="precio">El Precio es: <span class="font-bold">${PRICE}</span></p>
            <p>Precio mas alto es: <span class="font-bold">${HIGHDAY}</span></p>
            <p>Precio mas bajo es: <span class="font-bold">${LOWDAY}</span></p>
            <p>Variación últimas 24 horas: <span class="font-bold">${CHANGEPCT24HOUR}%</span></p>
            <p>Última actualización: <span class="font-bold">${LASTUPDATE}</span></p>
        ` ;

        // Creando spinner
        const spinner = document.createElement('div');
        spinner.classList.add('spinner');
        spinner.innerHTML = `
        <div class="bounce1"></div>
        <div class="bounce2"></div>
        <div class="bounce3"></div>
        `;
        resultado.appendChild(spinner);
        setTimeout(() => {
            spinner.remove();
            resultado.appendChild(datosConsulta);
        }, 2000);
    }

    function limpiarHTML() {
        while (resultado.firstChild) {
            resultado.removeChild(resultado.firstChild);
        }
    }
}
document.addEventListener('DOMContentLoaded', iniciarApp);