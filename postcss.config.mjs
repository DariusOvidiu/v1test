// postcss.config.mjs
import 'ts-node/register'    // ← add this first
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'

export default {
  plugins: {
    // No need to pass `config:`—PostCSS will load your .ts by default now
    tailwindcss: {},
    autoprefixer: {},
  },
}
