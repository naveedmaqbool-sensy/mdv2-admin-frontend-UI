<template>
  <div class="flex-1 p-4">
    <UForm :state="{}" class="space-y-3">
      <CommonSelect
        v-model:selected="uiType"
        title="ＵＩタイプ"
        :options="[
          { value: 1, name: 'ラジオ形式' },
          { value: 2, name: 'プルダウン形式' },
        ]"
      />
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
      <UFormGroup label="集計単位">
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
        />
      </UFormGroup>
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
        />
      </UFormGroup>
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
        />
      </UFormGroup>
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
        />
      </UFormGroup>
      <UFormGroup label="横軸">
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
        />
      </UFormGroup>
      <div class="flex items-center space-x-4">
        <UFormGroup label="対象期間 From" class="w-[50%] flex-1">
          <CommonDatepicker v-model="formData.targetDateFrom" />
        </UFormGroup>
        <UFormGroup label="対象期間 To" class="w-[50%] flex-1">
          <CommonDatepicker v-model="formData.targetDateTo" />
        </UFormGroup>
      </div>
      <div class="flex items-center space-x-4">
        <UFormGroup label="部門" class="w-[50%] flex-1">
          <AggregatesSelectObjectModal
            v-model:selected="formData.groups"
            v-model:items="groups"
            :columns="[{ key: 'groupName', label: '部門' }]"
            name-column="groupName"
            @fetch-items="fetchGroups"
          />
        </UFormGroup>
        <UFormGroup label="中分類" class="w-[50%] flex-1">
          <AggregatesSelectObjectModal
            v-model:selected="formData.departments"
            v-model:items="departments"
            :columns="[{ key: 'departmentName', label: '中分類' }]"
            name-column="departmentName"
            @fetch-items="fetchDepartments"
          />
        </UFormGroup>
      </div>
      <div class="flex items-center space-x-4">
        <UFormGroup label="小分類" class="w-[50%] flex-1">
          <AggregatesSelectObjectModal
            v-model:selected="formData.lines"
            v-model:items="lines"
            :columns="[{ key: 'lineName', label: '小分類' }]"
            name-column="lineName"
            @fetch-items="fetchLines"
          />
        </UFormGroup>
        <UFormGroup label="種別" class="w-[50%] flex-1">
          <AggregatesSelectObjectModal
            v-model:selected="formData.classes"
            v-model:items="classes"
            :columns="[{ key: 'className', label: '種別' }]"
            name-column="className"
            @fetch-items="fetchClasses"
          />
        </UFormGroup>
      </div>
      <div class="flex items-center space-x-4">
        <UFormGroup label="店グループ" class="w-[50%] flex-1">
          <AggregatesSelectObjectModal
            v-model:selected="formData.storeGroups"
            v-model:items="storeGroups"
            :columns="[{ key: 'storeName', label: '店舗グループ' }]"
            name-column="storeName"
            @fetch-items="fetchStoreGroups"
          />
        </UFormGroup>
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

const formData = defineModel('formData', {
  type: Object,
  required: true,
})

const uiType = ref(2)
const groups = ref<GroupMaster[]>([])
const departments = ref<DepartmentMaster[]>([])
const lines = ref<LineMaster[]>([])
const classes = ref<ClassMaster[]>([])
const storeGroups = ref<StoreMaster[]>([]) // FIXME: rfukuma 店舗グループの扱いが変わる可能性があるため StoreMaster 参照とする
const stores = ref<StoreMaster[]>([])

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
</script>

<style scoped></style>
