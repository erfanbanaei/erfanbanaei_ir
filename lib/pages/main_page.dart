import "package:animated_text_kit/animated_text_kit.dart";
import "package:erfanbanaei_ir/constants/globalKey.dart";
import "package:erfanbanaei_ir/constants/theme.dart";
import "package:erfanbanaei_ir/widgets/buildCircle_widget.dart";
import "package:erfanbanaei_ir/widgets/button_widget.dart";
import "package:erfanbanaei_ir/widgets/projectThemplate_widget.dart";
import "package:erfanbanaei_ir/widgets/socialMediaButton_widget.dart";
import "package:erfanbanaei_ir/widgets/textbutton_widget.dart";
import "package:flutter/material.dart";

class MainPage extends StatelessWidget {
  MainPage({super.key});

  final ScrollController _scrollController = ScrollController();

  @override
  Widget build(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;

    return Scaffold(
      appBar: AppBar(
        backgroundColor: primaryContainer,
        toolbarHeight: 70,
        iconTheme: const IconThemeData(
          color: Colors.white,
        ),
        leading: Padding(
          padding: const EdgeInsets.only(left: 20),
          child: Image.asset("assets/images/Logo.png"),
        ),
        actions: screenWidth > 800
            ? [
                const Spacer(),
                textButtonHeader("Home", homeKey),
                textButtonHeader("About Me", aboutKey),
                textButtonHeader("Resume", resumeKey),
                textButtonHeader("Skills", skillKey),
                textButtonHeader("Projects", projectKey),
                textButtonHeader("Contact", contactKey),
                const Spacer(),
              ]
            : null,
      ),
      endDrawer: screenWidth <= 800
          ? Drawer(
              backgroundColor: primaryContainer,
              child: Column(
                children: <Widget>[
                  const Spacer(),
                  textButtonHeader("Home", homeKey, driwer: true),
                  textButtonHeader("About Me", aboutKey, driwer: true),
                  textButtonHeader("Resume", resumeKey, driwer: true),
                  textButtonHeader("Skills", skillKey, driwer: true),
                  textButtonHeader("Projects", projectKey, driwer: true),
                  textButtonHeader("Contact", contactKey, driwer: true),
                  const Spacer(),
                ],
              ),
            )
          : null,
      body: SingleChildScrollView(
        controller: _scrollController,
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20),
          child: Center(
            key: homeKey,
            child: Column(
              children: [
                const SizedBox(height: 100),
                LayoutBuilder(
                  builder: (context, constraints) {
                    if (constraints.maxWidth < 1000) {
                      return Column(
                        children: [
                          Image.asset("assets/images/Me.png"),
                          const Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text.rich(
                                TextSpan(
                                  text: "Hello! I Am ",
                                  style: TextStyle(
                                    fontSize: 25,
                                  ),
                                  children: [
                                    TextSpan(
                                      text: "erfan banaei.",
                                      style: TextStyle(
                                        color: primary,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                              SizedBox(height: 10),
                              Text("A programmer who"),
                              Text.rich(
                                TextSpan(
                                  text: "Diligently seeks to\nsolve complex ",
                                  style: TextStyle(fontSize: 30),
                                  children: [
                                    TextSpan(
                                      text: "problems",
                                      style: TextStyle(color: primary),
                                    ),
                                  ],
                                ),
                              )
                            ],
                          )
                        ],
                      );
                    } else {
                      return Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Image.asset("assets/images/Me.png"),
                          const Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text.rich(
                                TextSpan(
                                  text: "Hello! I Am ",
                                  style: TextStyle(
                                    fontSize: 25,
                                  ),
                                  children: [
                                    TextSpan(
                                      text: "erfan banaei.",
                                      style: TextStyle(
                                        color: primary,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                              SizedBox(height: 10),
                              Text("A programmer who"),
                              Text.rich(
                                TextSpan(
                                  text: "Diligently seeks to\nsolve complex ",
                                  style: TextStyle(fontSize: 50),
                                  children: [
                                    TextSpan(
                                      text: "problems",
                                      style: TextStyle(color: primary),
                                    ),
                                  ],
                                ),
                              )
                            ],
                          )
                        ],
                      );
                    }
                  },
                ),
                SizedBox(
                  key: aboutKey,
                  height: 50,
                ),
                AnimatedTextKit(isRepeatingAnimation: true, animatedTexts: [
                  TyperAnimatedText(
                    "I'm a Software Engineer.",
                    speed: const Duration(milliseconds: 100),
                    textStyle: TextStyle(fontSize: screenWidth > 700 ? 50 : 25),
                  ),
                ]),
                const SizedBox(height: 20),
                Text(
                  "Hi, I'm Irfan Banaei, and I've been active in programming since 2018.\nDuring this time, I've gained solid skills in mobile app development using Flutter. Currently,\nmy focus is on Flutter, and I'm capable of building efficient and high-quality apps.",
                  style: TextStyle(
                    fontSize: screenWidth > 700 ? 22 : 15,
                  ),
                  textAlign: TextAlign.center,
                ),
                SizedBox(
                  key: resumeKey,
                  height: 60,
                ),
                buttonGradientCV("Download Cv", 600, 50),
                SizedBox(
                  key: skillKey,
                  height: 200,
                ),
                Text.rich(
                  TextSpan(
                    text: "I have already acquired these ",
                    style: TextStyle(
                      fontSize: screenWidth > 700 ? 40 : 17,
                    ),
                    children: const [
                      TextSpan(text: "skills", style: TextStyle(color: primary))
                    ],
                  ),
                ),
                Text(
                  "I value improving people's lives through accessible programming",
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: screenWidth > 700 ? 30 : 15,
                  ),
                ),
                const SizedBox(height: 50),
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: List.generate(
                    5,
                    (index) => buildCircle(
                      index + 1,
                      screenWidth,
                    ),
                  ),
                ),
                const SizedBox(height: 10),
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: List.generate(
                    4,
                    (index) => buildCircle(
                      index + 6,
                      screenWidth,
                    ),
                  ),
                ),
                const SizedBox(height: 50),
                Image.asset("assets/images/SkillBanner.png"),
                const SizedBox(height: 30),
                Column(
                  key: projectKey,
                  children: [
                    projectTemplate(
                      context,
                      rotate: false,
                      pathImage: "assets/images/project1.png",
                      title: "Frontend Project",
                      projectName: "Coffee App",
                      description:
                          "An app designed and developed with Flutter, like a 'Cafe App,' benefits from the frameworks features such as responsive UI and modern design.\nIf the Cafe App is built with Flutter, it can deliver a sleek and smooth user experience based on modern design principles like Material Design.",
                      url: "https://github.com/erfanbanaei/Flutter_Coffee_Ui",
                    ),
                    projectTemplate(context,
                        rotate: true,
                        pathImage: "assets/images/project2.png",
                        title: "Frontend Project",
                        projectName: "Finance App",
                        description:
                            "A Finance App developed with Flutter can deliver a robust and user-friendly interface, taking advantage of the framework’s flexibility and high-performance features.\nSuch apps often require efficient data presentation, secure transactions, and smooth navigation, all of which Flutter supports.",
                        url:
                            "https://github.com/erfanbanaei/Flutter_Fintech_Ui"),
                    projectTemplate(
                      rotate: false,
                      context,
                      pathImage: "assets/images/project3.png",
                      title: "Frontend Project",
                      projectName: "Login App",
                      description:
                          "A Login App developed with Flutter can provide a smooth, secure, and intuitive user experience, utilizing Flutter’s native features for quick and easy authentication.\nLogin screens are often the first point of interaction for users, so creating a well-designed, efficient login flow is essential for good user engagement.",
                      url: "https://github.com/erfanbanaei/Flutter_Login_Ui",
                    ),
                  ],
                ),
                SizedBox(
                  key: contactKey,
                  height: 200,
                ),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Text(
                      "Contact",
                      textAlign: TextAlign.left,
                      style: TextStyle(fontSize: 30),
                    ),
                    const SizedBox(height: 30),
                    const Text(
                      "I'm currently looking to join a cross-functional team that values improving people's lives\nthrough accessible design. or have a project in mind? Let's connect.",
                      style: TextStyle(fontSize: 20),
                    ),
                    const SizedBox(height: 20),
                    Row(
                      children: [
                        socialMediaButton("https://github.com/erfanbanaei/",
                            "assets/icons/10.png"),
                        socialMediaButton(
                            "https://www.instagram.com/erfanbanaei.ir",
                            "assets/icons/11.png"),
                        socialMediaButton(
                            "https://www.linkedin.com/in/erfanbanaeii/",
                            "assets/icons/12.png"),
                        socialMediaButton("https://twitter.com/erfan_banaei",
                            "assets/icons/15.png"),
                        socialMediaButton(
                            "https://t.me/MrTakDev", "assets/icons/14.png"),
                        socialMediaButton(
                          "tel:+989108453720",
                          "assets/icons/13.png",
                        )
                      ],
                    )
                  ],
                ),
                const SizedBox(height: 200),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
