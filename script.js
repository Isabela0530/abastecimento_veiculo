let abastecimentos =
    JSON.parse(
        localStorage.getItem(
            "abastecimentos"
        )
    ) || [];


let grafico;


/*
    PREÇO POR LITRO

    valor pago ÷ litros
*/

function calcularPrecoLitro(
    valor,
    litros
) {

    if (litros <= 0) {
        return 0;
    }

    return valor / litros;

}


/*
    CONSUMO KM/L

    Considerando o abastecimento anterior:

    quilometragem atual -
    quilometragem anterior

    dividido pelos litros
    abastecidos atualmente.
*/

function calcularConsumo(
    atual,
    anterior
) {

    if (!anterior) {
        return null;
    }


    const distancia =
        atual.quilometragem -
        anterior.quilometragem;


    if (
        distancia <= 0 ||
        atual.litros <= 0
    ) {

        return null;

    }


    return distancia /
        atual.litros;

}


/*
    SALVAR
*/

function salvar() {

    localStorage.setItem(
        "abastecimentos",
        JSON.stringify(
            abastecimentos
        )
    );

}


/*
    FORMATAR DATA
*/

function formatarData(data) {

    const partes =
        data.split("-");


    return (
        `${partes[2]}/` +
        `${partes[1]}/` +
        `${partes[0]}`
    );

}


/*
    MOEDA
*/

function formatarMoeda(valor) {

    return valor.toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );

}


/*
    RENDERIZAR LISTA
*/

function renderizarAbastecimentos() {

    const lista =
        document.getElementById(
            "listaAbastecimentos"
        );


    const totalRegistros =
        document.getElementById(
            "totalRegistros"
        );


    lista.innerHTML = "";


    totalRegistros.textContent =
        abastecimentos.length === 1
            ? "1 abastecimento"
            : `${abastecimentos.length} abastecimentos`;


    if (
        abastecimentos.length === 0
    ) {

        lista.innerHTML = `

            <div class="sem-registros">

                <h3>
                    Nenhum abastecimento registrado
                </h3>

                <p>
                    Adicione seu primeiro abastecimento acima.
                </p>

            </div>

        `;


        atualizarResumo();

        atualizarGrafico();

        return;

    }


    /*
        Ordena pela quilometragem
        para calcular corretamente
        o consumo entre abastecimentos.
    */

    const ordenados =
        [...abastecimentos]
            .sort(
                (
                    a,
                    b
                ) =>
                    a.quilometragem -
                    b.quilometragem
            );


    abastecimentos
        .sort(
            (
                a,
                b
            ) =>
                new Date(b.data) -
                new Date(a.data)
        );


    abastecimentos.forEach(
        registro => {

            const indice =
                ordenados.findIndex(
                    item =>
                        item.id ===
                        registro.id
                );


            let consumo = null;


            if (indice > 0) {

                consumo =
                    calcularConsumo(
                        registro,
                        ordenados[
                            indice - 1
                        ]
                    );

            }


            const precoLitro =
                calcularPrecoLitro(
                    registro.valor,
                    registro.litros
                );


            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "abastecimento";


            item.onclick = () =>
                abrirModal(
                    registro.id
                );


            item.innerHTML = `

                <div class="abastecimento-topo">

                    <div class="data">

                        📅
                        ${formatarData(
                            registro.data
                        )}

                        —
                        ${registro.combustivel}

                    </div>


                    <button
                        class="btn-excluir"
                        onclick="
                            event.stopPropagation();
                            excluirAbastecimento(
                                ${registro.id}
                            )
                        "
                    >
                        🗑️
                    </button>

                </div>


                <div class="abastecimento-info">


                    <div class="info-item">

                        <span>
                            Litros
                        </span>

                        <strong>
                            ${registro.litros.toFixed(2)}
                            L
                        </strong>

                    </div>


                    <div class="info-item">

                        <span>
                            Valor pago
                        </span>

                        <strong>
                            ${formatarMoeda(
                                registro.valor
                            )}
                        </strong>

                    </div>


                    <div class="info-item">

                        <span>
                            Quilometragem
                        </span>

                        <strong>
                            ${registro.quilometragem.toLocaleString(
                                "pt-BR"
                            )}
                            km
                        </strong>

                    </div>


                    <div class="info-item">

                        <span>
                            Preço/L
                        </span>

                        <strong>
                            ${formatarMoeda(
                                precoLitro
                            )}
                        </strong>

                    </div>


                </div>


                <div class="consumo">

                    <span>
                        🚗 Consumo do veículo
                    </span>


                    <strong>

                        ${
                            consumo !== null
                                ? consumo.toFixed(2)
                                    + " km/L"
                                : "Primeiro abastecimento"

                        }

                    </strong>

                </div>

            `;


            lista.appendChild(item);

        }
    );


    atualizarResumo();

    atualizarGrafico();

}


