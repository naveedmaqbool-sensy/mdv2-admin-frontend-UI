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
  },
})
