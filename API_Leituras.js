class DataManager {
    static pegarDataInput = document.getElementById("meuDate");
    static diaDataElement = document.getElementById("dia_data");
    static mesDataElement = document.getElementById("mes_data");
    static anoDataElement = document.getElementById("ano_data");
    static nomeMeses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
    static dataSelecionada;
    static dataFormatada;

    static inicializarData() {
        const hoje = new Date();
        const ano = hoje.getFullYear();
        const mes = String(hoje.getMonth() + 1).padStart(2, '0');
        const dia = String(hoje.getDate()).padStart(2, '0');
        this.dataSelecionada = `${ano}-${mes}-${dia}`;
        this.atualizarDisplayData(hoje);
        this.pegarDataInput.value = this.dataSelecionada;
        this.pegarDataInput.addEventListener("change", (evt) => {
            DataManager.manipularMudancaData(evt);
        });
    }

    static manipularMudancaData(evt) {
        this.dataSelecionada = evt.target.value;
        const partesData = this.dataSelecionada.split('-');
        const ano = parseInt(partesData[0], 10);
        const mes = parseInt(partesData[1], 10) - 1; // Mês começa em 0
        const dia = parseInt(partesData[2], 10);
        const novaData = new Date(ano, mes, dia);

        this.atualizarDisplayData(novaData);
    }
    static atualizarDisplayData(data) {
        const dia = String(data.getDate()).padStart(2, '0'); // Garante dois dígitos para o dia
        const mes = this.nomeMeses[data.getMonth()];
        const ano = data.getFullYear();
        this.diaDataElement.innerHTML = dia;
        this.mesDataElement.innerHTML = mes;
        this.anoDataElement.innerHTML = ano;
        this.dataFormatada = `${dia}-${String(data.getMonth() + 1).padStart(2, '0')}-${ano}`;
    }
    static getDataSelecionadaFormatada() {
        const dataInput = this.pegarDataInput.value.split('-');
        const ano = parseInt(dataInput[0], 10);
        const mes = parseInt(dataInput[1], 10) - 1;
        const dia = parseInt(dataInput[2], 10);
        const data = new Date(ano, mes, dia);
        const diaFormatado = String(data.getDate()).padStart(2, "0");
        const mesFormatado = String(data.getMonth() + 1).padStart(2, "0");
        const anoFormatado = data.getFullYear();
        return {
            dia: diaFormatado,
            mes: mesFormatado,
            ano: anoFormatado,
            dataCompleta: `${diaFormatado}-${mesFormatado}-${anoFormatado}`,
            dataParaAPI: `${diaFormatado}-${mesFormatado}-${anoFormatado}`
        };
    }

    static getDataParaAPI() {
        return this.getDataSelecionadaFormatada().dataParaAPI;
    }
}

DataManager.inicializarData();

class Leitura {
    static async PegarAPI(data) {
        try {
            const EndPoint = `https://liturgia.up.railway.app/v2/${data}`;
            const resposta = await fetch(EndPoint);
            const dadosAPI = await resposta.json();
            console.log(dadosAPI)
            return dadosAPI;
        } catch (error) {
            console.log(error + " Erro ao obter os dados da API");
        }
    }

    static async Get_liturgia(data) {
        const txt = await this.PegarAPI(data);
        return txt?.liturgia
    }

    static async Get_Evangelho(data) {
        const txt = await this.PegarAPI(data);
        return txt?.leituras?.evangelho?.[0]?.texto;
    }

    static async Get_tituloEvan(data) {
        const txt = await this.PegarAPI(data);
        return txt?.leituras?.evangelho?.[0]?.titulo;
    }

    static async Get_referenciaEvan(data) {
        const refe = await this.PegarAPI(data);
        return refe?.leituras?.evangelho?.[0]?.referencia;
    }

    static async Get_PriLeitura(data) {
        const txt = await this.PegarAPI(data);
        return txt?.leituras?.primeiraLeitura?.[0]?.texto;
    }

    static async Get_tituloPrim(data) {
        const txt = await this.PegarAPI(data);
        return txt?.leituras?.primeiraLeitura?.[0]?.titulo;
    }

    static async Get_referenciaPrim(data) {
        const txt = await this.PegarAPI(data);
        return txt?.leituras?.primeiraLeitura?.[0]?.referencia;
    }

    static async Get_Salmo(data) {
        const txt = await this.PegarAPI(data);
        return txt?.leituras?.salmo?.[0]?.texto;
    }

    static async Get_tituloSalmo(data) {
        const txt = await this.PegarAPI(data);
        return txt?.leituras?.salmo?.[0]?.refrao;
    }

    static async Get_referenciaSalmo(data) {
        const txt = await this.PegarAPI(data);
        return txt?.leituras?.salmo?.[0]?.referencia;
    }

