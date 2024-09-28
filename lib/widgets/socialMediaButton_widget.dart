import "package:erfanbanaei_ir/widgets/launchURL_widget.dart";
import "package:flutter/material.dart";

Widget socialMediaButton(String url, String assetPath) {
  return TextButton(
    onPressed: () => launchURL(url),
    child: Image.asset(
      assetPath,
      width: 40,
    ),
  );
}
