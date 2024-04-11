<template>
  <div>
    <CommonHeader title="集計画面" />

    <CommonRoundedContainer>
      <template #header>
        <div class="flex w-full">
          <h2 class="flex-1 justify-start font-bold">集計条件</h2>
          <div class="jsutify-end flex-1 text-right">
            <UButton color="indigo" size="xs" @click="isOpenConditions = true">
              条件を変更
            </UButton>
          </div>
        </div>
      </template>
      <template #content>
        <section class="block">
          <p>
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
          </p>
          <p v-if="formData.groups.length > 0">
            <UBadge
              v-for="group in formData.groups"
              :key="group.groupId"
              color="gray"
              class="mr-2"
            >
              {{ group.groupName }}
            </UBadge>
          </p>
          <p v-if="formData.departments.length > 0">
            <UBadge
              v-for="department in formData.departments"
              :key="department.departmentId"
              color="gray"
              class="mr-2"
            >
              {{ department.departmentName }}
            </UBadge>
          </p>
          <p v-if="formData.lines.length > 0">
            <UBadge
              v-for="line in formData.lines"
              :key="line.lineId"
              color="gray"
              class="mr-2"
            >
              {{ line.lineName }}
            </UBadge>
          </p>
          <p v-if="formData.classes.length > 0">
            <UBadge
              v-for="cls in formData.classes"
              :key="cls.classId"
              color="gray"
              class="mr-2"
            >
              {{ cls.className }}
            </UBadge>
          </p>
          <p v-if="formData.storeGroups.length > 0">
            <UBadge
              v-for="storeGroup in formData.storeGroups"
              :key="storeGroup.storeName"
              color="gray"
              class="mr-2"
            >
              {{ storeGroup.storeName }}
            </UBadge>
          </p>
          <p v-if="formData.stores.length > 0">
            <UBadge
              v-for="store in formData.stores"
              :key="store.storeId"
              color="gray"
              class="mr-2"
            >
              {{ store.storeName }}
            </UBadge>
          </p>
        </section>
      </template>
    </CommonRoundedContainer>

    <img src="/img/mock/aggregates.jpg" />

    <ClientOnly>
      <USlideover v-model="isOpenConditions">
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
                  :items="groups"
                  :columns="[{ key: 'groupName', label: '部門' }]"
                  name-column="groupName"
                  @fetch-items="fetchGroups"
                />
              </UFormGroup>
              <UFormGroup label="中分類" class="w-[50%] flex-1">
                <AggregatesSelectObjectModal
                  v-model:selected="formData.departments"
                  :items="departments"
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
                  :items="lines"
                  :columns="[{ key: 'lineName', label: '小分類' }]"
                  name-column="lineName"
                  @fetch-items="fetchLines"
                />
              </UFormGroup>
              <UFormGroup label="種別" class="w-[50%] flex-1">
                <AggregatesSelectObjectModal
                  v-model:selected="formData.classes"
                  :items="classes"
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
                  :items="storeGroups"
                  :columns="[{ key: 'storeName', label: '店舗グループ' }]"
                  name-column="storeName"
                  @fetch-items="fetchStoreGroups"
                />
              </UFormGroup>
              <UFormGroup label="店舗" class="w-[50%] flex-1">
                <AggregatesSelectObjectModal
                  v-model:selected="formData.stores"
                  :items="stores"
                  :columns="[{ key: 'storeName', label: '店舗' }]"
                  name-column="storeName"
                  @fetch-items="fetchStores"
                />
              </UFormGroup>
            </div>
          </UForm>
        </div>
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
import type GroupMaster from '~/types/interfaces/SensyCloud/GroupMaster'
import type DepartmentMaster from '~/types/interfaces/SensyCloud/DepartmentMaster'
import type LineMaster from '~/types/interfaces/SensyCloud/LineMaster'
import type ClassMaster from '~/types/interfaces/SensyCloud/ClassMaster'

