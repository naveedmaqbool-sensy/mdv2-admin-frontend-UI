<template>
  <div class="flex-1 p-4">
    <UDivider :label="`${step}/${totalStep} Step`" />

    <UMeter :value="stepProgress" class="mb-3" />

    <UForm :state="{}" class="space-y-3">
      <!-- <CommonSelect
        v-model:selected="uiType"
        title="ＵＩタイプ"
        :options="[
          { value: 1, name: 'ラジオ形式' },
          { value: 2, name: 'プルダウン形式' },
        ]"
      /> -->
      <UFormGroup label="集計項目">
        <URadioGroup
          v-if="uiType === 1"
          v-model="formData.aggregateType"
          :options="AggregateTypes.getNameValues()"
          option-attribute="name"
        />
        <CommonSelect
          v-else
          v-model:selected="formData.aggregateType"
          :options="AggregateTypes.getNameValues()"
        />
      </UFormGroup>
      <UFormGroup v-if="step > 1" label="集計単位">
        <URadioGroup
          v-if="uiType === 1"
          v-model="formData.aggregateUnitType"
          :options="AggregateUnitTypes.getNameValues()"
          option-attribute="name"
        />
        <CommonSelect
          v-else
          v-model:selected="formData.aggregateUnitType"
          :options="AggregateUnitTypes.getNameValues()"
          @change="onChangedAggregateUnitType"
        />
      </UFormGroup>
      <template v-if="formData.aggregateUnitType === AggregateUnitTypes.Sku">
        <UFormGroup label="商品集計単位">
          <URadioGroup
            v-if="uiType === 1"
            v-model="formData.skuAggregateUnitType"
            :options="SkuAggregateUnitTypes.getNameValues()"
            option-attribute="name"
          />
          <CommonSelect
            v-else
            v-model:selected="formData.skuAggregateUnitType"
            :options="SkuAggregateUnitTypes.getNameValues()"
            @change="onChangedSkuUnitType"
          />
        </UFormGroup>
        <div
          v-if="formData.skuAggregateUnitType !== null"
          class="flex items-center space-x-4"
        >
          <UFormGroup
            v-if="formData.skuAggregateUnitType === SkuAggregateUnitTypes.Sku"
            label="ＳＫＵ"
            class="w-[50%] flex-1"
          >
            <AggregatesSelectObjectModal
              v-model:selected="formData.skus"
              v-model:items="skus"
              :columns="[{ key: 'skuName', label: '商品名' }]"
              name-column="skuName"
              @fetch-items="fetchSkus"
            />
          </UFormGroup>
          <UFormGroup
            v-if="formData.skuAggregateUnitType === SkuAggregateUnitTypes.Group"
            label="部門"
            class="w-[50%] flex-1"
          >
            <AggregatesSelectObjectModal
              v-model:selected="formData.groups"
              v-model:items="groups"
              :columns="[{ key: 'groupName', label: '部門' }]"
              name-column="groupName"
              @fetch-items="fetchGroups"
            />
          </UFormGroup>
          <UFormGroup
            v-if="
              formData.skuAggregateUnitType === SkuAggregateUnitTypes.Department
            "
            label="中分類"
            class="w-[50%] flex-1"
          >
            <AggregatesSelectObjectModal
              v-model:selected="formData.departments"
              v-model:items="departments"
              :columns="[{ key: 'departmentName', label: '中分類' }]"
              name-column="departmentName"
              @fetch-items="fetchDepartments"
            />
          </UFormGroup>
          <UFormGroup
            v-if="formData.skuAggregateUnitType === SkuAggregateUnitTypes.Line"
            label="小分類"
            class="w-[50%] flex-1"
          >
            <AggregatesSelectObjectModal
              v-model:selected="formData.lines"
              v-model:items="lines"
              :columns="[{ key: 'lineName', label: '小分類' }]"
              name-column="lineName"
              @fetch-items="fetchLines"
            />
          </UFormGroup>
          <UFormGroup
            v-if="formData.skuAggregateUnitType === SkuAggregateUnitTypes.Class"
            label="種別"
            class="w-[50%] flex-1"
          >
            <AggregatesSelectObjectModal
              v-model:selected="formData.classes"
              v-model:items="classes"
              :columns="[{ key: 'className', label: '種別' }]"
              name-column="className"
              @fetch-items="fetchClasses"
            />
          </UFormGroup>
        </div>
        <UFormGroup label="集計店舗">
          <URadioGroup
            v-if="uiType === 1"
            v-model="formData.storeAggregateType"
            :options="StoreAggregateTypes.getNameValues()"
            option-attribute="name"
          />
          <CommonSelect
            v-else
            v-model:selected="formData.storeAggregateType"
            :options="StoreAggregateTypes.getNameValues()"
            @change="onChangedstoreAggregateType"
          />
        </UFormGroup>
        <div
          v-if="formData.storeAggregateType === StoreAggregateTypes.Single"
          class="flex items-center space-x-4"
        >
          <UFormGroup label="店舗" class="w-[50%] flex-1">
            <AggregatesSelectObjectModal
              v-model:selected="formData.stores"
              v-model:items="stores"
              :columns="[{ key: 'storeName', label: '店舗' }]"
              name-column="storeName"
              @fetch-items="fetchStores"
            />
          </UFormGroup>
        </div>
      </template>

      <template v-if="formData.aggregateUnitType === AggregateUnitTypes.Store">
        <UFormGroup label="店舗集計単位">
          <URadioGroup
            v-if="uiType === 1"
            v-model="formData.storeAggregateUnitType"
            :options="StoreAggregateUnitTypes.getNameValues()"
            option-attribute="name"
          />
          <CommonSelect
            v-else
            v-model:selected="formData.storeAggregateUnitType"
            :options="StoreAggregateUnitTypes.getNameValues()"
            @change="onChangedStoreAggregateUnitType"
          />
        </UFormGroup>
        <div class="flex items-center space-x-4">
          <UFormGroup
            v-if="
              formData.storeAggregateUnitType === StoreAggregateUnitTypes.Store
            "
            label="店舗"
            class="w-[50%] flex-1"
          >
            <AggregatesSelectObjectModal
              v-model:selected="formData.stores"
              v-model:items="stores"
              :columns="[{ key: 'storeName', label: '店舗' }]"
              name-column="storeName"
              @fetch-items="fetchStores"
            />
          </UFormGroup>
          <UFormGroup
            v-if="
              formData.storeAggregateUnitType === StoreAggregateUnitTypes.Area
            "
            label="店舗グループ"
            class="w-[50%] flex-1"
          >
            <AggregatesSelectObjectModal
              v-model:selected="formData.storeGroups"
              v-model:items="storeGroups"
              :columns="[{ key: 'storeName', label: '店舗グループ' }]"
              name-column="storeName"
              @fetch-items="fetchStoreGroups"
            />
          </UFormGroup>
        </div>
      </template>
      <UFormGroup v-if="step > 4" label="横軸">
        <URadioGroup
          v-if="uiType === 1"
          v-model="formData.aggregateHorizontalAxisType"
          :options="AggregateHorizontalAxisTypes.getNameValues()"
          option-attribute="name"
        />
        <CommonSelect
          v-else
          v-model:selected="formData.aggregateHorizontalAxisType"
          :options="AggregateHorizontalAxisTypes.getNameValues()"
          @change="onChangedAggregateHorizontalAxisType"
        />
      </UFormGroup>
      <div v-if="step > 5" class="flex items-center space-x-4">
        <UFormGroup label="対象期間 From" class="w-[50%] flex-1">
          <CommonDatepicker v-model="formData.targetDateFrom" />
        </UFormGroup>
        <UFormGroup label="対象期間 To" class="w-[50%] flex-1">
          <CommonDatepicker v-model="formData.targetDateTo" />
        </UFormGroup>
      </div>

      <section class="block pt-2">
        <UButton
          block
          color="primary"
          :disabled="step < totalStep"
          @click="onExport"
        >
          CSV出力
        </UButton>
        <UButton
          block
          color="indigo"
          class="mt-2"
          :disabled="step < totalStep"
          @click="onSubmit"
        >
          画面表示
        </UButton>
        <UButton block color="gray" class="mt-2" @click="onCancel">
          キャンセル
        </UButton>
      </section>
    </UForm>
  </div>
