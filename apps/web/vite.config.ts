import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// @sub-keeper/core 는 workspace 링크 소스(.ts)로 그대로 처리된다.
export default defineConfig({
  plugins: [react()],
});
