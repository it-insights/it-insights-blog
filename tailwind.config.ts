import type { Config } from 'tailwindcss'
import plugin from 'tailwindcss/plugin'

export default <Partial<Config>>{
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        custom: ['Roboto'],
      },
    },
  },
  plugins: [
    plugin(({ addVariant, addUtilities }) => {
      addVariant('popover-open', '&:popover-open')
      addVariant('starting', '@starting-style')
      addUtilities({
        '.transition-discrete': {
          transitionBehavior: 'allow-discrete',
        },
      })
    }),
  ],
}