    static async Get_SegunLeitura(data) {
        const txt = await this.PegarAPI(data);
        return txt?.leituras?.segundaLeitura?.[0]?.texto;
    }

    static async Get_tituloSegun(data) {
        const txt = await this.PegarAPI(data);
        return txt?.leituras?.segundaLeitura?.[0]?.titulo;
    }

    static async Get_referenciaSegun(data) {
        const txt = await this.PegarAPI(data);
        return txt?.leituras?.segundaLeitura?.[0]?.referencia;
    }
}


class Manipular_textos {
    static evangelhoElement = document.getElementById("evang");
    static tituloElement = document.getElementById("leitura_dia");
    static leituraDiaTituloElement = document.getElementById("titulo");
    static liturgia = document.getElementById("liturgia")

    static async Mostrar_liturgia(data) {
        let texto = await Leitura.Get_liturgia(data);

        if (texto) {
            this.liturgia.innerHTML = texto;
        }else {
            this.liturgia.innerHTML = ""
        }
    }

    static async Mostrar_evangelho(data) {
        let texto = await Leitura.Get_Evangelho(data);
        texto = texto?.replace(/\b(\d+)(?=[^\d\s])/g, '<sub>$1</sub>');
        if (texto) {
            this.evangelhoElement.innerHTML = texto;
        } else {
            this.evangelhoElement.innerHTML = ""; // Limpar se não houver texto
        }
    }

    static async MostrarTitulo_evangelho(data) {
        let titulo_evan = await Leitura.Get_tituloEvan(data);
        if (titulo_evan) {
            this.tituloElement.innerHTML = titulo_evan;
        } else {
            this.tituloElement.innerHTML = "";
        }
    }

    static async MostrarRefer_evangelho(data) {
        let refe_evan = await Leitura.Get_referenciaEvan(data);
        if (refe_evan) {
            this.leituraDiaTituloElement.innerHTML = refe_evan;
        } else {
            this.leituraDiaTituloElement.innerHTML = "";
        }
    }

    static async Mostrar_priLeitura(data) {
        let texto = await Leitura.Get_PriLeitura(data);
        texto = texto?.replace(/\b(\d+)(?=[^\d\s])/g, '<sub>$1</sub>');
        if (texto) {
            this.evangelhoElement.innerHTML = texto;
        } else {
            this.evangelhoElement.innerHTML = "";
        }
    }

    static async MostrarTitulo_priLeitura(data) {
        let titulo_priLei = await Leitura.Get_tituloPrim(data);
        if (titulo_priLei) {
            this.tituloElement.innerHTML = titulo_priLei;
        } else {
            this.tituloElement.innerHTML = "";
        }
    }

    static async MostrarRefer_PriLeitura(data) {
        let refe_priLei = await Leitura.Get_referenciaPrim(data);
        if (refe_priLei) {
            this.leituraDiaTituloElement.innerHTML = refe_priLei;
        } else {
            this.leituraDiaTituloElement.innerHTML = "";
        }
    }

    static async Mostrar_Salmo(data) {
        let texto = await Leitura.Get_Salmo(data);
        if (texto) {
            this.evangelhoElement.innerHTML = texto;
        } else {
            this.evangelhoElement.innerHTML = "";
        }
    }

    static async MostrarTitulo_Salmo(data) {
        let titulo_salmo = await Leitura.Get_tituloSalmo(data);
        if (titulo_salmo) {
            this.tituloElement.innerHTML = titulo_salmo;
        } else {
            this.tituloElement.innerHTML = "";
        }
    }

    static async MostrarRefer_Salmo(data) {
        let refe_salmo = await Leitura.Get_referenciaSalmo(data);
        if (refe_salmo) {
            this.leituraDiaTituloElement.innerHTML = refe_salmo;
        } else {
            this.leituraDiaTituloElement.innerHTML = "";
        }
    }

    static async Mostrar_SegunLeitura(data) {
        let texto = await Leitura.Get_SegunLeitura(data);
        texto = texto?.replace(/\b(\d+)(?=[^\d\s])/g, '<sub>$1</sub>');
        if (texto) {
            this.evangelhoElement.innerHTML = texto;
        } else {
            this.evangelhoElement.innerHTML = "";
        }
    }

    static async MostrarTitulo_SegunLeitura(data) {
        let titulo_segunLei = await Leitura.Get_tituloSegun(data);
        if (titulo_segunLei) {
            this.tituloElement.innerHTML = titulo_segunLei;
        } else {
            this.tituloElement.innerHTML = "";
        }
    }

    static async MostrarRefer_SegunLeitura(data) {
        let refe_segunLei = await Leitura.Get_referenciaSegun(data);
        if (refe_segunLei) {
            this.leituraDiaTituloElement.innerHTML = refe_segunLei;
        } else {
            this.leituraDiaTituloElement.innerHTML = "";
        }
    }
}

