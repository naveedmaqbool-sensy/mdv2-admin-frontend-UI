<template>
  <div>
    <CommonHeader title="KPI">
      <template #right-content>
        <UButton
          color="primary"
          class="mr-2"
          size="xs"
          :disabled="kpiRows.length === 0 || kpiColumns.length === 0"
          @click="isOpenConditions = true"
        >
          CSV出力
        </UButton>
        <UButton color="indigo" size="xs" @click="isOpenConditions = true">
          条件指定
        </UButton>
      </template>
    </CommonHeader>

    <UAccordion
      :items="[{ label: '集計条件', defaultOpen: true, slot: 'conditions' }]"
      color="indigo"
    >
      <template #conditions>
        <section class="block">
          <div v-for="(labels, index) in badges" :key="index" class="pb-1">
            <UBadge
              v-for="(label, index2) in labels"
              :key="index2"
              color="gray"
              class="mr-1"
            >
              {{ label }}
            </UBadge>
          </div>
        </section>
      </template>
    </UAccordion>

    <template v-if="kpiRows.length > 0 && kpiColumns.length > 0">
      <UTable :columns="kpiColumns" :rows="kpiRows" />
    </template>

    <ClientOnly>
      <USlideover v-model="isOpenConditions" prevent-close>
        <AggregatesSearchForm
          v-model:form-data="internalFormData"
          @close="isOpenConditions = false"
          @save="save"
          @csv-export="csvExport"
          @cancel="cancel"
        />
      </USlideover>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import AggregateTypes from '~/types/enums/AggregateTypes'
import AggregateUnitTypes from '~/types/enums/AggregateUnitTypes'
import AggregateHorizontalAxisTypes from '~/types/enums/AggregateHorizontalAxisTypes'
import SkuAggregateUnitTypes from '~/types/enums/SkuAggregateUnitTypes'
import StoreAggregateTypes from '~/types/enums/StoreAggregateTypes'
import StoreAggregateUnitTypes from '~/types/enums/StoreAggregateUnitTypes'
import type FormData from '~/types/interfaces/page/kpi/FormData'
import FormDataFactory from '~/types/interfaces/page/kpi/FormDataFactory'

const formData = ref<FormData>(new FormDataFactory())
const internalFormData = ref<FormData>({ ...formData.value })
const isOpenConditions = ref(true)

const badges = computed<string[][]>(() => {
  const results: string[][] = [[]]

  if (formData.value.aggregateType) {
    results[0].push(AggregateTypes.getName(formData.value.aggregateType))
  }
  if (formData.value.aggregateUnitType) {
    results[0].push(
      AggregateUnitTypes.getName(formData.value.aggregateUnitType)
    )
  }
  if (formData.value.storeAggregateUnitType) {
    results[0].push(
      StoreAggregateUnitTypes.getName(formData.value.storeAggregateUnitType)
    )
  }
  if (formData.value.skuAggregateUnitType) {
    results[0].push(
      SkuAggregateUnitTypes.getName(formData.value.skuAggregateUnitType)
    )
  }
  if (formData.value.storeAggregateType) {
    results[0].push(
      StoreAggregateTypes.getName(formData.value.storeAggregateType)
    )
  }
  if (formData.value.aggregateHorizontalAxisType) {
    results[0].push(
      AggregateHorizontalAxisTypes.getName(
        formData.value.aggregateHorizontalAxisType
      )
    )
  }
  if (formData.value.groups.length > 0) {
    results.push(formData.value.groups.map((v) => v.groupName))
  }
  if (formData.value.departments.length > 0) {
    results.push(formData.value.departments.map((v) => v.departmentName))
  }
  if (formData.value.classes.length > 0) {
    results.push(formData.value.classes.map((v) => v.className))
  }
  if (formData.value.lines.length > 0) {
    results.push(formData.value.lines.map((v) => v.lineName))
  }
  if (formData.value.stores.length > 0) {
    results.push(formData.value.stores.map((v) => v.storeName))
  }
  if (formData.value.storeGroups.length > 0) {
    results.push(formData.value.storeGroups.map((v) => v.storeName))
  }
  if (formData.value.targetDateFrom) {
    results[0].push(formatterDate(formData.value.targetDateFrom))
  }
  if (formData.value.targetDateTo) {
    results[0].push(formatterDate(formData.value.targetDateTo))
  }

  return results
})

// FIXME: rfukuma とりあえずモックとして作る
const kpiRows = ref<any[]>([])
const kpiColumns = ref<{ key: string; label: string }[]>([])

async function fetchKpi() {
  serviceLoadingStart()

  kpiRows.value = []
  kpiColumns.value = []

  await new Promise((resolve) => setTimeout(resolve, 2000))

  // FIXME: rfukuma ＫＰＩ分析
  for (let i = 0; i < 9; i++) {
    kpiRows.value.push({
      storeName: `00${i} 〇〇店`,
      '0': '0.1%',
      '1': '0.1%',
      '2': '0.1%',
      '3': '0.1%',
      '4': '0.1%',
      '5': '0.1%',
      '6': '0.1%',
      '7': '0.1%',
    })
  }
  kpiColumns.value.push(
    {
      key: 'storeName',
      label: '店舗',
    },
    {
      key: '0',
      label: '4/1 (月)',
    },
    {
      key: '1',
      label: '4/2 (月)',
    },
    {
      key: '2',
      label: '4/3 (月)',
    },
    {
      key: '3',
      label: '4/4 (月)',
    },
    {
      key: '4',
      label: '4/5 (月)',
    },
    {
      key: '5',
      label: '4/6 (月)',
    },
    {
      key: '6',
      label: '4/7 (月)',
    },
    {
      key: '7',
      label: '4/8 (月)',
    }
  )
  serviceLoadingFinish()
}

async function save() {
  formData.value = { ...internalFormData.value }
  await fetchKpi()
}

function cancel() {
  internalFormData.value = { ...formData.value }
}

function csvExport() {
  alert('csv出力を行います')
}
</script>

<style scoped></style>
