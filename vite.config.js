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
  }
})