const uiType = ref(2)
const groups = ref<GroupMaster[]>([
  {
    groupId: '1',
    groupName: '部門1',
  },
  {
    groupId: '2',
    groupName: '部門2',
  },
  {
    groupId: '3',
    groupName: '部門3',
  },
])
const departments = ref<DepartmentMaster[]>([
  {
    departmentId: '1',
    departmentName: '中分類1',
    groupId: '1',
  },
  {
    departmentId: '2',
    departmentName: '中分類2',
    groupId: '2',
  },
  {
    departmentId: '3',
    departmentName: '中分類3',
    groupId: '3',
  },
])
const lines = ref<LineMaster[]>([
  {
    lineId: '1',
    lineName: '小分類1',
    departmentId: '1',
    groupId: '1',
  },
  {
    lineId: '2',
    lineName: '小分類2',
    departmentId: '2',
    groupId: '2',
  },
  {
    lineId: '3',
    lineName: '小分類3',
    departmentId: '3',
    groupId: '3',
  },
])
const classes = ref<ClassMaster[]>([
  {
    classId: '1',
    className: '種別1',
    departmentId: '1',
    groupId: '1',
    lineId: '1',
  },
  {
    classId: '2',
    className: '種別2',
    departmentId: '2',
    groupId: '2',
    lineId: '2',
  },
  {
    classId: '3',
    className: '種別3',
    departmentId: '3',
    groupId: '3',
    lineId: '3',
  },
])
const stores = ref<StoreMaster[]>([
  {
    storeId: '1',
    storeName: '店舗1',
    zipCode: '100-0001',
    openHour: '10:00',
    closeHour: '20:00',
  },
  {
    storeId: '2',
    storeName: '店舗2',
    zipCode: '100-0001',
    openHour: '10:00',
    closeHour: '20:00',
  },
  {
    storeId: '3',
    storeName: '店舗3',
    zipCode: '100-0002',
    openHour: '8:00',
    closeHour: '18:00',
  },
])
const storeGroups = ref([...stores.value])

const isOpenConditions = ref(true)
const formData = ref<{
  aggregateType: AggregateTypes
  aggregateUnitType: AggregateUnitTypes
  aggregateHorizontalAxisType: AggregateHorizontalAxisTypes
  skuAggregateUnitType: SkuAggregateUnitTypes
  storeAggregateType: StoreAggregateTypes
  storeAggregateUnitType: StoreAggregateUnitTypes
  targetDateFrom: Date
  targetDateTo: Date
  groups: GroupMaster[]
  departments: DepartmentMaster[]
  lines: LineMaster[]
  classes: ClassMaster[]
  storeGroups: StoreMaster[]
  stores: StoreMaster[]
}>({
  aggregateType: AggregateTypes.OrderPty,
  aggregateUnitType: AggregateUnitTypes.Sku,
  aggregateHorizontalAxisType: AggregateHorizontalAxisTypes.Daily,
  skuAggregateUnitType: SkuAggregateUnitTypes.Sku,
  storeAggregateType: StoreAggregateTypes.All,
  storeAggregateUnitType: StoreAggregateUnitTypes.Store,
  targetDateFrom: new Date(),
  targetDateTo: new Date(),
  groups: [],
  departments: [],
  lines: [],
  classes: [],
  storeGroups: [],
  stores: [],
})

watch(isOpenConditions, (value) => {
  if (!value) {
    serviceLoadingStart()
    // FIXME: rfukuma 集計開始
    serviceLoadingFinish()
  }
})

function fetchGroups(_searchRequest: { text: string | null; page: number }) {
  serviceLoadingStart()
  // FIXME: rfukuma 部門の検索
  serviceLoadingFinish()
}

function fetchDepartments(_searchRequest: {
  text: string | null
  page: number
}) {
  serviceLoadingStart()
  // FIXME: rfukuma 中分類の検索
  serviceLoadingFinish()
}

function fetchLines(_searchRequest: { text: string | null; page: number }) {
  serviceLoadingStart()
  // FIXME: rfukuma 小分類の検索
  serviceLoadingFinish()
}

function fetchClasses(_searchRequest: { text: string | null; page: number }) {
  serviceLoadingStart()
  // FIXME: rfukuma 種別の検索
  serviceLoadingFinish()
}

function fetchStores(_searchRequest: { text: string | null; page: number }) {
  serviceLoadingStart()
  // FIXME: rfukuma 店舗の検索
  serviceLoadingFinish()
}

function fetchStoreGroups(_searchRequest: {
  text: string | null
  page: number
}) {
  serviceLoadingStart()
  // FIXME: rfukuma 店舗グループの検索
  serviceLoadingFinish()
}
</script>

<style scoped></style>