</template>

<script setup lang="ts">
import AggregateHorizontalAxisTypes from '~/types/enums/AggregateHorizontalAxisTypes'
import AggregateTypes from '~/types/enums/AggregateTypes'
import AggregateUnitTypes from '~/types/enums/AggregateUnitTypes'
import SkuAggregateUnitTypes from '~/types/enums/SkuAggregateUnitTypes'
import StoreAggregateUnitTypes from '~/types/enums/StoreAggregateUnitTypes'
import StoreAggregateTypes from '~/types/enums/StoreAggregateTypes'
import type ClassMaster from '~/types/interfaces/database/SensyCloud/ClassMaster'
import type DepartmentMaster from '~/types/interfaces/database/SensyCloud/DepartmentMaster'
import type GroupMaster from '~/types/interfaces/database/SensyCloud/GroupMaster'
import type LineMaster from '~/types/interfaces/database/SensyCloud/LineMaster'
import type FormData from '~/types/interfaces/page/kpi/FormData'
import FormDataFactory from '~/types/interfaces/page/kpi/FormDataFactory'

const formData = defineModel<FormData>('formData', {
  type: Object,
  required: true,
})

const emit = defineEmits<{ close: []; csvExport: []; save: []; cancel: [] }>()

const totalStep = 7
const step = computed(() => {
  if (formData.value.aggregateHorizontalAxisType !== null) {
    if (
      formData.value.targetDateFrom !== null &&
      formData.value.targetDateTo !== null
    ) {
      return 7
    }

    return 6
  }
  if (formData.value.aggregateUnitType !== null) {
    switch (formData.value.aggregateUnitType) {
      case AggregateUnitTypes.Sku:
        if (
          formData.value.skuAggregateUnitType !== null &&
          formData.value.storeAggregateType !== null
        ) {
          if (
            formData.value.storeAggregateType === StoreAggregateTypes.All ||
            (formData.value.storeAggregateType === StoreAggregateTypes.Single &&
              formData.value.stores.length > 0)
          ) {
            switch (formData.value.skuAggregateUnitType) {
              case SkuAggregateUnitTypes.Sku:
                if (formData.value.skus.length > 0) return 5
                break
              case SkuAggregateUnitTypes.Group:
                if (formData.value.groups.length > 0) return 5
                break
              case SkuAggregateUnitTypes.Department:
                if (formData.value.departments.length > 0) return 5
                break
              case SkuAggregateUnitTypes.Class:
                if (formData.value.classes.length > 0) return 5
                break
              case SkuAggregateUnitTypes.Line:
                if (formData.value.lines.length > 0) return 5
                break
            }
          }
          return 4
        }
        break
      case AggregateUnitTypes.Store:
        if (formData.value.storeAggregateUnitType !== null) {
          switch (formData.value.storeAggregateUnitType) {
            case StoreAggregateUnitTypes.Store:
              if (formData.value.stores.length > 0) {
                return 5
              }
              break
            case StoreAggregateUnitTypes.Area:
              if (formData.value.storeGroups.length > 0) {
                return 5
              }
              break
          }
          return 4
        }
        break
    }
    return 3
  }
  if (formData.value.aggregateType !== null) {
    return 2
  }
  return 1
})
const stepProgress = computed(() => (step.value / totalStep) * 100)
const uiType = ref(2)
// FIXME: rfukuma 型定義作ったら適用
const skus = ref<any[]>([])
const groups = ref<GroupMaster[]>([])
const departments = ref<DepartmentMaster[]>([])
const lines = ref<LineMaster[]>([])
const classes = ref<ClassMaster[]>([])
const storeGroups = ref<StoreMaster[]>([]) // FIXME: rfukuma 店舗グループの扱いが変わる可能性があるため StoreMaster 参照とする
const stores = ref<StoreMaster[]>([])

