import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        exportType: "default"
      },
      // Only transform SVGs when explicitly requested with ?react
      include: "**/*.svg?react"
    }),
    nodePolyfills({
      globals: {
        process: false
      }
    })
  ],
  envPrefix: "REACT_APP_",
  define: {
    global: "globalThis",
    "process.env": {}
  },
  build: {
    outDir: "build", // CRA's default build output
    commonjsOptions: {
      include: [/uniswap/, /ethers/, /node_modules/]
    }
  },
  optimizeDeps: {
    include: [
      "@uniswap/uniswapx-sdk",
      "@uniswap/permit2-sdk",
      "@uniswap/sdk-core",
      "ethers"
    ]
  },
  resolve: {
    alias: {
      //   '@': path.resolve(__dirname, './src'),
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
      buffer: "buffer"
    },
    extensions: [".js", ".jsx", ".ts", ".tsx", ".json", ".css", ".scss"]
  },
  test: {
    globals: true,
    environment: "jsdom"
    // setupFiles: "./src/setupTests.js"
  }
});
