import 'package:flutter/material.dart';

class Project {
  final String image;

  final String title;
  final String description;
  final IconData icon;
  final String flutterSvg;
  final String dartSvg;
  final String keyFeatures;
  final String githubLink;
  final String demoVideoLink;
  final String screenshot1;
  final String screenshot2;

  Project({
    required this.image,
    required this.title,
    required this.description,
    required this.icon,
    required this.flutterSvg,
    required this.dartSvg,
    required this.keyFeatures,
    required this.githubLink,
    required this.demoVideoLink,
    required this.screenshot1,
    required this.screenshot2,
  });
}

List<Project> projects = [
  Project(
    image: "assets/ss/login.jpg",
    description:
        "A modern and clean login/register screen built using Flutter. Great for authentication flow templates.",
    keyFeatures:
        "• Elegant UI with light/dark mode support\n• Form validation with error handling\n• Responsive layout for all screen sizes",
    title: "Login/Register Design",
    icon: Icons.login,
    flutterSvg: "assets/svg/flutter.svg",
    dartSvg: "assets/svg/dart.svg",
    githubLink: "https://github.com/erfanbanaei/Flutter_Login_Ui",
    demoVideoLink: "https://fhasier.erfanbanaei.ir/",
    screenshot1: "",
    screenshot2: "",
  ),
  Project(
    image: "assets/ss/coffee.jpg",
    description:
        "A stylish coffee shop UI concept made with Flutter, featuring smooth navigation and product listing.",
    keyFeatures:
        "• Animated transitions\n• Beautiful product cards\n• Responsive layout with adaptive design",
    title: "CoffeeApp",
    icon: Icons.coffee,
    flutterSvg: "assets/svg/flutter.svg",
    dartSvg: "assets/svg/dart.svg",
    githubLink: "https://github.com/erfanbanaei/Flutter_Coffee_Ui",
    demoVideoLink: "https://coffee.erfanbanaei.ir/",
    screenshot1: "",
    screenshot2: "",
  ),
  Project(
    image: "assets/ss/fintech.jpg",
    description:
        "A sleek and professional finance app UI built with Flutter, designed for digital wallets and transactions.",
    keyFeatures:
        "• Dashboard with charts and analytics\n• Custom bottom navigation bar\n• Clean, modern design with financial focus",
    title: "FintechApp",
    icon: Icons.login,
    flutterSvg: "assets/svg/flutter.svg",
    dartSvg: "assets/svg/dart.svg",
    githubLink: "https://github.com/erfanbanaei/Flutter_Fintech_Ui",
    demoVideoLink: "https://fintech.erfanbanaei.ir/",
    screenshot1: "",
    screenshot2: "",
  ),
  Project(
    image: "assets/ss/learning.jpg",
    description:
        "A modern and minimal educational app built with Flutter, designed to showcase UI design principles and clean architecture. "
        "It demonstrates professional layout composition, responsive design, and smooth navigation using GetX.",
    keyFeatures: "• Beautiful and responsive UI\n"
        "• Category display using GridView\n"
        "• Smooth page transitions with GetX\n"
        "• Well-structured and clean codebase",
    title: "LearningApp",
    icon: Icons.school,
    flutterSvg: "assets/svg/flutter.svg",
    dartSvg: "assets/svg/dart.svg",
    githubLink: "https://github.com/erfanbanaei/Flutter_Learning_Ui",
    demoVideoLink: "https://learning.erfanbanaei.ir/",
    screenshot1: "",
    screenshot2: "",
  ),
];
