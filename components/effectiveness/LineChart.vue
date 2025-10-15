<template>
  <section class="w-full overflow-y-hidden overflow-x-scroll pb-5">
    <Chart
      :size="{
        width: graphWidth,
        height: height,
      }"
      :data="charts"
      :margin="{
        top: 1,
        right: 1,
        bottom: 1,
        left: 1,
      }"
      direction="horizontal"
      :axis="{
        primary: {
          type: 'band',
          ticks: 100,
          domain: ['dataMin', 'dataMax'],
        },
        secondary: {
          type: 'linear',
          ticks: 100,
          domain: ['dataMin', 'dataMax + ' + addDataMaxAmount],
        },
      }"
      @vue:mounted="mountedLineChart"
    >
      <template #layers>
        <Grid stroke-dasharray="1,1" />
        <Line
          v-for="(category, categoryIndex) in ignoreOrderingMethodCategories"
          :data-keys="['日付', category.name]"
          :line-style="{
            stroke: colors[categoryIndex],
          }"
        />
      </template>

      <template #widgets>
        <Tooltip :config="tooltipConfigs" color="black" />
      </template>
    </Chart>
  </section>
  <div class="m-auto mt-5 text-center">
    <template
      v-for="(category, categoryIndex) in ignoreOrderingMethodCategories"
    >
      <span
        class="inline-block min-w-12 py-1"
        :style="{
          'background-color': colors[categoryIndex],
        }"
      />
      <span class="pr-5">{{ category.name }}</span>
    </template>
  </div>
</template>

<script setup lang="ts">
import { Chart, Line, Grid, Tooltip } from 'vue3-charts'
import OrderingMethodTypes from '~/types/enums/OrderingMethodTypes'

const graphWidth = ref(0)

// 棒の色の定義
const colors = ref([
  '#2196F3',
  '#4CAF50',
  '#FF9800',
  '#9C27B0',
  '#607D8B',
  '#48CAE4',
  '#FFC107',
  '#8E24AA',
  '#E74C3C',
  '#64B5F6',
])

const { categories, height } = defineProps<{
  categories: {
    name: string
    values: { row: string; amount: number }[]
  }[]
  height: number
}>()

// vue3-charts が理解できる形に変換する
const charts = computed(() => {
  if (categories.length === 0) return []
  const results: { [name: string]: string | number }[] =
    categories[0].values.map((v) => {
      return {
        日付: v.row,
      }
    })

  categories.forEach((category) => {
    results.forEach((result) => {
      const value = category.values.find((v) => v.row === result.日付)
      if (category.name === '発注方式') {
        result[category.name] =
          value && value.amount
            ? OrderingMethodTypes.getName(value.amount)
            : '未発注'
      } else {
        result[category.name] = value ? value.amount : 0
      }
    })
  })

  return results
})

// ツールチップが認識できる形に修正する
const tooltipConfigs = computed(() => {
  const result: { [name: string]: { color?: string; hide?: boolean } } = {}

  if (charts.value.length === 0) {
    return result
  }

  ignoreOrderingMethodCategories.value.forEach((category, i) => {
    result[category.name] = { color: colors.value[i] }
  })

  return result
})

// 最大桁数が 10,000 の場合は 11,000 をグラフの最大値として加算する（見切れ対策）
const addDataMaxAmount = computed(() => {
  // 最大値計算
  const maxAmount = categories
    .map((v) => v.values.map((v) => v.amount))
    .flat()
    .sort((a, b) => b - a)[0]
  if (maxAmount === 0) return 10

  const maxAmountLength = parseInt(maxAmount.toString()).toString().length
  if (maxAmountLength <= 2) return 10

  return Math.pow(15, maxAmountLength - 2)
})

function mountedLineChart(chart: any) {
  nextTick(() => {
    const element = chart.el as HTMLElement
    if (!element) {
      return
    }

    const lineChartElement = element.parentElement
    const parentWidth = lineChartElement?.getBoundingClientRect().width
    const width = 15 * categories[0]?.values.length
    graphWidth.value =
      parentWidth && Number(parentWidth) > width ? parentWidth : width

    // 発注方式の表示
    const axisX = element
      .getElementsByClassName('axis')[0]
      ?.getElementsByClassName('layer-axis-x')[0] as HTMLElement

    if (axisX) {
      const orderingMethodValues =
        categories.find((v) => v.name === '発注方式')?.values ?? []

      let index = 0
      for (const element of axisX.children) {
        if (element.tagName !== 'g') continue
        for (const textElement of element.getElementsByTagName('text')) {
          textElement.setAttribute(
            'fill',
            orderingMethodValues[index].amount
              ? OrderingMethodTypes.getGraphColor(
                  orderingMethodValues[index].amount
                )
              : 'red'
          )
        }
        ++index
      }
    }

    nextTick(() => {
      // 特定のカテゴリの数値を取得する
      const stockValues =
        categories.find((v) => v.name === '在庫数')?.values ?? []
      if (stockValues.length === 0) {
        return
      }

      // 縦軸を構成する DOM の取得
      const yGrids = element
        .getElementsByClassName('layers')[0]
        ?.getElementsByClassName('layer-grid')[0]
        ?.getElementsByClassName('grid-y')[0]?.children
      if (stockValues.length !== yGrids.length) {
        return
      }

      // grid のセルの幅を取得する
      const xGridWidth =
        yGrids.length > 2
          ? yGrids[1].getBoundingClientRect().x -
            yGrids[0].getBoundingClientRect().x
          : 1

      // 0になっている箇所の grid を調整して背景色をつけているように見せる
      stockValues.forEach((v, index) => {
        if (v.amount === 0) {
          const yGrid = yGrids[index] as HTMLElement
          yGrid.style.stroke = '#ff2222'
          yGrid.style.strokeWidth = xGridWidth.toString()
          yGrid.style.strokeOpacity = '0.2'
          yGrid.style.strokeDasharray = 'none'
        }
      })

      // スクロール固定
      const axisY = element
        .getElementsByClassName('axis')[0]
        ?.getElementsByClassName('layer-axis-y')[0] as HTMLElement
      if (axisY) {
        const rect = document.createElementNS(
          'http://www.w3.org/2000/svg',
          'rect'
        )

        const width = axisY.getBoundingClientRect().width

        // 左辺固定用の矩形を追加する
        rect.setAttribute('width', width + 'px')
        rect.setAttribute('height', '100%')
        rect.setAttribute('transform', `translate(-${width}, 0)`)
        rect.setAttribute('fill', 'white')
        rect.style.zIndex = '-1'
        axisY.insertBefore(rect, axisY.firstChild)

        // スクロールイベントを追加して、横軸が移動した際に左辺の座標を固定
        // HACK: rfukuma svg タグ内で position sticky が使えないので js で固定
        const svg = element.getElementsByTagName('svg')[0]
        element.parentElement?.addEventListener('scroll', (e) => {
          const target = e.target as HTMLElement
          let pt = svg.createSVGPoint()
          pt.x = target.scrollLeft
          pt.y = 0
          pt = pt.matrixTransform(svg.getCTM()!.inverse())
          axisY.setAttribute(
            'transform',
            `translate(${pt.x + Number(width)}, ${pt.y})`
          )
        })
      }
    })
  })
}

const ignoreOrderingMethodCategories = computed(() => {
  return categories.filter((v) => v.name !== '発注方式')
})
</script>

<style scoped>
:deep .layer-axis-x {
  text {
    text-align: right;
    transform: rotate(-80deg) translateX(-35px) translateY(-5px);
  }
}
</style>
