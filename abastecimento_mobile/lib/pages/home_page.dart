import 'package:flutter/material.dart';

import '../models/abastecimento.dart';
import '../services/storage_service.dart';
import '../widgets/abastecimento_card.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  List<Abastecimento> abastecimentos = [];

  @override
  void initState() {
    super.initState();
    carregarAbastecimentos();
  }

  Future<void> carregarAbastecimentos() async {
    final dados = await StorageService.carregar();

    setState(() {
      abastecimentos = dados;
      ordenarLista();
    });
  }

  void ordenarLista() {
    abastecimentos.sort((a, b) => a.quilometragem.compareTo(b.quilometragem));
  }

  Future<void> salvar() async {
    await StorageService.salvar(abastecimentos);
  }

  double calcularPrecoMedio() {
    if (abastecimentos.isEmpty) {
      return 0;
    }

    double totalLitros = 0;
    double totalValor = 0;

    for (final abastecimento in abastecimentos) {
      totalLitros += abastecimento.litros;
      totalValor += abastecimento.valorPago;
    }

    if (totalLitros == 0) {
      return 0;
    }

    return totalValor / totalLitros;
  }

  double calcularConsumoMedio() {
    if (abastecimentos.length < 2) {
      return 0;
    }

    double totalKm = 0;
    double totalLitros = 0;

    for (int i = 1; i < abastecimentos.length; i++) {
      final anterior = abastecimentos[i - 1];
      final atual = abastecimentos[i];

      final kmPercorridos = atual.quilometragem - anterior.quilometragem;

      if (kmPercorridos > 0 && atual.litros > 0) {
        totalKm += kmPercorridos;
        totalLitros += atual.litros;
      }
    }

    if (totalLitros == 0) {
      return 0;
    }

    return totalKm / totalLitros;
  }

  Future<void> adicionarAbastecimento() async {
    final resultado = await mostrarFormulario();

    if (resultado != null) {
      setState(() {
        abastecimentos.add(resultado);
        ordenarLista();
      });

      await salvar();
    }
  }

  Future<void> editarAbastecimento(int index) async {
    final resultado = await mostrarFormulario(
      abastecimento: abastecimentos[index],
    );

    if (resultado != null) {
      setState(() {
        abastecimentos[index] = resultado;
        ordenarLista();
      });

      await salvar();
    }
  }

  Future<Abastecimento?> mostrarFormulario({
    Abastecimento? abastecimento,
  }) async {
    final dataController = TextEditingController(
      text: abastecimento?.data ?? '',
    );

    final combustivelController = TextEditingController(
      text: abastecimento?.combustivel ?? '',
    );

    final litrosController = TextEditingController(
      text: abastecimento?.litros.toString() ?? '',
    );

    final valorController = TextEditingController(
      text: abastecimento?.valorPago.toString() ?? '',
    );

    final kmController = TextEditingController(
      text: abastecimento?.quilometragem.toString() ?? '',
    );

    return showDialog<Abastecimento>(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: Text(
            abastecimento == null
                ? 'Novo abastecimento'
                : 'Editar abastecimento',
          ),

          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                TextField(
                  controller: dataController,
                  decoration: const InputDecoration(
                    labelText: 'Data',
                    hintText: '19/08/2026',
                    prefixIcon: Icon(Icons.calendar_today),
                  ),
                ),

                const SizedBox(height: 10),

                TextField(
                  controller: combustivelController,
                  decoration: const InputDecoration(
                    labelText: 'Combustível',
                    hintText: 'Gasolina',
                    prefixIcon: Icon(Icons.local_gas_station),
                  ),
                ),

                const SizedBox(height: 10),

                TextField(
                  controller: litrosController,
                  keyboardType: const TextInputType.numberWithOptions(
                    decimal: true,
                  ),
                  decoration: const InputDecoration(
                    labelText: 'Litros',
                    prefixIcon: Icon(Icons.water_drop),
                  ),
                ),

                const SizedBox(height: 10),

                TextField(
                  controller: valorController,
                  keyboardType: const TextInputType.numberWithOptions(
                    decimal: true,
                  ),
                  decoration: const InputDecoration(
                    labelText: 'Valor pago',
                    prefixIcon: Icon(Icons.attach_money),
                  ),
                ),

                const SizedBox(height: 10),

                TextField(
                  controller: kmController,
                  keyboardType: const TextInputType.numberWithOptions(
                    decimal: true,
                  ),
                  decoration: const InputDecoration(
                    labelText: 'Quilometragem',
                    prefixIcon: Icon(Icons.speed),
                  ),
                ),
              ],
            ),
          ),

          actions: [
            TextButton(
              onPressed: () {
                Navigator.pop(context);
              },
              child: const Text('Cancelar'),
            ),

            ElevatedButton(
              onPressed: () {
                final litros = double.tryParse(
                  litrosController.text.replaceAll(',', '.'),
                );

                final valor = double.tryParse(
                  valorController.text.replaceAll(',', '.'),
                );

                final km = double.tryParse(
                  kmController.text.replaceAll(',', '.'),
                );

                if (dataController.text.isEmpty ||
                    combustivelController.text.isEmpty ||
                    litros == null ||
                    valor == null ||
                    km == null ||
                    litros <= 0 ||
                    valor < 0 ||
                    km < 0) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('Preencha todos os campos corretamente.'),
                    ),
                  );

                  return;
                }

                Navigator.pop(
                  context,
                  Abastecimento(
                    data: dataController.text,
                    combustivel: combustivelController.text,
                    litros: litros,
                    valorPago: valor,
                    quilometragem: km,
                  ),
                );
              },
              child: const Text('Salvar'),
            ),
          ],
        );
      },
    );
  }

  Future<void> excluirAbastecimento(int index) async {
    final confirmar = await showDialog<bool>(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: const Text('Excluir abastecimento?'),
          content: const Text('Esse registro será removido permanentemente.'),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.pop(context, false);
              },
              child: const Text('Cancelar'),
            ),

            ElevatedButton(
              onPressed: () {
                Navigator.pop(context, true);
              },
              child: const Text('Excluir'),
            ),
          ],
        );
      },
    );

    if (confirmar == true) {
      setState(() {
        abastecimentos.removeAt(index);
      });

      await salvar();
    }
  }

  @override
  Widget build(BuildContext context) {
    final precoMedio = calcularPrecoMedio();
    final consumoMedio = calcularConsumoMedio();

    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'Abastecimentos',
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
        centerTitle: true,
      ),

      body: RefreshIndicator(
        onRefresh: carregarAbastecimentos,

        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            Row(
              children: [
                Expanded(
                  child: Card(
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        children: [
                          const Icon(Icons.attach_money),
                          const SizedBox(height: 8),
                          const Text('Preço médio/L'),
                          const SizedBox(height: 5),
                          Text(
                            'R\$ ${precoMedio.toStringAsFixed(2)}',
                            style: const TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),

                const SizedBox(width: 10),

                Expanded(
                  child: Card(
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        children: [
                          const Icon(Icons.speed),
                          const SizedBox(height: 8),
                          const Text('Consumo médio'),
                          const SizedBox(height: 5),
                          Text(
                            consumoMedio == 0
                                ? '--'
                                : '${consumoMedio.toStringAsFixed(2)} km/L',
                            style: const TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ],
            ),

            const SizedBox(height: 20),

            if (abastecimentos.isEmpty)
              const Padding(
                padding: EdgeInsets.all(40),
                child: Column(
                  children: [
                    Icon(Icons.local_gas_station_outlined, size: 70),
                    SizedBox(height: 15),
                    Text(
                      'Nenhum abastecimento cadastrado.',
                      textAlign: TextAlign.center,
                    ),
                    SizedBox(height: 5),
                    Text(
                      'Clique no botão + para adicionar o primeiro.',
                      textAlign: TextAlign.center,
                    ),
                  ],
                ),
              )
            else
              ...List.generate(abastecimentos.length, (index) {
                return AbastecimentoCard(
                  abastecimento: abastecimentos[index],

                  onDelete: () {
                    excluirAbastecimento(index);
                  },

                  onTap: () {
                    editarAbastecimento(index);
                  },
                );
              }),
          ],
        ),
      ),

      floatingActionButton: FloatingActionButton(
        onPressed: adicionarAbastecimento,
        child: const Icon(Icons.add),
      ),
    );
  }
}