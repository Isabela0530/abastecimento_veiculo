import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/abastecimento.dart';

class StorageService {
  static const String chave = 'abastecimentos';

  static Future<List<Abastecimento>> carregar() async {
    final prefs = await SharedPreferences.getInstance();

    final dados = prefs.getString(chave);

    if (dados == null) {
      return [];
    }

    final List lista = jsonDecode(dados);

    return lista.map((item) => Abastecimento.fromJson(item)).toList();
  }

  static Future<void> salvar(List<Abastecimento> abastecimentos) async {
    final prefs = await SharedPreferences.getInstance();

    final dados = jsonEncode(
      abastecimentos.map((item) => item.toJson()).toList(),
    );

    await prefs.setString(chave, dados);
  }
}