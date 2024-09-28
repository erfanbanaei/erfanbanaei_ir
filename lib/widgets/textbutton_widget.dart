import 'package:erfanbanaei_ir/widgets/scrollToSection.dart';
import 'package:flutter/material.dart';

Widget textButtonHeader(String title, GlobalKey key, {bool driwer = false}) {
  return Padding(
    padding: const EdgeInsets.only(right: 20),
    child: TextButton(
      onPressed: () {
        scrollToSection(key);
        driwer ? Navigator.of(key.currentContext!).pop() : null;
      },
      style: TextButton.styleFrom(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(10.0),
        ),
      ),
      child: Text(
        title,
        style: const TextStyle(color: Colors.white),
      ),
    ),
  );
}
