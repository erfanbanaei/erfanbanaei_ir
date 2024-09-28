import "dart:ui";
import "package:erfanbanaei_ir/constants/theme.dart";
import "package:erfanbanaei_ir/widgets/button_widget.dart";
import "package:flutter/material.dart";

LayoutBuilder projectTemplate(
  BuildContext context, {
  required String title,
  required String projectName,
  required String description,
  required String pathImage,
  required bool rotate,
  required String url,
}) {
  final screenWidth = MediaQuery.of(context).size.width;
  final isLargeScreen = screenWidth > 800;

  return LayoutBuilder(
    builder: (context, constraints) {
      return constraints.maxWidth < 1600
          ? _buildColumnLayout(title, projectName, description, pathImage,
              rotate, url, screenWidth, isLargeScreen)
          : _buildRowLayout(title, projectName, description, pathImage, rotate,
              url, screenWidth, isLargeScreen);
    },
  );
}

Widget _buildColumnLayout(
  String title,
  String projectName,
  String description,
  String pathImage,
  bool rotate,
  String url,
  double screenWidth,
  bool isLargeScreen,
) {
  return Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      _buildTitleSection(title, projectName, screenWidth, isLargeScreen),
      Stack(
        children: [
          _buildImageContainer(pathImage, rotate, screenWidth, isLargeScreen),
          SizedBox(height: screenWidth * 1),
          Positioned(
            bottom: 10,
            child:
                _buildDescriptionBox(description, screenWidth, isLargeScreen),
          ),
        ],
      ),
      Center(
        child: buttonGradient(
          "See in Github",
          isLargeScreen ? 300 : 200,
          50,
          url,
        ),
      ),
      const SizedBox(height: 40),
    ],
  );
}

Widget _buildRowLayout(
  String title,
  String projectName,
  String description,
  String pathImage,
  bool rotate,
  String url,
  double screenWidth,
  bool isLargeScreen,
) {
  return Row(
    children: [
      Flexible(
        child: Stack(
          alignment: Alignment.center,
          children: [
            Image.asset(
              "assets/images/Gradient.png",
              width: screenWidth,
              height: isLargeScreen ? 900 : 600,
            ),
            Positioned(
              right: rotate ? null : 100,
              left: rotate ? 100 : null,
              top: isLargeScreen ? 200 : 150,
              child: _buildImageContainer(
                  pathImage, rotate, screenWidth, isLargeScreen),
            ),
            Positioned(
              top: isLargeScreen ? 200 : 150,
              left: rotate ? null : 100,
              right: rotate ? 100 : null,
              child: _buildTextColumn(title, projectName, description, rotate,
                  screenWidth, url, isLargeScreen),
            ),
          ],
        ),
      ),
    ],
  );
}

Widget _buildTitleSection(
    String title, String projectName, double screenWidth, bool isLargeScreen) {
  return Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      Text(
        title,
        style: TextStyle(
          fontFamily: "Poppins",
          fontSize: isLargeScreen ? 20 : 13,
          color: textcolor,
        ),
      ),
      Text(
        projectName,
        style: TextStyle(
          fontFamily: "Poppins",
          fontSize: isLargeScreen ? 40 : 25,
        ),
      ),
      const SizedBox(height: 10),
    ],
  );
}

Widget _buildImageContainer(
    String pathImage, bool rotate, double screenWidth, bool isLargeScreen) {
  final double imageWidth = isLargeScreen ? 800 : screenWidth * 0.8;
  final double imageHeight = isLargeScreen ? 600 : screenWidth * 0.6;

  return Container(
    width: imageWidth,
    height: imageHeight,
    decoration: BoxDecoration(
      color: onbackgroundContainer,
      borderRadius: BorderRadius.circular(10),
    ),
    child: Align(
      alignment: rotate ? Alignment.bottomLeft : Alignment.bottomRight,
      child: UnconstrainedBox(
        child: SizedBox(
          width: isLargeScreen ? 760 : screenWidth * 0.75,
          height: isLargeScreen ? 560 : screenWidth * 0.55,
          child: ClipRRect(
            borderRadius: BorderRadius.circular(15),
            child: Image.asset(pathImage),
          ),
        ),
      ),
    ),
  );
}

Widget _buildTextColumn(String title, String projectName, String description,
    bool rotate, double screenWidth, String url, bool isLargeScreen) {
  return Column(
    crossAxisAlignment:
        rotate ? CrossAxisAlignment.end : CrossAxisAlignment.start,
    mainAxisSize: MainAxisSize.min,
    children: [
      Text(
        title,
        style: TextStyle(
          fontFamily: "Poppins",
          fontSize: isLargeScreen ? 20 : 16,
          color: textcolor,
        ),
      ),
      Text(
        projectName,
        style: TextStyle(
          fontFamily: "Poppins",
          fontSize: isLargeScreen ? 40 : 30,
        ),
      ),
      const SizedBox(height: 30),
      _buildDescriptionBox(description, screenWidth, isLargeScreen),
      const SizedBox(height: 50),
      buttonGradient("See in Github", isLargeScreen ? 300 : 200, 50, url),
    ],
  );
}

Widget _buildDescriptionBox(
    String description, double screenWidth, bool isLargeScreen) {
  return ClipRRect(
    borderRadius: const BorderRadius.all(Radius.circular(14)),
    child: BackdropFilter(
      filter: ImageFilter.blur(sigmaX: 30, sigmaY: 30),
      child: Container(
        width: isLargeScreen ? 670 : screenWidth * 0.8,
        height: isLargeScreen ? 165 : 200,
        decoration: BoxDecoration(
          color: Colors.grey.withOpacity(0.1),
          borderRadius: const BorderRadius.all(Radius.circular(14)),
        ),
        child: Padding(
          padding: const EdgeInsets.all(20.0),
          child: Text(
            description,
            style: TextStyle(
              fontFamily: "Poppins",
              fontSize: isLargeScreen ? 18 : 14,
            ),
          ),
        ),
      ),
    ),
  );
}
