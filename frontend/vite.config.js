/**
 * Vite configuration for the Shipay frontend application.
 * 
 * Configures the build tool with:
 * - React plugin for JSX support
 * - Development server settings
 * - Build optimization settings
 */

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite configuration for React development and production builds
export default defineConfig({
  plugins: [react()],
})