/*
    RESUMO

    Preço médio por litro =
    total gasto ÷ total litros
*/

function atualizarResumo() {

    if (
        abastecimentos.length === 0
    ) {

        document.getElementById(
            "precoMedio"
        ).textContent =
            "R$ 0,00";


        document.getElementById(
            "consumoMedio"
        ).textContent =
            "0,00 km/L";


        document.getElementById(
            "totalLitros"
        ).textContent =
            "0,00 L";


        return;

    }


    const totalLitros =
        abastecimentos.reduce(
            (
                soma,
                item
            ) =>
                soma +
                item.litros,

            0
        );


    const totalValor =
        abastecimentos.reduce(
            (
                soma,
                item
            ) =>
                soma +
                item.valor,

            0
        );


    const precoMedio =
        totalLitros > 0
            ? totalValor /
                totalLitros
            : 0;


    /*
        Consumo médio

        Ordenamos por quilometragem
        e calculamos cada trecho.
    */

    const ordenados =
        [...abastecimentos]
            .sort(
                (
                    a,
                    b
                ) =>
                    a.quilometragem -
                    b.quilometragem
            );


    const consumos = [];


    for (
        let i = 1;
        i < ordenados.length;
        i++
    ) {

        const consumo =
            calcularConsumo(
                ordenados[i],
                ordenados[i - 1]
            );


        if (
            consumo !== null
        ) {

            consumos.push(
                consumo
            );

        }

    }


    let consumoMedio = 0;


    if (
        consumos.length > 0
    ) {

        consumoMedio =
            consumos.reduce(
                (
                    soma,
                    valor
                ) =>
                    soma + valor,

                0
            ) /
            consumos.length;

    }


    document.getElementById(
        "precoMedio"
    ).textContent =
        formatarMoeda(
            precoMedio
        );


    document.getElementById(
        "consumoMedio"
    ).textContent =
        consumoMedio > 0
            ? consumoMedio.toFixed(2)
                + " km/L"
            : "Aguardando dados";


    document.getElementById(
        "totalLitros"
    ).textContent =
        totalLitros.toFixed(2)
        + " L";

}


/*
    ADICIONAR
*/

document
    .getElementById(
        "formAbastecimento"
    )
    .addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const novo = {

                id: Date.now(),

                data:
                    document.getElementById(
                        "data"
                    ).value,

                combustivel:
                    document.getElementById(
                        "combustivel"
                    ).value,

                litros:
                    Number(
                        document.getElementById(
                            "litros"
                        ).value
                    ),

                valor:
                    Number(
                        document.getElementById(
                            "valor"
                        ).value
                    ),

                quilometragem:
                    Number(
                        document.getElementById(
                            "quilometragem"
                        ).value
                    )

            };


            /*
                Verifica se a quilometragem
                é maior que o último registro.
            */

            if (
                abastecimentos.length > 0
            ) {

                const maiorKm =
                    Math.max(
                        ...abastecimentos.map(
                            item =>
                                item.quilometragem
                        )
                    );


                if (
                    novo.quilometragem <=
                    maiorKm
                ) {

                    alert(
                        "A quilometragem deve ser maior que a do abastecimento anterior."
                    );

                    return;

                }

            }


            abastecimentos.push(
                novo
            );


            salvar();

            renderizarAbastecimentos();


            this.reset();


            document.getElementById(
                "data"
            ).value =
                obterDataHoje();

        }
    );


/*
    DATA DE HOJE
*/

function obterDataHoje() {

    const hoje =
        new Date();


    const ano =
        hoje.getFullYear();


    const mes =
        String(
            hoje.getMonth() + 1
        ).padStart(
            2,
            "0"
        );


    const dia =
        String(
            hoje.getDate()
        ).padStart(
            2,
            "0"
        );


    return (
        `${ano}-${mes}-${dia}`
    );

}


/*
    EXCLUIR
*/

function excluirAbastecimento(
    id
) {

    abastecimentos =
        abastecimentos.filter(
            item =>
                item.id !== id
        );


    salvar();

    renderizarAbastecimentos();

}


/*
    LIMPAR TUDO
*/

function limparTudo() {

    if (
        abastecimentos.length === 0
    ) {

        return;

    }


    const confirmar =
        confirm(
            "Deseja realmente excluir todos os abastecimentos?"
        );


    if (!confirmar) {

        return;

    }


    abastecimentos = [];


    salvar();

    renderizarAbastecimentos();

}


/*
    MODAL
*/

