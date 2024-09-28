import 'package:erfanbanaei_ir/constants/theme.dart';
import 'package:erfanbanaei_ir/pages/main_page.dart';
import 'package:flutter/material.dart';

void main() {
  runApp(const MainApp());
}

class MainApp extends StatelessWidget {
  const MainApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        fontFamily: "Preahvihear",
        scaffoldBackgroundColor: onprimaryContainer,
        textTheme: const TextTheme(
          bodyMedium: TextStyle(color: onprimary),
        ),
      ),
      home: MainPage(),
    );
  }
}
