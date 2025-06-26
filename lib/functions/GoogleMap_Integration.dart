import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:flutter_map_cancellable_tile_provider/flutter_map_cancellable_tile_provider.dart';
import 'package:latlong2/latlong.dart';

class RandomLocationMap extends StatefulWidget {
  const RandomLocationMap({super.key});

  @override
  _RandomLocationMapState createState() => _RandomLocationMapState();
}

class _RandomLocationMapState extends State<RandomLocationMap> {
  LatLng location = const LatLng(33.1300226, 55.7060712);

  @override
  Widget build(BuildContext context) {
    return FlutterMap(
      options: MapOptions(
        initialCenter: location,
        initialZoom: 4,
        interactionOptions: const InteractionOptions(
          flags: InteractiveFlag.all,
        ),
      ),
      children: [
        TileLayer(
          tileProvider: CancellableNetworkTileProvider(),
          urlTemplate:
              'https://api.maptiler.com/tiles/satellite-v2/{z}/{x}/{y}.jpg?key=UHf6eCueJICmBplxaRPq',
        ),
        MarkerLayer(
          markers: [
            Marker(
              point: location,
              width: 200,
              height: 200,
              child: Image.asset(
                'assets/i.png',
                width: 200,
                height: 200,
              ),
            ),
          ],
        ),
      ],
    );
  }
}