function abrirModal(id) {

    const registro =
        abastecimentos.find(
            item =>
                item.id === id
        );


    if (!registro) {

        return;

    }


    document.getElementById(
        "editarId"
    ).value =
        registro.id;


    document.getElementById(
        "editarData"
    ).value =
        registro.data;


    document.getElementById(
        "editarCombustivel"
    ).value =
        registro.combustivel;


    document.getElementById(
        "editarLitros"
    ).value =
        registro.litros;


    document.getElementById(
        "editarValor"
    ).value =
        registro.valor;


    document.getElementById(
        "editarQuilometragem"
    ).value =
        registro.quilometragem;


    document.getElementById(
        "modal"
    ).classList.add(
        "ativo"
    );

}


/*
    FECHAR MODAL
*/

function fecharModal() {

    document.getElementById(
        "modal"
    ).classList.remove(
        "ativo"
    );

}


/*
    EDITAR
*/

document
    .getElementById(
        "formEditar"
    )
    .addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const id =
                Number(
                    document.getElementById(
                        "editarId"
                    ).value
                );


            const registro =
                abastecimentos.find(
                    item =>
                        item.id === id
                );


            if (!registro) {

                return;

            }


            const novaKm =
                Number(
                    document.getElementById(
                        "editarQuilometragem"
                    ).value
                );


            /*
                Verificar se a nova
                quilometragem não quebra
                a sequência.
            */

            const conflito =
                abastecimentos.some(
                    item =>
                        item.id !== id &&
                        item.quilometragem ===
                        novaKm
                );


            if (conflito) {

                alert(
                    "Já existe um abastecimento com essa quilometragem."
                );

                return;

            }


            registro.data =
                document.getElementById(
                    "editarData"
                ).value;


            registro.combustivel =
                document.getElementById(
                    "editarCombustivel"
                ).value;


            registro.litros =
                Number(
                    document.getElementById(
                        "editarLitros"
                    ).value
                );


            registro.valor =
                Number(
                    document.getElementById(
                        "editarValor"
                    ).value
                );


            registro.quilometragem =
                novaKm;


            salvar();

            renderizarAbastecimentos();

            fecharModal();

        }
    );


/*
    GRÁFICO
*/

function atualizarGrafico() {

    const canvas =
        document.getElementById(
            "graficoAbastecimento"
        );


    /*
        Ordenação por data
    */

    const dados =
        [...abastecimentos]
            .sort(
                (
                    a,
                    b
                ) =>
                    new Date(a.data) -
                    new Date(b.data)
            );


    const labels =
        dados.map(
            (
                item,
                index
            ) =>
                `Abastecimento ${index + 1}`
        );


    const precos =
        dados.map(
            item =>
                calcularPrecoLitro(
                    item.valor,
                    item.litros
                )
        );


    /*
        Consumo de cada abastecimento
    */

    const ordenadosKm =
        [...abastecimentos]
            .sort(
                (
                    a,
                    b
                ) =>
                    a.quilometragem -
                    b.quilometragem
            );


    const consumos =
        dados.map(
            item => {

                const indice =
                    ordenadosKm.findIndex(
                        registro =>
                            registro.id ===
                            item.id
                    );


                if (
                    indice === 0
                ) {

                    return 0;

                }


                return calcularConsumo(
                    item,
                    ordenadosKm[
                        indice - 1
                    ]
                ) || 0;

            }
        );


    if (grafico) {

        grafico.destroy();

    }


    grafico =
        new Chart(
            canvas,
            {

                type: "bar",

                data: {

                    labels: labels,

                    datasets: [

                        {

                            label:
                                "Preço por litro (R$)",

                            data: precos,

                            borderWidth: 1

                        },

                        {

                            label:
                                "Consumo (km/L)",

                            data: consumos,

                            borderWidth: 1

                        }

                    ]

                },


                options: {

                    responsive: true,

                    maintainAspectRatio:
                        false,

                    scales: {

                        y: {

                            beginAtZero:
                                true,

                            title: {

                                display:
                                    true,

                                text:
                                    "Valor / Consumo"

                            }

                        }

                    }

                }

            }
        );

}


/*
    TEMA ESCURO
*/

function alternarTema() {

    document.body.classList.toggle(
        "escuro"
    );


    const escuro =
        document.body.classList.contains(
            "escuro"
        );


    document.getElementById(
        "btnTema"
    ).textContent =
        escuro
            ? "☀️"
            : "🌙";


    localStorage.setItem(
        "temaAbastecimento",
        escuro
            ? "escuro"
            : "claro"
    );

}


/*
    CARREGAR TEMA
*/

function carregarTema() {

    const tema =
        localStorage.getItem(
            "temaAbastecimento"
        );


    if (
        tema === "escuro"
    ) {

        document.body.classList.add(
            "escuro"
        );


        document.getElementById(
            "btnTema"
        ).textContent =
            "☀️";

    }

}


/*
    INICIALIZAÇÃO
*/

document.getElementById(
    "data"
).value =
    obterDataHoje();


carregarTema();

renderizarAbastecimentos();