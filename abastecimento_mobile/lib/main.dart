import 'package:flutter/material.dart';
import 'pages/splash_page.dart';

void main() {
  runApp(const AbastecimentoApp());
}

class AbastecimentoApp extends StatefulWidget {
  const AbastecimentoApp({super.key});

  @override
  State<AbastecimentoApp> createState() => _AbastecimentoAppState();
}

class _AbastecimentoAppState extends State<AbastecimentoApp> {
  ThemeMode tema = ThemeMode.light;

  void trocarTema() {
    setState(() {
      tema = tema == ThemeMode.light ? ThemeMode.dark : ThemeMode.light;
    });
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Abastecimento',
      themeMode: tema,

      theme: ThemeData(
        useMaterial3: true,
        colorSchemeSeed: Colors.blue,
        brightness: Brightness.light,
      ),

      darkTheme: ThemeData(
        useMaterial3: true,
        colorSchemeSeed: Colors.blue,
        brightness: Brightness.dark,
      ),

      home: SplashPage(trocarTema: trocarTema),
    );
  }
}
