const path = require('path');

const config = {
  app: {
    port: 8000,
  },
  browserSync: {
    port: 8080,
  },
  favicon: path.resolve(__dirname, './../dist/images/favicon.ico'),
  copy: {
    html: {
      src: './src/html/index.html',
      dest: './dist/index.html',
    },
    images: {
      src: './src/images',
      dest: './dist/images',
    },
    textures: {
      src: './src/textures',
      dest: './dist/textures',
    },
    models: {
      src: './src/models',
      dest: './dist/models',
    },
    animations: {
      src: './src/animations',
      dest: './dist/animations',
    },
    bmfonts: {
      src: './src/bmfonts',
      dest: './dist/bmfonts',
    },
    libs: {
      src: './src/libs',
      dest: './dist/libs',
    },
  },
  fileUpload: {
    port: 8888,
  },
  // input sockets
  kinectTransport: {
    enabled: false,
    ports: {
      incoming: 3000,
      outgoing: 9999,
    },
  },
  perceptionNeuron: {
    enabled: false,
    ip: '192.168.1.250', // ip the Axis Neuron translation app is broadcasting from
    ports: {
      incoming: 9000, // port the Axis Neuron translation app is broadcasting on
      outgoing: 9100, // port the browser connects on
    },
  },
  gamepads: {
    enabled: false,
    ports: {
      outgoing: 9101, // port the browser connects on
    },
  },
  midiController: {
    enabled: false,
    ports: {
      outgoing: 9301, // port the browser connects on
    },
  },
  oscController: {
    enabled: false,
    ports: {
      incoming: 9400,
      outgoing: 9401, // port the browser connects on
    },
  },
  poseNet: {
    enabled: false,
    ports: {
      incoming: 9500,
      outgoing: 9501, // port the browser connects on
    },
  },
  iPhoneX: {
    enabled: false,
    ports: {
      incoming: 9600,
      outgoing: 9601, // port the browser connects on
    },
  },
  kinectron: {
    enabled: true,
    ports: {
      incoming: 9700,
    },
  },
};

module.exports = config;
