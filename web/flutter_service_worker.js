'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"flutter_bootstrap.js": "cd2e32f5027a23c2522894cd3941a491",
"icons/Icon-maskable-192.png": "fc6bf63dccb45b5410869b5693f78d03",
"icons/erfanbanaei.jpg": "148176eb281da4056b1c0f458ae32caa",
"icons/Icon-maskable-512.png": "5ac72052bff66ba876a45d3c674e2898",
"icons/Icon-192.png": "fc6bf63dccb45b5410869b5693f78d03",
"icons/Icon-512.png": "5ac72052bff66ba876a45d3c674e2898",
"flutter.js": "4b2350e14c6650ba82871f60906437ea",
"version.json": "794cd8f217084e028521a40324f16870",
"manifest.json": "567cd0feb550d6490fa0d7c73476a7e3",
"index.html": "057390d2f12483c58ad1fb46e0433ef0",
"/": "057390d2f12483c58ad1fb46e0433ef0",
"assets/NOTICES": "7cbd0056b68ac90ad92b016bffb58e26",
"assets/fonts/MaterialIcons-Regular.otf": "0db35ae7a415370b89e807027510caf0",
"assets/AssetManifest.json": "5a7a800286167b3abc8a2bcf20707c27",
"assets/AssetManifest.bin.json": "85681d9fcc401955aee638f268fd0f4a",
"assets/shaders/ink_sparkle.frag": "ecc85a2e95f5e9f53123dcaf8cb9b6ce",
"assets/assets/fonts/Preahvihear-Regular.ttf": "b728ff1cdead5239b67535d2073baf70",
"assets/assets/fonts/Poppins-SemiBold.ttf": "6f1520d107205975713ba09df778f93f",
"assets/assets/fonts/Poppins-Medium.ttf": "bf59c687bc6d3a70204d3944082c5cc0",
"assets/assets/icons/12.png": "3e4475a34096b7c22855a0c9abc19679",
"assets/assets/icons/15.png": "8b5c87db4da2cc4643b6fc7f79a02dfd",
"assets/assets/icons/4.png": "85c60c9c05fee9cf9c90f7b44611029a",
"assets/assets/icons/11.png": "f7c5dbdeb40217d671026cfcc7cd2dd9",
"assets/assets/icons/1.png": "0710f4d59a0a7ecfc9b994e383ffa417",
"assets/assets/icons/6.png": "0dce7006c8ecce937c7bd13999cb960d",
"assets/assets/icons/7.png": "bc87c63547ee93f5c92efdd2183716e9",
"assets/assets/icons/5.png": "57a38eefe3575d50c997758ee1c7b1a4",
"assets/assets/icons/2.png": "aaa095bebc314c6d161923a1fc9f0c0c",
"assets/assets/icons/13.png": "a67525bc4818de6455b6484153a2c890",
"assets/assets/icons/14.png": "3a3a8e28c743ee55024773084ecc8f8d",
"assets/assets/icons/10.png": "e4d92bddc2bb455640ce808fc523453e",
"assets/assets/icons/8.png": "ac77029390a65a76541e1d5af5ae002c",
"assets/assets/icons/9.png": "dd53d5370144f52eeec226a7013d2cdb",
"assets/assets/icons/3.png": "d762ccb7859371226cc93809608e1c45",
"assets/assets/images/SkillBanner.png": "b1b352e34f29498f3ce9a0a974e56d15",
"assets/assets/images/project1.png": "686d5e0ffd37dc86ffad87e326ecc504",
"assets/assets/images/Gradient.png": "19b9eb86e8d4d89db8767e92175d10ee",
"assets/assets/images/Gradient.svg": "5ca73fac2591b040645c02ecdfce233f",
"assets/assets/images/project2.png": "7784a5d66b39197651db77d313db5174",
"assets/assets/images/Logo.png": "b183e2f19bc6a44bab984006c46e266a",
"assets/assets/images/Me.png": "2b669c658524757f9e64d131d6fca3dd",
"assets/assets/images/project3.png": "d16ac7311cfbd7b5fed5de94ecca2f3a",
"assets/assets/cv.pdf": "649a25a172bdb0ac65f2f28b3be494ca",
"assets/AssetManifest.bin": "6429fbe1baabcf6fe85a347d6b86c4c6",
"assets/FontManifest.json": "70260471d3dabdd8791391316ca28707",
"favicon.png": "33c79348e0738a75b2ef93f1a1881dcc",
"main.dart.js": "09088af7b76aea04d281e62954e01b09",
"canvaskit/canvaskit.js.symbols": "efc2cd87d1ff6c586b7d4c7083063a40",
"canvaskit/skwasm.worker.js": "89990e8c92bcb123999aa81f7e203b1c",
"canvaskit/canvaskit.wasm": "e7602c687313cfac5f495c5eac2fb324",
"canvaskit/canvaskit.js": "26eef3024dbc64886b7f48e1b6fb05cf",
"canvaskit/skwasm.wasm": "828c26a0b1cc8eb1adacbdd0c5e8bcfa",
"canvaskit/skwasm.js.symbols": "96263e00e3c9bd9cd878ead867c04f3c",
"canvaskit/chromium/canvaskit.js.symbols": "e115ddcfad5f5b98a90e389433606502",
"canvaskit/chromium/canvaskit.wasm": "ea5ab288728f7200f398f60089048b48",
"canvaskit/chromium/canvaskit.js": "b7ba6d908089f706772b2007c37e6da4",
"canvaskit/skwasm.js": "ac0f73826b925320a1e9b0d3fd7da61c"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"flutter_bootstrap.js",
"assets/AssetManifest.bin.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
