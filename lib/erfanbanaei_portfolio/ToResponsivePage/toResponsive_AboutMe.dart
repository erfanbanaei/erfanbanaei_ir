import '../../functions/Mouse_Tracker.dart';
import '../../functions/animated_blob.dart';
import '../../functions/navigation_bar.dart';
import '../../erfanbanaei_portfolio/pages/about_page_T_M_D/about_me.dart';

import '../../functions/responsive_layout.dart';
import '../../erfanbanaei_portfolio/pages/about_page_T_M_D/about_me_mobile.dart';
import '../../erfanbanaei_portfolio/pages/about_page_T_M_D/about_me_tablet.dart';
import 'package:flutter/material.dart';

class toResponsiveLayout_AboutMe extends StatelessWidget {
  final int currentIndex;
  const toResponsiveLayout_AboutMe({super.key, this.currentIndex = 2});

  @override
  Widget build(BuildContext context) {
    double screenWidth = MediaQuery.of(context).size.width;

    return Scaffold(
        body: screenWidth >= 600
            ? AnimatedBlobBackground(
                numberOfBlobs: 4,
                gravitationalPull: 1.0,
                baseSpeed: 0.5,
                blobSizeMultiplier: 1,
                orbitRadius: 0.2,
                child: CursorTracker(
                  child: NavigationWrapper(
                    currentIndex: currentIndex,
                    child: const ResponsiveLayout(
                      mobileBody: AboutMeMobile(),
                      tabletBody: AboutMeTablet(),
                      desktopBody: AboutMe(),
                    ),
                  ),
                ),
              )
            : AnimatedBlobBackground(
                numberOfBlobs: 4,
                gravitationalPull: 1.0,
                baseSpeed: 0.5,
                blobSizeMultiplier: 1,
                orbitRadius: 0.2,
                child: NavigationWrapper(
                  currentIndex: currentIndex,
                  child: const ResponsiveLayout(
                    mobileBody: AboutMeMobile(),
                    tabletBody: AboutMeTablet(),
                    desktopBody: AboutMe(),
                  ),
                ),
              ));
  }
}
