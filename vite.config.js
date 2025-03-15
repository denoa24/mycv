import { defineConfig } from 'vite'
import legacy from '@vitejs/plugin-legacy'
import { createHtmlPlugin } from 'vite-plugin-html'
import viteCopy from 'vite-plugin-copy'
import path from 'path'
import fs from 'fs'

export default defineConfig({
    plugins: [
        legacy({
            targets: ['defaults', 'not IE 11']
        }),
        createHtmlPlugin({
            inject: {
                data: {
                    favicon: 'src/images/favicon.ico',
                    myHeader: fs.readFileSync('src/views/header.html', 'utf-8'),
                    myBanner: fs.readFileSync('src/views/banner.html', 'utf-8'),
                    myFooter: fs.readFileSync('src/views/footer.html', 'utf-8')
                }
            }
        }),
        viteCopy({
            targets: [
                { src: 'src/images/*', dest: 'dist/images' }
            ]
        })
    ],
    build: {
        outDir: 'dist',
        rollupOptions: {
            input: 'src/index.html',
            output: {
                entryFileNames: 'js/[name].bundle.js',
                assetFileNames: 'assets/[name].[hash][extname]',
                chunkFileNames: 'js/[name].bundle.js'
            }
        }
    },
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: `@import "src/styles/variables.scss";`
            }
        }
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src')
        }
    }
})