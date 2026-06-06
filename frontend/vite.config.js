import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/') || id.includes('node_modules/react-router')) return 'vendor-react';
          if (id.includes('node_modules/@mui/') || id.includes('node_modules/@emotion/')) return 'vendor-mui';
          if (id.includes('node_modules/@reduxjs/') || id.includes('node_modules/react-redux')) return 'vendor-state';
          if (id.includes('node_modules/recharts')) return 'vendor-charts';
          if (id.includes('node_modules/axios') || id.includes('node_modules/formik') || id.includes('node_modules/yup') || id.includes('node_modules/react-hot-toast') || id.includes('node_modules/lucide-react')) return 'vendor-utils';
        },
      },
    },
  },
})
