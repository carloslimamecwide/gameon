const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Adiciona suporte para arquivos WASM
config.resolver.assetExts.push("wasm");

module.exports = config;
