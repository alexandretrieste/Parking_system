"use strict";
console.log("interface carro");
console.log("interface encerrar");
class EstacionamentoFront {
    constructor($, estacionamento = new Estacionamento()) {
        this.$ = $;
        this.estacionamento = estacionamento;
    }
    adicionar(carro, salvar = false) {
        this.estacionamento.adicionar(carro);
        const row = document.createElement("tr");
        row.innerHTML = `
                <td>${carro.nome}</td>
                <td>${carro.placa}</td>
                <td data-time="${carro.entrada}">
                    ${carro.entrada.toLocaleString("pt-BR", {
            hour: "numeric",
            minute: "numeric",
        })}
                </td>
                <td>
                    <button class="delete">x</button>
                </td>
            `;
        console.log("adicionou");
        if (salvar) {
            this.estacionamento.salvar();
            console.log("salvou");
        }
        this.$("#patio").appendChild(row);
        console.log("adicinou na tabela");
    }
    encerrar(cells) {
        if (cells[2] instanceof HTMLElement) {
            const veiculo = {
                nome: cells[0].textContent || "",
                placa: cells[1].textContent || "",
                tempo: new Date().valueOf() -
                    new Date(cells[2].dataset.time).valueOf(),
            };
            console.log("encerrou");
            this.estacionamento.encerrar(veiculo);
            console.log("executou o this.estacionamento.encerrar");
        }
    }
    render() {
        this.$("#patio").innerHTML = "";
        this.estacionamento.patio.forEach((c) => this.adicionar(c));
        console.log("renderizou");
    }
}
class Estacionamento {
    constructor() {
        this.patio = localStorage.patio ? JSON.parse(localStorage.patio) : [];
        console.log("inseriu no array");
    }
    adicionar(carro) {
        this.patio.push(carro);
        console.log("função adicionou");
    }
    encerrar(info) {
        const tempo = this.calcTempo(info.tempo);
        const msg = `
      O veículo ${info.nome} de placa ${info.placa} permaneceu ${tempo} estacionado.
      \n\n Deseja encerrar?
    `;
        if (!confirm(msg))
            return;
        this.patio = this.patio.filter((carro) => carro.placa !== info.placa);
        console.log("encerrou");
        this.salvar();
        console.log("salvou");
    }
    calcTempo(mil) {
        var min = Math.floor(mil / 60000);
        var sec = Math.floor((mil % 60000) / 1000);
        return `${min}m e ${sec}s`;
    }
    salvar() {
        localStorage.patio = JSON.stringify(this.patio);
        console.log("executou função salvar");
    }
}
(function () {
    const $ = (q) => {
        const elem = document.querySelector(q);
        if (!elem)
            throw new Error("Ocorreu um erro ao buscar o elemento.");
        return elem;
    };
    const estacionamento = new EstacionamentoFront($);
    estacionamento.render();
    $("#send").addEventListener("click", () => {
        const nome = $("#name").value;
        const placa = $("#licence").value;
        if (!nome || !placa) {
            alert("Os campos são obrigatórios.");
            console.log("executou send e o if");
            return;
        }
        const carro = { nome, placa, entrada: new Date() };
        estacionamento.adicionar(carro, true);
        $("#name").value = "";
        $("#licence").value = "";
    });
    $("#patio").addEventListener("click", ({ target }) => {
        if (target.className === "delete") {
            estacionamento.encerrar(target.parentElement.parentElement.cells);
            estacionamento.render();
            console.log("executou o patio");
        }
    });
})();