const mostrarSalmoBtn = document.getElementById("salmo");
const mostrarEvangelhoBtn = document.getElementById("evangelho");
const mostrarPrimeiraLeituraBtn = document.getElementById("priLeitua");
const mostraSegundaLeituraBtn = document.getElementById("segunLeitua");
const pegarDataInput = document.getElementById("meuDate");

let leituraAtiva = "priLeitua"; // Define a leitura inicial

// Função para verificar se a Segunda Leitura está disponível e gerenciar a visibilidade do botão
async function verificarSegundaLeitura(data) {
    try {
        const textoSegunda = await Leitura.Get_SegunLeitura(data);
        if (textoSegunda && textoSegunda.trim() !== "") {
            mostraSegundaLeituraBtn.style.display = "";
        } else {
            mostraSegundaLeituraBtn.style.display = "none"; 
            if (leituraAtiva === "segunLeitua") {
                leituraAtiva = "priLeitua";
                mostrarEvangelhoBtn.classList.remove("select");
                mostrarSalmoBtn.classList.remove("select");
                mostraSegundaLeituraBtn.classList.remove("select");
                mostrarPrimeiraLeituraBtn.classList.add("select");
            }
        }
    } catch (error) {
        console.error("Erro ao verificar Segunda Leitura:", error);
        mostraSegundaLeituraBtn.style.display = "none";
    }
}

// Função para carregar e exibir a leitura ativa
async function carregarLeitura(data) {
    if (leituraAtiva === "evangelho") {
        await Manipular_textos.Mostrar_liturgia(data)
        await Manipular_textos.Mostrar_evangelho(data);
        await Manipular_textos.MostrarTitulo_evangelho(data);
        await Manipular_textos.MostrarRefer_evangelho(data);
    } else if (leituraAtiva === "salmo") {
        await Manipular_textos.Mostrar_liturgia(data)
        await Manipular_textos.Mostrar_Salmo(data);
        await Manipular_textos.MostrarTitulo_Salmo(data);
        await Manipular_textos.MostrarRefer_Salmo(data);
    } else if (leituraAtiva === "priLeitua") {
        await Manipular_textos.Mostrar_liturgia(data)
        await Manipular_textos.Mostrar_priLeitura(data);
        await Manipular_textos.MostrarTitulo_priLeitura(data);
        await Manipular_textos.MostrarRefer_PriLeitura(data);
    } else if (leituraAtiva === "segunLeitua") {
        await Manipular_textos.Mostrar_liturgia(data);
        await Manipular_textos.Mostrar_SegunLeitura(data);
        await Manipular_textos.MostrarTitulo_SegunLeitura(data);
        await Manipular_textos.MostrarRefer_SegunLeitura(data);
    }
}

async function inicializarOuAtualizar(data) {
    await verificarSegundaLeitura(data);
    await carregarLeitura(data);
}

// Carregar a leitura inicial
inicializarOuAtualizar(DataManager.getDataParaAPI());

// Adicionar event listeners para os botões de leitura
mostrarPrimeiraLeituraBtn.addEventListener("click", () => {
    leituraAtiva = "priLeitua";
    mostrarEvangelhoBtn.classList.remove("select");
    mostrarSalmoBtn.classList.remove("select");
    mostraSegundaLeituraBtn.classList.remove("select");
    mostrarPrimeiraLeituraBtn.classList.add("select");
    carregarLeitura(DataManager.getDataParaAPI());
});

mostraSegundaLeituraBtn.addEventListener("click", () => {
    leituraAtiva = "segunLeitua";
    mostrarEvangelhoBtn.classList.remove("select");
    mostrarSalmoBtn.classList.remove("select");
    mostrarPrimeiraLeituraBtn.classList.remove("select");
    mostraSegundaLeituraBtn.classList.add("select");
    carregarLeitura(DataManager.getDataParaAPI());
});

mostrarEvangelhoBtn.addEventListener("click", () => {
    leituraAtiva = "evangelho";
    mostrarEvangelhoBtn.classList.add("select");
    mostrarSalmoBtn.classList.remove("select");
    mostrarPrimeiraLeituraBtn.classList.remove("select");
    mostraSegundaLeituraBtn.classList.remove("select");
    carregarLeitura(DataManager.getDataParaAPI());
});

mostrarSalmoBtn.addEventListener("click", () => {
    leituraAtiva = "salmo";
    mostrarEvangelhoBtn.classList.remove("select");
    mostrarSalmoBtn.classList.add("select");
    mostrarPrimeiraLeituraBtn.classList.remove("select");
    mostraSegundaLeituraBtn.classList.remove("select");
    carregarLeitura(DataManager.getDataParaAPI());
});

// Adicionar event listener para a mudança na data
pegarDataInput.addEventListener("change", (event) => {
    DataManager.manipularMudancaData(event); // Já atualiza DataManager.dataFormatada
    inicializarOuAtualizar(DataManager.getDataParaAPI());
});

