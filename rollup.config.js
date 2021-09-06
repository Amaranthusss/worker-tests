import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import copy from 'rollup-plugin-copy';

export default {
  input: 'src/worker/deps.js',
  output: {
    file: 'public/worker/deps.js',
    // name: 'WorkerBundle',
    // dir: 'public/worker',
    // entryFileNames: 'worker-[name].js',
    format: 'iife',
    // globals: {
    //   jspdf: 'jsPDF',
    //   'devextreme/data/array_store': 'ArrayStore'
    // },
    
    // extend: true,
    inlineDynamicImports: true,
  },
  preserveEntrySignatures: false,
  plugins: [
    nodeResolve({ browser: true }),
    commonjs({
      include: /node_modules/
    }),
    copy({
      targets: [{
        src: 'src/worker/core.js',
        dest: 'public/worker/'
      }]
    }),
  ]
};