<template>
  <div>
    <CommonHeader title="KPI">
      <template #right-content>
        <UButton color="indigo" size="xs" @click="isOpenConditions = true">
          条件を変更
        </UButton>
      </template>
    </CommonHeader>

    <UAccordion
      :items="[{ label: '集計条件', defaultOpen: true, slot: 'conditions' }]"
      color="indigo"
    >
      <template #conditions>
        <section class="block">
          <div>
            <UBadge
              v-for="label in [
                AggregateTypes.getName(formData.aggregateType),
                AggregateUnitTypes.getName(formData.aggregateUnitType),
                SkuAggregateUnitTypes.getName(formData.skuAggregateUnitType),
                StoreAggregateUnitTypes.getName(
                  formData.storeAggregateUnitType
                ),
                StoreAggregateTypes.getName(formData.storeAggregateType),
                AggregateHorizontalAxisTypes.getName(
                  formData.aggregateHorizontalAxisType
                ),
                formatterDate(formData.targetDateFrom) +
                  '～' +
                  formatterDate(formData.targetDateTo),
              ]"
              :key="label"
              color="gray"
              class="mr-1"
            >
              {{ label }}
            </UBadge>
          </div>
          <div v-if="formData.groups.length > 0" class="pt-1">
            <UBadge
              v-for="group in formData.groups"
              :key="group.groupId"
              color="gray"
              class="mr-1"
            >
              {{ group.groupName }}
            </UBadge>
          </div>
          <div v-if="formData.departments.length > 0" class="pt-1">
            <UBadge
              v-for="department in formData.departments"
              :key="department.departmentId"
              color="gray"
              class="mr-1"
            >
              {{ department.departmentName }}
            </UBadge>
          </div>
          <div v-if="formData.lines.length > 0" class="pt-1">
            <UBadge
              v-for="line in formData.lines"
              :key="line.lineId"
              color="gray"
              class="mr-1"
            >
              {{ line.lineName }}
            </UBadge>
          </div>
          <div v-if="formData.classes.length > 0" class="pt-1">
            <UBadge
              v-for="cls in formData.classes"
              :key="cls.classId"
              color="gray"
              class="mr-1"
            >
              {{ cls.className }}
            </UBadge>
          </div>
          <div v-if="formData.storeGroups.length > 0" class="pt-1">
            <UBadge
              v-for="storeGroup in formData.storeGroups"
              :key="storeGroup.storeName"
              color="gray"
              class="mr-1"
            >
              {{ storeGroup.storeName }}
            </UBadge>
          </div>
          <div v-if="formData.stores.length > 0" class="pt-1">
            <UBadge
              v-for="store in formData.stores"
              :key="store.storeId"
              color="gray"
              class="mr-1"
            >
              {{ store.storeName }}
            </UBadge>
          </div>
        </section>
      </template>
    </UAccordion>

    <template v-if="kpiRows.length > 0 && kpiColumns.length > 0">
      <UTable :columns="kpiColumns" :rows="kpiRows" />
    </template>

    <ClientOnly>
      <USlideover v-model="isOpenConditions">
        <AggregatesSearchForm v-model:form-data="formData" />
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
const isOpenConditions = ref(true)

watch(isOpenConditions, (value) => {
  if (!value) {
    fetchKpi()
  }
})

// FIXME: rfukuma とりあえずモックとして作る
const kpiRows = ref<any[]>([])
const kpiColumns = ref<{ key: string; label: string }[]>([])

async function fetchKpi() {
  serviceLoadingStart()

  await new Promise((resolve) => setTimeout(resolve, 3000))

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
</script>

<style scoped></style>
