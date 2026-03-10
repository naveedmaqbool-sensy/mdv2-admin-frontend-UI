// NuxtUI のコンポーネントにあたるクラスの設定を上書きできる
export default defineAppConfig({
  ui: {
    primary: 'indigo',
    gray: 'slate',
    button: {
      rounded: 'rounded-lg',
    },
    input: {
      rounded: 'rounded-lg',
      leading: {
        padding: {
          '2xs': 'ps-12',
          xs: 'ps-13',
          sm: 'ps-16',
          md: 'ps-20',
          lg: 'ps-24',
          xl: 'ps-28',
        },
      },
    },
    select: {
      rounded: 'rounded-lg',
    },
    table: {
      td: {
        padding: 'px-4 py-3', // Increased for breathing room
      },
      th: {
        padding: 'px-4 py-3',
        color: 'text-gray-600',
        font: 'font-semibold',
      },
      divide: 'divide-y divide-gray-100 dark:divide-gray-800',
    },
    card: {
      rounded: 'rounded-2xl',
      shadow: 'shadow-[0px_4px_20px_rgba(0,0,0,0.05)]', // Dashstack airy shadow
      ring: 'ring-0', // Remove borders
      divide: 'divide-none', // Remove inner top borders
      header: {
        padding: 'px-6 pb-5 pt-8',
      },
      body: {
        padding: 'px-6 py-4',
      },
    },
    pagination: {
      base: 'px-5',
      rounded: 'rounded-lg',
      default: {
        prevButton: {
          class: 'px-2',
        },
        nextButton: {
          class: 'px-2',
        },
      },
    },
  },
})
