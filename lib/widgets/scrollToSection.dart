import "package:flutter/material.dart";

void scrollToSection(GlobalKey nameKey,
    {Duration duration = const Duration(seconds: 1)}) {
  final context = nameKey.currentContext;
  if (context != null) {
    Scrollable.ensureVisible(
      context,
      duration: duration,
      curve: Curves.easeInOut,
    );
  } else {
    debugPrint("Current context not found for the provided key.");
  }
}
