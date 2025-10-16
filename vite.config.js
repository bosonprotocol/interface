import legacy from "@vitejs/plugin-legacy";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import svgr from "vite-plugin-svgr";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    react(),
    svgr({
      svgrOptions: {
        exportType: "default"
      },
      // Only transform SVGs when explicitly requested with ?react
      include: "**/*.svg?react"
    }),
    nodePolyfills({
      exclude: [
        // "@xmtp/wasm-bindings",
        // "@xmtp/browser-sdk",
        // "@xmtp/node-sdk",
        // "@xmtp/content-type-group-updated",
        // "@xmtp/content-type-primitive",
        // "@xmtp/proto",
        // "@bosonprotocol/chat-sdk",
        // "protobufjs"
      ],
      globals: {
        Buffer: true,
        global: true,
        process: false
      },
      protocolImports: true
    }),
    legacy({
      targets: ["defaults", "not dead"],
      modernPolyfills: true
    })
  ],
  envPrefix: "REACT_APP_",
  define: {
    global: "globalThis",
    globalThis: "globalThis",
    "process.env": {},
    "import.meta.url": "import.meta.url" // required for xmtp
  },
  build: {
    outDir: "build", // CRA's default build output
    commonjsOptions: {
      include: [/uniswap/, /ethers/, /node_modules/]
      // include: [/uniswap/, /ethers/]
    }
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: "globalThis",
        globalThis: "globalThis"
      }
    },
    include: [
      "@uniswap/uniswapx-sdk",
      "@uniswap/permit2-sdk",
      "@uniswap/sdk-core",
      "ethers",
      "@xmtp/proto",
      "protobufjs"
    ],
    exclude: [
      "@xmtp/wasm-bindings",
      "@xmtp/browser-sdk"
      // "protobufjs"
      // "@xmtp/node-sdk",
      // "@xmtp/proto"
      // "@bosonprotocol/chat-sdk"
    ]
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      lib: path.resolve(__dirname, "./src/lib"),
      components: path.resolve(__dirname, "./src/components"),
      state: path.resolve(__dirname, "./src/state"),
      assets: path.resolve(__dirname, "./src/assets"),
      abis: path.resolve(__dirname, "./src/abis"),
      theme: path.resolve(__dirname, "./src/theme"),
      pages: path.resolve(__dirname, "./src/pages"),
      queryClient: path.resolve(__dirname, "./src/queryClient"),
      graphqlData: path.resolve(__dirname, "./src/graphqlData"),
      router: path.resolve(__dirname, "./src/router"),
      //   'components': path.resolve(__dirname, './src/components'),
      //   'utils': path.resolve(__dirname, './src/utils'),
      "@uniswap/uniswapx-sdk": "@uniswap/uniswapx-sdk/dist/src/index.js",
      buffer: "buffer",
      "import.meta.url": "import.meta.url",
      global: "globalThis",
      globalThis: "globalThis"
    },
    extensions: [".js", ".jsx", ".ts", ".tsx", ".json", ".css", ".scss"]
  },
  test: {
    globals: true,
    environment: "jsdom"
    // setupFiles: "./src/setupTests.js"
  }
});