async function fetchSkus(searchRequest: {
  text: string | null
  page: number
  perPage: number
}) {
  serviceLoadingStart()
  const response = await apiSkuMasterFetch(searchRequest)
  skus.value = response ? response.data : []
  serviceLoadingFinish()
}

async function fetchGroups(searchRequest: {
  text: string | null
  page: number
  perPage: number
}) {
  serviceLoadingStart()
  const response = await apiGroupMasterFetch(searchRequest)
  groups.value = response ? response.data : []
  serviceLoadingFinish()
}

async function fetchDepartments(searchRequest: {
  text: string | null
  page: number
  perPage: number
}) {
  serviceLoadingStart()
  const response = await apiDepartmentMasterFetch(searchRequest)
  departments.value = response ? response.data : []
  serviceLoadingFinish()
}

async function fetchLines(searchRequest: {
  text: string | null
  page: number
  perPage: number
}) {
  serviceLoadingStart()
  const response = await apiLineMasterFetch(searchRequest)
  lines.value = response ? response.data : []
  serviceLoadingFinish()
}

async function fetchClasses(searchRequest: {
  text: string | null
  page: number
  perPage: number
}) {
  serviceLoadingStart()
  const response = await apiClassMasterFetch(searchRequest)
  classes.value = response ? response.data : []
  serviceLoadingFinish()
}

