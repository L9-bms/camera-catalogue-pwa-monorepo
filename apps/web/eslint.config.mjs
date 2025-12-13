import config from 'config/eslint/next.js'
import typescript from 'config/eslint/typescript.js'

export default typescript(import.meta.dirname, config, {
    ignores: [...config.ignores]
})
