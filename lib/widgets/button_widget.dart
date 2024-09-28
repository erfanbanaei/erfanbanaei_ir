import "package:erfanbanaei_ir/widgets/launchURL_widget.dart";
import "package:flutter/material.dart";
import 'dart:html' as html;

Widget buttonGradient(String title, double width, double height, String url) {
  const borderRadius = 12.0;
  const gradientColors = [
    Color(0xFF130328),
    Color(0xFF250F42),
    Color(0xFF37116D),
    Color(0xFF261045),
    Color(0xFF190634),
  ];

  return Container(
    width: width,
    height: height,
    decoration: BoxDecoration(
      gradient: const LinearGradient(
        begin: Alignment(0.94, -0.35),
        end: Alignment(-0.94, 0.35),
        colors: gradientColors,
      ),
      borderRadius: BorderRadius.circular(borderRadius),
    ),
    child: InkWell(
      borderRadius: BorderRadius.circular(borderRadius),
      onTap: () {
        launchURL(url);
      },
      child: Center(
        child: Text(
          title,
          style: const TextStyle(
            color: Colors.white,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
    ),
  );
}

Widget buttonGradientCV(String title, double width, double height) {
  const borderRadius = 12.0;
  const gradientColors = [
    Color(0xFF130328),
    Color(0xFF250F42),
    Color(0xFF37116D),
    Color(0xFF261045),
    Color(0xFF190634),
  ];

  return Container(
    width: width,
    height: height,
    decoration: BoxDecoration(
      gradient: const LinearGradient(
        begin: Alignment(0.94, -0.35),
        end: Alignment(-0.94, 0.35),
        colors: gradientColors,
      ),
      borderRadius: BorderRadius.circular(borderRadius),
    ),
    child: InkWell(
      borderRadius: BorderRadius.circular(borderRadius),
      onTap: () {
        final url = 'assets/cv.pdf';
        html.AnchorElement(href: url)
          ..setAttribute('download', 'En - Cv.pdf')
          ..click();
      },
      child: Center(
        child: Text(
          title,
          style: const TextStyle(
            color: Colors.white,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
    ),
  );
}