async function fetchStores(searchRequest: {
  text: string | null
  page: number
  perPage: number
}) {
  serviceLoadingStart()
  const response = await apiStoreMasterFetch(searchRequest)
  stores.value = response ? response.data : []
  serviceLoadingFinish()
}

async function fetchStoreGroups(searchRequest: {
  text: string | null
  page: number
  perPage: number
}) {
  serviceLoadingStart()
  // FIXME: rfukuma 店舗グループの扱いが変わる可能性があるため StoreMaster 参照とする
  const response = await apiStoreMasterFetch(searchRequest)
  storeGroups.value = response ? response.data : []
  serviceLoadingFinish()
}

function onChangedAggregateUnitType() {
  const factory = new FormDataFactory()
  formData.value = {
    ...factory,
    aggregateType: formData.value.aggregateType,
    aggregateUnitType: formData.value.aggregateUnitType,
  }
}

function onChangedSkuUnitType() {
  const factory = new FormDataFactory()
  formData.value = {
    ...factory,
    aggregateType: formData.value.aggregateType,
    aggregateUnitType: formData.value.aggregateUnitType,
    skuAggregateUnitType: formData.value.skuAggregateUnitType,
    storeAggregateType: formData.value.storeAggregateType,
    stores: formData.value.stores,
    storeGroups: formData.value.storeGroups,
  }
}

function onChangedStoreAggregateUnitType() {
  const factory = new FormDataFactory()
  formData.value = {
    ...factory,
    aggregateType: formData.value.aggregateType,
    aggregateUnitType: formData.value.aggregateUnitType,
    storeAggregateUnitType: formData.value.storeAggregateUnitType,
  }
}

function onChangedstoreAggregateType() {
  const factory = new FormDataFactory()
  formData.value = {
    ...factory,
    aggregateType: formData.value.aggregateType,
    aggregateUnitType: formData.value.aggregateUnitType,
    skuAggregateUnitType: formData.value.skuAggregateUnitType,
    skus: formData.value.skus,
    groups: formData.value.groups,
    departments: formData.value.departments,
    lines: formData.value.lines,
    classes: formData.value.classes,
    storeAggregateType: formData.value.storeAggregateType,
  }
}

function onChangedAggregateHorizontalAxisType() {
  const factory = new FormDataFactory()
  formData.value = {
    ...factory,
    aggregateType: formData.value.aggregateType,
    aggregateUnitType: formData.value.aggregateUnitType,
    skuAggregateUnitType: formData.value.skuAggregateUnitType,
    storeAggregateType: formData.value.storeAggregateType,
    storeAggregateUnitType: formData.value.storeAggregateUnitType,
    stores: formData.value.stores,
    storeGroups: formData.value.storeGroups,
    skus: formData.value.skus,
    groups: formData.value.groups,
    departments: formData.value.departments,
    lines: formData.value.lines,
    classes: formData.value.classes,
    aggregateHorizontalAxisType: formData.value.aggregateHorizontalAxisType,
  }
}

function onCancel() {
  emit('close')
  emit('cancel')
}

function onSubmit() {
  emit('save')
  emit('close')
}

function onExport() {
  emit('csvExport')
}
</script>

<style scoped></style>
