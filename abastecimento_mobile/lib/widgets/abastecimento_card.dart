import 'package:flutter/material.dart';
import '../models/abastecimento.dart';

class AbastecimentoCard extends StatelessWidget {
  final Abastecimento abastecimento;
  final VoidCallback onDelete;
  final VoidCallback onTap;

  const AbastecimentoCard({
    super.key,
    required this.abastecimento,
    required this.onDelete,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: ListTile(
        onTap: onTap,

        leading: CircleAvatar(
          child: Icon(
            abastecimento.combustivel.toLowerCase() == 'etanol'
                ? Icons.eco
                : Icons.local_gas_station,
          ),
        ),

        title: Text(
          abastecimento.combustivel,
          style: const TextStyle(fontWeight: FontWeight.bold),
        ),

        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Data: ${abastecimento.data}'),
            Text(
              '${abastecimento.litros.toStringAsFixed(2)} L '
              '• R\$ ${abastecimento.valorPago.toStringAsFixed(2)}',
            ),
            Text('${abastecimento.quilometragem.toStringAsFixed(0)} km'),
          ],
        ),

        trailing: IconButton(
          icon: const Icon(Icons.delete),
          onPressed: onDelete,
        ),
      ),
    );
  }
}