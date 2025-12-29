// Reexport the native module. On web, it will be resolved to TimelimitModule.web.ts


// and on native platforms to TimelimitModule.ts
export * from './src/Timelimit.types';
export { default } from './src/TimelimitModule';
export { default as TimelimitView } from './src/TimelimitView';




