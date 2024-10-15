// NuxtUI のコンポーネントにあたるクラスの設定を上書きできる
export default defineAppConfig({
  ui: {
    input: {
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
    table: {
      td: {
        padding: 'px-1 py-1',
      },
    },
    card: {
      divide: 'divide-y divide-gray-100 dark:divide-gray-800',
      header: {
        padding: 'px-4 pb-5 pt-8',
      },
      body: {
        padding: 'px-4 py-1',
      },
    },
  },
})
