import { defineConfig } from 'vite'
import { resolve } from 'path'
import { readdirSync } from 'fs'

// Función para pillar todos los HTML de la carpeta pags
const getPages = () => {
  const pages = {}
  const pagesDir = resolve(__dirname, 'pags')
  
  // Leemos la carpeta y creamos un objeto con las rutas
  readdirSync(pagesDir).forEach(file => {
    if (file.endsWith('.html')) {
      const name = file.replace('.html', '')
      pages[name] = resolve(pagesDir, file)
    }
  })
  return pages
}

export default defineConfig({
  root: './',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'), // Tu home
        ...getPages() // Todas las de la carpeta /pags
      }
    }
  },
  server: {
    watch: {
      // Fuerza a Vite a vigilar la carpeta public o archivos JSON específicos
      usePolling: true, // Útil si estás en entornos virtuales o Docker, si no, puedes quitarlo
      ignored: ['!**/pags/**', '!**/public/**', '!**/*.json']
    }
  },
  plugins: [
    // Este mini-plugin casero fuerza un refresco completo si cambia un JSON
    {
      name: 'watch-json-plugin',
      handleHotUpdate({ file, server }) {
        if (file.endsWith('.json')) {
          console.log(`[json-update] Archivo modificado: ${file}`);
          server.ws.send({
            type: 'full-reload',
            path: '*'
          });
        }}}]
})