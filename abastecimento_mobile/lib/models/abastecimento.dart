class Abastecimento {
  String data;
  String combustivel;
  double litros;
  double valorPago;
  double quilometragem;

  Abastecimento({
    required this.data,
    required this.combustivel,
    required this.litros,
    required this.valorPago,
    required this.quilometragem,
  });

  double get precoPorLitro => valorPago / litros;

  Map<String, dynamic> toJson() {
    return {
      'data': data,
      'combustivel': combustivel,
      'litros': litros,
      'valor_pago': valorPago,
      'quilometragem': quilometragem,
    };
  }

  factory Abastecimento.fromJson(Map<String, dynamic> json) {
    return Abastecimento(
      data: json['data'],
      combustivel: json['combustivel'],
      litros: (json['litros'] as num).toDouble(),
      valorPago: (json['valor_pago'] as num).toDouble(),
      quilometragem: (json['quilometragem'] as num).toDouble(),
    );
  }
}