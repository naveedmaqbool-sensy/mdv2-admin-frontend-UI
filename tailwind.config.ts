// tailwindcss のクラスのデフォルトの挙動を修正できる
import type { Config } from 'tailwindcss'

const spaces = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 16, 20, 24, 28, 32, 36, 40, 44,
  48, 52, 56, 60, 64, 72, 80, 96, 0.5, 1.5, 2.5, 3.5,
]
const spacing: { [key: string]: string } = {}
spaces.forEach((space) => {
  spacing[space] = space * 0.1 + 'rem'
})

export default <Partial<Config>>{
  theme: {
    extend: {
      // 余白系を極力小さく
      padding: spacing,
      margin: spacing,
      colors: {
        'dashstack-bg': '#F5F6FA',
        'dashstack-blue': '#4880FF',
        'dashstack-success': '#00B69B',
        'dashstack-danger': '#F93C65',
        'dashstack-warning': '#FFB74D',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
