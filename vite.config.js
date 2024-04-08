import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import path from 'path';

const pathConfig = path.resolve(path.resolve(), 'src')

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: '@', replacement: pathConfig},
    ],
  },
})
