import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../Data/profilePic_book.dart';
import '../../../functions/Custom_backdrop_filter.dart';
import '../../../functions/GoogleMap_Integration.dart';
import '../../../styles/styles.dart';

class AboutMeMobile extends StatefulWidget {
  const AboutMeMobile({super.key});

  @override
  State<AboutMeMobile> createState() => _AboutMeMobileState();
}

class _AboutMeMobileState extends State<AboutMeMobile> {
  @override
  Widget build(BuildContext context) {
    double deviceWidth = MediaQuery.of(context).size.width;
    // double deviceHeight = MediaQuery.of(context).size.height;
    // double deviceWidth = isdeviceWidth < 1315 ? (MediaQuery.of(context).size.width + 194) : 1536;
    return SingleChildScrollView(
      child: Padding(
        padding: const EdgeInsets.only(left: 16, right: 16),
        child: Column(
          children: [
            Container(
              padding: containerStyle.padding,
              margin: containerStyle.margin,
              width: deviceWidth,
              child: Column(
                mainAxisAlignment: MainAxisAlignment.start,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    "BEYOND PORTFOLIO",
                    style: GoogleFonts.chakraPetch(
                        textStyle: textStyles.HeadingB, fontSize: 18),
                  ),
                  const SizedBox(
                    height: 15,
                  ),
                  Text(
                    "Let's know more about me",
                    style: GoogleFonts.chakraPetch(textStyle: textStyles.B),
                  )
                ],
              ),
            ),
            CustomBox(
              borderRadius: containerStyle.borderRadius,
              margin: containerStyle.margin,
              child: Container(
                decoration: BoxDecoration(
                  color: containerStyle.color,
                  gradient: RadialGradient(
                    colors: [
                      const Color.fromARGB(255, 79, 79, 79),
                      containerStyle.color
                    ],
                    center: Alignment.bottomCenter,
                  ),
                  borderRadius: containerStyle.borderRadius,
                ),
                padding: containerStyle.paddingNew,
                width: deviceWidth,
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Icon(
                                color: textStyles.B.color, Icons.flare_rounded),
                            Text(
                              " Current Read",
                              style: GoogleFonts.chakraPetch(
                                  textStyle: textStyles.HeadingB),
                            ),
                          ],
                        ),
                        const SizedBox(
                          height: 15,
                        ),
                        Text(
                          "Can't Hurt Me • David Goggins",
                          style:
                              GoogleFonts.chakraPetch(textStyle: textStyles.P1),
                        ),
                      ],
                    ),
                    const SizedBox(
                      height: 15,
                    ),
                    Container(
                      decoration: BoxDecoration(
                        boxShadow: [
                          BoxShadow(
                            color:
                                Colors.black.withOpacity(0.15), // Shadow color
                            spreadRadius: 1, // Spread radius
                            blurRadius: 5, // Blur radius
                            offset: const Offset(
                                0, 3), // Offset in the x and y direction
                          ),
                        ],
                      ),
                      child: Image.asset(
                        bookPic,
                        height: 250,
                        fit: BoxFit.fitWidth,
                        alignment: Alignment.bottomCenter,
                      ),
                    )
                  ],
                ),
              ),
            ),
            Stack(
              alignment: Alignment.bottomLeft,
              children: [
                Container(
                  margin: containerStyle.margin,
                  width: deviceWidth,
                  height: 200,
                  child: ClipRRect(
                    borderRadius: containerStyle.borderRadius,
                    child: const RandomLocationMap(),
                  ),
                ),
                Padding(
                  padding: containerStyle.margin,
                  child: Container(
                    width: (deviceWidth / 2.5) + 10,
                    decoration: const BoxDecoration(
                      color: Color.fromARGB(130, 167, 167, 167),
                      borderRadius: BorderRadius.all(Radius.circular(50)),
                    ),
                    margin: containerStyle.margin,
                    padding: const EdgeInsets.only(
                        left: 8, right: 8, top: 5, bottom: 5),
                    child: Row(
                      children: [
                        const Icon(color: Colors.red, Icons.place_rounded),
                        Text(
                          ' Tehran, Iran',
                          style: GoogleFonts.chakraPetch(
                              textStyle: textStyles.edu_P_N,
                              fontWeight: FontWeight.bold),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
            CustomBox(
              margin: containerStyle.margin,
              borderRadius: containerStyle.borderRadius,
              child: Container(
                decoration: BoxDecoration(
                  color: containerStyle.color,
                  borderRadius: containerStyle.borderRadius,
                ),
                // padding: containerStyle.padding,
                width: deviceWidth,
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    Padding(
                      padding: containerStyle.paddingNewHeading,
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Icon(
                                  color: textStyles.B.color,
                                  Icons.flare_rounded),
                              Text(
                                " My Persona",
                                style: GoogleFonts.chakraPetch(
                                    textStyle: textStyles.HeadingB),
                              ),
                            ],
                          ),
                          const SizedBox(
                            height: 15,
                          ),
                          Text(
                            "Know me as a person",
                            style: GoogleFonts.chakraPetch(
                                textStyle: textStyles.P1),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(
                      // color: Colors.amber,
                      height: 255,
                      width: 380,
                      child: Center(
                        child: Stack(
                          alignment: AlignmentDirectional.center,
                          // ignore: prefer_const_literals_to_create_immutables
                          children: [
                            Positioned(
                              bottom: 100,
                              left: 200, // Adjusted left position
                              child: rotating_container(
                                width: 169, // Adjusted width
                                color: Color(0xFF4A90E2), // Tomato
                                rotationZ: -4,
                                text: "Curious Mind",
                                emoji:
                                    "assets/emoji/Magnifier.png", // Magnifying Glass
                              ),
                            ),
                            Positioned(
                              bottom: 60,
                              left: 5, // Adjusted left position
                              child: rotating_container(
                                width: 135, // Adjusted width
                                color: Color(0xFFD4AC4B), // Sky Blue
                                rotationZ: -15,
                                text: "Bookworm",
                                emoji: "assets/emoji/Book.png", // Books
                              ),
                            ),
                            Positioned(
                              bottom: 10,
                              left: 60, // Adjusted left position
                              child: rotating_container(
                                width: 135, // Adjusted width
                                color: Color(0xFF27AE60), // Dark Orange
                                rotationZ: 2,
                                text: "Traveler",
                                emoji: "assets/emoji/Airplane.png", // Airplane
                              ),
                            ),
                            Positioned(
                              bottom: 160,
                              left: 180, // Adjusted left position
                              child: rotating_container(
                                width: 130, // Adjusted width
                                color: Color(0xFFC0392B), // Lawn Green
                                rotationZ: 12,
                                text: "Gym Rat",
                                emoji: "assets/emoji/Gym.png", // Weightlifter
                              ),
                            ),
                            Positioned(
                              bottom: 120,
                              left: 10, // Adjusted left position
                              child: rotating_container(
                                width: 190, // Adjusted width
                                color: Color(0xFFF39C12), // Medium Purple
                                rotationZ: -4,
                                text: "Problem Solver",
                                emoji: "assets/emoji/Brain.png", // Circle
                              ),
                            ),
                            Positioned(
                              bottom: 35,
                              left: 150, // Adjusted left position
                              child: rotating_container(
                                width: 215, // Adjusted width
                                color: Color(0xFF8E44AD), // Medium Purple
                                rotationZ: 18,
                                text: "Friendly Ambivert",
                                emoji: "assets/emoji/Moon.png", // Circle
                              ),
                            ),
                          ],
                        ),
                      ),
                    )
                  ],
                ),
              ),
            ),
            Center(
              child: Stack(
                children: [
                  CustomBox(
                    margin: containerStyle.margin,
                    borderRadius: containerStyle.borderRadius,
                    child: Container(
                      decoration: BoxDecoration(
                        color: containerStyle.color,
                        borderRadius: containerStyle.borderRadius,
                      ),
                      padding: containerStyle.paddingNew,
                      width: deviceWidth,
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.start,
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          // Story Section 1 - Early Years
                          SizedBox(
                            height: 400, // Fixed height instead of Expanded
                            child: ScrollConfiguration(
                              behavior: const ScrollBehavior()
                                  .copyWith(scrollbars: false),
                              child: SingleChildScrollView(
                                child: Column(
                                  children: [
                                    const SizedBox(height: 40),
                                    RichText(
                                      text: TextSpan(
                                        style: const TextStyle(
                                            fontSize: 16,
                                            height: 1.5,
                                            color: Colors.white),
                                        children: [
                                          TextSpan(
                                              text:
                                                  'My coding journey began unexpectedly early - at just ',
                                              style: GoogleFonts.chakraPetch(
                                                  textStyle: textStyles.P1,
                                                  fontSize: kDefaultFontSize)),
                                          TextSpan(
                                              text: '12 years old',
                                              style: GoogleFonts.chakraPetch(
                                                  textStyle: textStyles.P1,
                                                  fontSize: kDefaultFontSize,
                                                  fontWeight: FontWeight.bold,
                                                  color: Colors.blueGrey)),
                                          TextSpan(
                                              text: ' in ',
                                              style: GoogleFonts.chakraPetch(
                                                  textStyle: textStyles.P1,
                                                  fontSize: kDefaultFontSize)),
                                          TextSpan(
                                              text: '7th grade (2015)',
                                              style: GoogleFonts.chakraPetch(
                                                  textStyle: textStyles.P1,
                                                  fontSize: kDefaultFontSize,
                                                  fontWeight: FontWeight.bold,
                                                  color: Colors.blueGrey)),
                                          TextSpan(
                                              text: '. I bravely dove into ',
                                              style: GoogleFonts.chakraPetch(
                                                  textStyle: textStyles.P1,
                                                  fontSize: kDefaultFontSize)),
                                          TextSpan(
                                              text: 'C++',
                                              style: GoogleFonts.chakraPetch(
                                                  textStyle: textStyles.P1,
                                                  fontSize: kDefaultFontSize,
                                                  fontWeight: FontWeight.bold,
                                                  color: Colors.blueGrey)),
                                          TextSpan(
                                              text:
                                                  ', but its complexity overwhelmed my young mind. Undeterred, I tried ',
                                              style: GoogleFonts.chakraPetch(
                                                  textStyle: textStyles.P1,
                                                  fontSize: kDefaultFontSize)),
                                          TextSpan(
                                              text: 'Java',
                                              style: GoogleFonts.chakraPetch(
                                                  textStyle: textStyles.P1,
                                                  fontSize: kDefaultFontSize,
                                                  fontWeight: FontWeight.bold,
                                                  color: Colors.blueGrey)),
                                          TextSpan(
                                              text: ' next, but at ',
                                              style: GoogleFonts.chakraPetch(
                                                  textStyle: textStyles.P1,
                                                  fontSize: kDefaultFontSize)),
                                          TextSpan(
                                              text: '14',
                                              style: GoogleFonts.chakraPetch(
                                                  textStyle: textStyles.P1,
                                                  fontSize: kDefaultFontSize,
                                                  fontWeight: FontWeight.bold,
                                                  color: Colors.blueGrey)),
                                          TextSpan(
                                              text:
                                                  ', even its object-oriented concepts proved challenging. These early struggles became my most valuable teachers, forging my persistence.',
                                              style: GoogleFonts.chakraPetch(
                                                  textStyle: textStyles.P1,
                                                  fontSize: kDefaultFontSize)),
                                        ],
                                      ),
                                    ),
                                    const SizedBox(height: 20),

                                    // Story Section 2 - Web Development Breakthrough
                                    RichText(
                                      text: TextSpan(
                                        style: const TextStyle(
                                            fontSize: 16,
                                            height: 1.5,
                                            color: Colors.white),
                                        children: [
                                          TextSpan(
                                              text: 'Everything changed in ',
                                              style: GoogleFonts.chakraPetch(
                                                  textStyle: textStyles.P1,
                                                  fontSize: kDefaultFontSize)),
                                          TextSpan(
                                              text: '10th grade (2018)',
                                              style: GoogleFonts.chakraPetch(
                                                  textStyle: textStyles.P1,
                                                  fontSize: kDefaultFontSize,
                                                  fontWeight: FontWeight.bold,
                                                  color: Colors.blueGrey)),
                                          TextSpan(
                                              text: ' when I discovered ',
                                              style: GoogleFonts.chakraPetch(
                                                  textStyle: textStyles.P1,
                                                  fontSize: kDefaultFontSize)),
                                          TextSpan(
                                              text: 'HTML/CSS',
                                              style: GoogleFonts.chakraPetch(
                                                  textStyle: textStyles.P1,
                                                  fontSize: kDefaultFontSize,
                                                  fontWeight: FontWeight.bold,
                                                  color: Colors.blueGrey)),
                                          TextSpan(
                                              text:
                                                  '. Their immediate visual feedback finally made programming "click" for me. I then explored ',
                                              style: GoogleFonts.chakraPetch(
                                                  textStyle: textStyles.P1,
                                                  fontSize: kDefaultFontSize)),
                                          TextSpan(
                                              text: 'JavaScript',
                                              style: GoogleFonts.chakraPetch(
                                                  textStyle: textStyles.P1,
                                                  fontSize: kDefaultFontSize,
                                                  fontWeight: FontWeight.bold,
                                                  color: Colors.blueGrey)),
                                          TextSpan(
                                              text: ' and briefly tried ',
                                              style: GoogleFonts.chakraPetch(
                                                  textStyle: textStyles.P1,
                                                  fontSize: kDefaultFontSize)),
                                          TextSpan(
                                              text: 'WordPress',
                                              style: GoogleFonts.chakraPetch(
                                                  textStyle: textStyles.P1,
                                                  fontSize: kDefaultFontSize,
                                                  fontWeight: FontWeight.bold,
                                                  color: Colors.blueGrey)),
                                          TextSpan(
                                              text:
                                                  ', though it didn\'t resonate with me.',
                                              style: GoogleFonts.chakraPetch(
                                                  textStyle: textStyles.P1,
                                                  fontSize: kDefaultFontSize)),
                                        ],
                                      ),
                                    ),
                                    const SizedBox(height: 20),

                                    // Story Section 3 - Python Era
                                    RichText(
                                      text: TextSpan(
                                        style: const TextStyle(
                                            fontSize: 16,
                                            height: 1.5,
                                            color: Colors.white),
                                        children: [
                                          TextSpan(
                                              text:
                                                  'My first real programming love came with ',
                                              style: GoogleFonts.chakraPetch(
                                                  textStyle: textStyles.P1,
                                                  fontSize: kDefaultFontSize)),
                                          TextSpan(
                                              text: 'Python',
                                              style: GoogleFonts.chakraPetch(
                                                  textStyle: textStyles.P1,
                                                  fontSize: kDefaultFontSize,
                                                  fontWeight: FontWeight.bold,
                                                  color: Colors.blueGrey)),
                                          TextSpan(
                                              text:
                                                  '. For several years, I built ',
                                              style: GoogleFonts.chakraPetch(
                                                  textStyle: textStyles.P1,
                                                  fontSize: kDefaultFontSize)),
                                          TextSpan(
                                              text: 'Windows applications',
                                              style: GoogleFonts.chakraPetch(
                                                  textStyle: textStyles.P1,
                                                  fontSize: kDefaultFontSize,
                                                  fontWeight: FontWeight.bold,
                                                  color: Colors.blueGrey)),
                                          TextSpan(
                                              text:
                                                  ' and created sophisticated ',
                                              style: GoogleFonts.chakraPetch(
                                                  textStyle: textStyles.P1,
                                                  fontSize: kDefaultFontSize)),
                                          TextSpan(
                                              text: 'Telegram bots',
                                              style: GoogleFonts.chakraPetch(
                                                  textStyle: textStyles.P1,
                                                  fontSize: kDefaultFontSize,
                                                  fontWeight: FontWeight.bold,
                                                  color: Colors.blueGrey)),
                                          TextSpan(
                                              text:
                                                  '. This was when I truly began seeing myself as a developer, solving real problems through code.',
                                              style: GoogleFonts.chakraPetch(
                                                  textStyle: textStyles.P1,
                                                  fontSize: kDefaultFontSize)),
                                        ],
                                      ),
                                    ),
                                    const SizedBox(height: 20),

                                    // Story Section 4 - Flutter Passion
                                    RichText(
                                      text: TextSpan(
                                        style: const TextStyle(
                                            fontSize: 16,
                                            height: 1.5,
                                            color: Colors.white),
                                        children: [
                                          TextSpan(
                                              text:
                                                  'Today, I\'ve found my true passion in ',
                                              style: GoogleFonts.chakraPetch(
                                                  textStyle: textStyles.P1,
                                                  fontSize: kDefaultFontSize)),
                                          TextSpan(
                                              text: 'Flutter',
                                              style: GoogleFonts.chakraPetch(
                                                  textStyle: textStyles.P1,
                                                  fontSize: kDefaultFontSize,
                                                  fontWeight: FontWeight.bold,
                                                  color: Colors.blueGrey)),
                                          TextSpan(
                                              text:
                                                  '. For the past few years, I\'ve been building beautiful cross-platform applications, including this portfolio and an ',
                                              style: GoogleFonts.chakraPetch(
                                                  textStyle: textStyles.P1,
                                                  fontSize: kDefaultFontSize)),
                                          TextSpan(
                                              text: 'Apple Music clone',
                                              style: GoogleFonts.chakraPetch(
                                                  textStyle: textStyles.P1,
                                                  fontSize: kDefaultFontSize,
                                                  fontWeight: FontWeight.bold,
                                                  color: Colors.blueGrey)),
                                          TextSpan(
                                              text:
                                                  '. The combination of creative UI design and robust functionality makes Flutter development endlessly rewarding.',
                                              style: GoogleFonts.chakraPetch(
                                                  textStyle: textStyles.P1,
                                                  fontSize: kDefaultFontSize)),
                                        ],
                                      ),
                                    ),
                                    const SizedBox(height: 20),

                                    // Story Section 5 - Looking Forward
                                    RichText(
                                      text: TextSpan(
                                        style: const TextStyle(
                                            fontSize: 16,
                                            height: 1.5,
                                            color: Colors.white),
                                        children: [
                                          TextSpan(
                                              text:
                                                  'Looking back from those early struggles with ',
                                              style: GoogleFonts.chakraPetch(
                                                  textStyle: textStyles.P1,
                                                  fontSize: kDefaultFontSize)),
                                          TextSpan(
                                              text: 'C++',
                                              style: GoogleFonts.chakraPetch(
                                                  textStyle: textStyles.P1,
                                                  fontSize: kDefaultFontSize,
                                                  fontWeight: FontWeight.bold,
                                                  color: Colors.blueGrey)),
                                          TextSpan(
                                              text:
                                                  ' to where I am today, every challenge has shaped me as a developer. That ',
                                              style: GoogleFonts.chakraPetch(
                                                  textStyle: textStyles.P1,
                                                  fontSize: kDefaultFontSize)),
                                          TextSpan(
                                              text: '12-year-old',
                                              style: GoogleFonts.chakraPetch(
                                                  textStyle: textStyles.P1,
                                                  fontSize: kDefaultFontSize,
                                                  fontWeight: FontWeight.bold,
                                                  color: Colors.blueGrey)),
                                          TextSpan(
                                              text:
                                                  ' who refused to give up would be proud to see how far we\'ve come. And this is just the beginning - I can\'t wait to see where this journey takes me next.',
                                              style: GoogleFonts.chakraPetch(
                                                  textStyle: textStyles.P1,
                                                  fontSize: kDefaultFontSize)),
                                        ],
                                      ),
                                    ),
                                    const SizedBox(height: 25),
                                  ],
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  Align(
                    alignment: Alignment.topCenter,
                    child: CustomBox(
                      borderRadius: containerStyle.borderRadiusRadup,
                      margin: containerStyle.margin,
                      child: Container(
                        decoration: BoxDecoration(
                          color: const Color.fromARGB(31, 0, 0, 0),
                          borderRadius: containerStyle.borderRadius,
                        ),
                        padding: containerStyle.paddingNew,
                        // margin: containerStyle.margin,
                        width: deviceWidth,
                        height: 60,
                        child: Text(
                          "My Coding Journey",
                          style: GoogleFonts.chakraPetch(
                              textStyle: textStyles.HeadingB),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 100),
          ],
        ),
      ),
    );
  }
}
