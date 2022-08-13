const WebpackPwaManifest = require("webpack-pwa-manifest");

new WebpackPwaManifest({
    name: "Budget-tracker",
    short_name: "Budgeties",
    description: "An app that allows you to view your expenses.",
    start_url: "../public/index.html",
    fingerprints: false,
    inject: false,
    icons: [{
      src: path.resolve("assets/img/icons/icon-512x512.png"),
      sizes: [72,96,128,144,152,192,384,512],
      destination: path.join("assets", "icons")
    }]
  })