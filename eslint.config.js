import antfu from '@antfu/eslint-config'
import pluginTailwindCss from 'eslint-plugin-tailwindcss'

export default antfu(
  {
    unocss: false,
    vue: true,
    typescript: true,
    markdown: true,
    rules: {
      'no-undef': 'off',
      'operator-linebreak': 'off',
      'linebreak-style': ['error', 'unix'],
      'eol-last': ['error', 'always'],
      'node/prefer-global/process': 'off',
      'style/member-delimiter-style': [
        'error',
        {
          multiline: {
            delimiter: 'none',
            requireLast: false,
          },
          singleline: {
            delimiter: 'semi',
            requireLast: false,
          },
        },
      ],
    },
    languageOptions: {
      parserOptions: {
        warnOnUnsupportedTypeScriptVersion: false,
      },
    },
    formatters: {
      markdown: 'dprint',
    },
  },
  {
    files: ['**/*.vue'],
    plugins: { tailwindcss: pluginTailwindCss },
    rules: pluginTailwindCss.configs.recommended.rules,
    settings: {
      tailwindcss: {
        config: 'tailwind.config.ts',
        whitelist: [],
      },
    },
  },
)
