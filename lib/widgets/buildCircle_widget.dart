import "package:flutter/material.dart";
import "package:erfanbanaei_ir/constants/theme.dart";

Widget buildCircle(int index, double screenWidth) {
  final bool isLargeScreen = screenWidth > 700;
  final double circleSize = isLargeScreen ? 70 : 55;
  final double imageSize = isLargeScreen ? 50 : 40;

  return Container(
    margin: const EdgeInsets.all(5),
    width: circleSize,
    height: circleSize,
    decoration: const BoxDecoration(
      color: backgroundContainer,
      shape: BoxShape.circle,
    ),
    child: Center(
      child: SizedBox(
        width: imageSize,
        height: imageSize,
        child: Image.asset(
          "assets/icons/$index.png",
        ),
      ),
    ),
  );
}
