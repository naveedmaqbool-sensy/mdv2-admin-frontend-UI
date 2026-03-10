<template>
  <div>
    <CommonHeader title="閾値設定" />

    <UCard
      :ui="{
        ring: 'ring-1 ring-gray-200',
        shadow: 'shadow-sm',
        body: { padding: 'p-6' },
      }"
    >
      <UForm :state="{}">
        <div class="space-y-6">
          <!-- アラート名称 -->
          <div class="flex flex-col gap-4 sm:flex-row sm:items-center">
            <label
              class="whitespace-nowrap font-bold text-gray-700 sm:w-32 sm:text-right"
            >
              アラート名称
            </label>
            <div class="max-w-lg flex-1">
              <UInput v-model="formData.name" />
            </div>
          </div>
          <div
            v-if="apiValidationError?.exists('name')"
            class="text-sm text-red-500 sm:ml-36"
          >
            {{ apiValidationError?.first('name') }}
          </div>

          <!-- アラート種類 & 閾値 -->
          <div class="flex flex-col gap-4 sm:flex-row sm:items-center">
            <label
              class="whitespace-nowrap font-bold text-gray-700 sm:w-32 sm:text-right"
            >
              アラート種類
            </label>
            <div class="flex items-center gap-6">
              <div class="w-64">
                <CommonSelect
                  v-model:selected="formData.monitoringType"
                  class="w-full"
                  :options="MonitoringTypes.getNameValues()"
                />
              </div>
              <label class="whitespace-nowrap font-bold text-gray-700"
                >閾値</label
              >
              <div class="w-32">
                <UInput v-model="formData.threshold" />
              </div>
            </div>
          </div>
          <div
            v-if="apiValidationError?.exists('monitoringType')"
            class="text-sm text-red-500 sm:ml-36"
          >
            {{ apiValidationError?.first('monitoringType') }}
          </div>

          <!-- 対象単位 -->
          <div class="flex flex-col gap-4 sm:flex-row">
            <label
              class="mt-2 whitespace-nowrap font-bold text-gray-700 sm:w-32 sm:text-right"
            >
              対象単位
            </label>
            <div class="flex-1">
              <div class="mb-2 flex items-center gap-4">
                <div class="w-48">
                  <CommonSelect
                    v-model:selected="formData.skuMonitoringUnitType"
                    class="w-full"
                    :options="SkuMonitoringUnitTypes.getNameValues()"
                    @change="onChangedSkuMonitoringUnitType"
                  />
                </div>
                <UButton
                  color="indigo"
                  variant="soft"
                  :disabled="formData.isAllTarget"
                  @click="openSkuModal"
                  >選択</UButton
                >
                <div class="ml-4">
                  <UCheckbox v-model="formData.isAllTarget" label="全選択" />
                </div>
              </div>

              <div
                v-if="apiValidationError?.exists('skuMonitoringUnitType')"
                class="mb-2 text-sm text-red-500"
              >
                {{ apiValidationError?.first('skuMonitoringUnitType') }}
              </div>

              <!-- 選択内容を表示 -->
              <div v-if="!formData.isAllTarget" class="flex flex-wrap gap-2">
                <template
                  v-for="(sku, index) in formData.skus"
                  :key="sku.skuId"
                >
                  <UBadge color="gray" variant="subtle" size="md">
                    {{ sku.skuName }}
                    <UButton
                      :padded="false"
                      color="gray"
                      variant="link"
                      icon="i-heroicons-x-mark-20-solid"
                      class="ml-1"
                      @click="formData.skus.splice(index, 1)"
                    />
                  </UBadge>
                </template>
                <template
                  v-for="(group, index) in formData.groups"
                  :key="group.groupId"
                >
                  <UBadge color="gray" variant="subtle" size="md">
                    {{ group.groupName }}
                    <UButton
                      :padded="false"
                      color="gray"
                      variant="link"
                      icon="i-heroicons-x-mark-20-solid"
                      class="ml-1"
                      @click="formData.groups.splice(index, 1)"
                    />
                  </UBadge>
                </template>
                <template
                  v-for="(department, index) in formData.departments"
                  :key="department.departmentId"
                >
                  <UBadge color="gray" variant="subtle" size="md">
                    {{ department.departmentName }}
                    <UButton
                      :padded="false"
                      color="gray"
                      variant="link"
                      icon="i-heroicons-x-mark-20-solid"
                      class="ml-1"
                      @click="formData.departments.splice(index, 1)"
                    />
                  </UBadge>
                </template>
                <template
                  v-for="(clazz, index) in formData.classes"
                  :key="clazz.classId"
                >
                  <UBadge color="gray" variant="subtle" size="md">
                    {{ clazz.className }}
                    <UButton
                      :padded="false"
                      color="gray"
                      variant="link"
                      icon="i-heroicons-x-mark-20-solid"
                      class="ml-1"
                      @click="formData.classes.splice(index, 1)"
                    />
                  </UBadge>
                </template>
                <template
                  v-for="(line, index) in formData.lines"
                  :key="line.lineId"
                >
                  <UBadge color="gray" variant="subtle" size="md">
                    {{ line.lineName }}
                    <UButton
                      :padded="false"
                      color="gray"
                      variant="link"
                      icon="i-heroicons-x-mark-20-solid"
                      class="ml-1"
                      @click="formData.lines.splice(index, 1)"
                    />
                  </UBadge>
                </template>
              </div>
            </div>
          </div>

          <!-- 対象店舗 -->
          <div class="flex flex-col gap-4 sm:flex-row">
            <label
              class="mt-2 whitespace-nowrap font-bold text-gray-700 sm:w-32 sm:text-right"
            >
              対象店舗
            </label>
            <div class="flex-1">
              <div class="mb-2 flex items-center gap-4">
                <div class="w-48">
                  <CommonSelect
                    v-model:selected="formData.storeMonitoringUnitType"
                    class="w-full"
                    :options="StoreMonitoringUnitTypes.getNameValues()"
                  />
                </div>
                <UButton
                  color="indigo"
                  variant="soft"
                  :disabled="
                    formData.storeMonitoringUnitType ===
                    StoreMonitoringUnitTypes.All
                  "
                  @click="openStoreModal"
                  >選択</UButton
                >
              </div>

              <div
                v-if="apiValidationError?.exists('storeMonitoringUnitType')"
                class="mb-2 text-sm text-red-500"
              >
                {{ apiValidationError?.first('storeMonitoringUnitType') }}
              </div>

              <!-- 選択内容を表示 -->
              <div class="flex flex-wrap gap-2">
                <template
                  v-for="(store, index) in formData.stores"
                  :key="store.storeId"
                >
                  <UBadge color="gray" variant="subtle" size="md">
                    {{ store.storeName }}
                    <UButton
                      :padded="false"
                      color="gray"
                      variant="link"
                      icon="i-heroicons-x-mark-20-solid"
                      class="ml-1"
                      @click="formData.stores.splice(index, 1)"
                    />
                  </UBadge>
                </template>
                <template
                  v-for="(storeGroup, index) in formData.storeGroups"
                  :key="storeGroup.storeGroupId"
                >
                  <UBadge color="gray" variant="subtle" size="md">
                    {{ storeGroup.storeGroupName }}
                    <UButton
                      :padded="false"
                      color="gray"
                      variant="link"
                      icon="i-heroicons-x-mark-20-solid"
                      class="ml-1"
                      @click="formData.storeGroups.splice(index, 1)"
                    />
                  </UBadge>
                </template>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex justify-end border-t border-gray-100 pt-4">
            <UButton
              color="indigo"
              icon="i-heroicons-plus"
              class="w-full px-8 sm:w-auto"
              @click="addAlert"
            >
              追加
            </UButton>
          </div>
        </div>
      </UForm>
    </UCard>

    <UCard
      :ui="{
        ring: 'ring-1 ring-gray-200',
        shadow: 'shadow-sm',
        body: { padding: 'p-0 sm:p-0' },
      }"
      class="mt-6"
    >
      <UTable :rows="thresholds" :columns="headers" class="w-full">
        <template #monitoringType-data="{ row }">
          <UBadge color="gray" variant="subtle">
            {{ MonitoringTypes.getName(row.monitoringType) }}
          </UBadge>
        </template>

        <template #skuMonitoringUnitType-data="{ row }">
          <span class="font-medium text-gray-700">{{ skuTarget(row) }}</span>
        </template>

        <template #storeMonitoringUnitType-data="{ row }">
          <span class="font-medium text-gray-700">{{ storeTarget(row) }}</span>
        </template>

        <template #actions-data="{ row }">
          <div class="flex gap-2">
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-pencil-square"
              @click="onEdit(row)"
            >
              編集
            </UButton>
            <UButton
              color="red"
              variant="ghost"
              icon="i-heroicons-trash"
              @click="onDelete(row)"
            >
              削除
            </UButton>
          </div>
        </template>
      </UTable>

      <div
        v-if="thresholdTotal > 0"
        class="flex items-center justify-between rounded-b-lg border-t border-gray-100 bg-gray-50/50 p-4"
      >
        <span class="text-sm text-gray-500">
          全 {{ formatterNumber(thresholdTotal) }} 件のご確認
        </span>
        <UPagination
          v-model="paginationPage"
          :page-count="fetchRequest.perPage"
          :max="5"
          :total="thresholdTotal"
        />
      </div>
      <div v-else class="p-8 text-center text-gray-500">
        設定された閾値ルールはありません。
      </div>
    </UCard>

    <MonitoringSelectObjectModal
      v-model:is-open-modal="isOpenSkuModal"
      v-model:selected="formData.skus"
      v-model:items="skus"
      v-model:total="itemsTotal"
      :columns="[
        { key: 'groupName', label: '部門' },
        { key: 'departmentName', label: '中分類' },
        { key: 'lineName', label: '小分類' },
        { key: 'className', label: '細分類' },
        { key: 'skuId', label: 'JAN' },
        { key: 'skuName', label: '商品名' },
      ]"
      id-column-name="skuId"
      initial-state-is-empty
      @fetch-items="fetchSkus"
    />
    <MonitoringSelectObjectModal
      v-model:is-open-modal="isOpenGroupsModal"
      v-model:selected="formData.groups"
      v-model:items="groups"
      v-model:total="itemsTotal"
      :columns="[{ key: 'groupName', label: '部門' }]"
      id-column-name="groupId"
      @fetch-items="fetchGroups"
    />
    <MonitoringSelectObjectModal
      v-model:is-open-modal="isOpenDepartmentsModal"
      v-model:selected="formData.departments"
      v-model:items="departments"
      v-model:total="itemsTotal"
      :columns="[
        { key: 'groupName', label: '部門' },
        { key: 'departmentName', label: '中分類' },
      ]"
      id-column-name="departmentId"
      @fetch-items="fetchDepartments"
    />
    <MonitoringSelectObjectModal
      v-model:is-open-modal="isOpenLinesModal"
      v-model:selected="formData.lines"
      v-model:items="lines"
      v-model:total="itemsTotal"
      :columns="[
        { key: 'groupName', label: '部門' },
        { key: 'departmentName', label: '中分類' },
        { key: 'lineName', label: '小分類' },
      ]"
      id-column-name="lineId"
      @fetch-items="fetchLines"
    />
    <MonitoringSelectObjectModal
      v-model:is-open-modal="isOpenClassesModal"
      v-model:selected="formData.classes"
      v-model:items="classes"
      v-model:total="itemsTotal"
      :columns="[
        { key: 'groupName', label: '部門' },
        { key: 'departmentName', label: '中分類' },
        { key: 'lineName', label: '小分類' },
        { key: 'className', label: '細分類' },
      ]"
      id-column-name="classId"
      @fetch-items="fetchClasses"
    />
    <MonitoringSelectObjectModal
      v-model:is-open-modal="isOpenStoreMasterModal"
      v-model:selected="formData.stores"
      v-model:items="storeMasters"
      v-model:total="itemsTotal"
      :columns="[{ key: 'storeName', label: '店舗' }]"
      id-column-name="storeId"
      @fetch-items="fetchStores"
    />
    <MonitoringSelectObjectModal
      v-model:is-open-modal="isOpenStoreGroupModal"
      v-model:selected="formData.storeGroups"
      v-model:items="storeGroups"
      v-model:total="itemsTotal"
      :columns="[{ key: 'storeGroupName', label: '店舗グループ' }]"
      id-column-name="storeGroupId"
      @fetch-items="fetchStoreGroups"
    />

    <CommonConfirmModal v-model="showDeleteModal" @submit="submitDelete">
      <template #body>
        <!-- eslint-disable-next-line vue/no-v-html -->
        <section v-html="deleteBody" />
      </template>
    </CommonConfirmModal>
  </div>
</template>

<script setup lang="ts">
import type ApiValidationError from '~/types/classes/ApiValidationError'
import MonitoringTypes from '~/types/enums/MonitoringTypes'
import SkuMonitoringUnitTypes from '~/types/enums/SkuMonitoringUnitTypes'
import StoreMonitoringUnitTypes from '~/types/enums/StoreMonitoringUnitTypes'
import type AdminAlertThreshold from '~/types/interfaces/database/AdminAlertThreshold'
import type ClassMaster from '~/types/interfaces/database/SensyCloud/ClassMaster'
import type DepartmentMaster from '~/types/interfaces/database/SensyCloud/DepartmentMaster'
import type GroupMaster from '~/types/interfaces/database/SensyCloud/GroupMaster'
import type LineMaster from '~/types/interfaces/database/SensyCloud/LineMaster'
import type StoreGroup from '~/types/interfaces/database/SensyCloud/StoreGroup'
import type StoreMaster from '~/types/interfaces/database/SensyCloud/StoreMaster'
import type ConfigFormData from '~/types/interfaces/page/config/FormData'
import FormDataFactory from '~/types/interfaces/page/config/FormDataFactory'

const formData = ref<ConfigFormData>(new FormDataFactory())
const isOpenSkuModal = ref(false)
const skus = ref<any[]>([]) // FIXME: rfukuma 型定義作ったら充てる
const isOpenGroupsModal = ref(false)
const groups = ref<GroupMaster[]>([])
const isOpenDepartmentsModal = ref(false)
const departments = ref<DepartmentMaster[]>([])
const isOpenLinesModal = ref(false)
const lines = ref<LineMaster[]>([])
const isOpenClassesModal = ref(false)
const classes = ref<ClassMaster[]>([])
const isOpenStoreMasterModal = ref(false)
const storeMasters = ref<StoreMaster[]>([])
const isOpenStoreGroupModal = ref(false)
const storeGroups = ref<StoreGroup[]>([])
const itemsTotal = ref(0)
const apiValidationError = ref<ApiValidationError>(
  serviceValidationErrorsInstance()
)

const headers = [
  { key: 'name', label: 'アラート名称' },
  {
    key: 'monitoringType',
    label: 'アラート種類',
  },
  {
    key: 'threshold',
    label: '閾値',
  },
  {
    key: 'skuMonitoringUnitType',
    label: '対象単位',
  },
  {
    key: 'storeMonitoringUnitType',
    label: '対象店舗',
  },
  {
    key: 'actions',
    label: '操作',
  },
]

function openSkuModal() {
  switch (formData.value.skuMonitoringUnitType) {
    case SkuMonitoringUnitTypes.Sku:
      isOpenSkuModal.value = true
      break
    case SkuMonitoringUnitTypes.Group:
      isOpenGroupsModal.value = true
      break
    case SkuMonitoringUnitTypes.Department:
      isOpenDepartmentsModal.value = true
      break
    case SkuMonitoringUnitTypes.Line:
      isOpenLinesModal.value = true
      break
    case SkuMonitoringUnitTypes.Class:
      isOpenClassesModal.value = true
      break
  }
}

function openStoreModal() {
  switch (formData.value.storeMonitoringUnitType) {
    case StoreMonitoringUnitTypes.All:
      break
    case StoreMonitoringUnitTypes.Store:
      isOpenStoreMasterModal.value = true
      break
    case StoreMonitoringUnitTypes.Area:
      isOpenStoreGroupModal.value = true
      break
  }
}

async function fetchSkus(searchRequest: {
  text: string | null
  page: number
  perPage: number
}) {
  serviceLoadingStart()
  const response = await apiSkuMasterFetch(searchRequest)
  skus.value = response ? response.data : []
  itemsTotal.value = response ? response.total : 0
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
  itemsTotal.value = response ? response.total : 0
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
  itemsTotal.value = response ? response.total : 0
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
  itemsTotal.value = response ? response.total : 0
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
  itemsTotal.value = response ? response.total : 0
  serviceLoadingFinish()
}

async function fetchStores(searchRequest: {
  text: string | null
  page: number
  perPage: number
}) {
  serviceLoadingStart()
  const response = await apiStoreMasterFetch(searchRequest)
  storeMasters.value = response ? response.data : []
  itemsTotal.value = response ? response.total : 0
  serviceLoadingFinish()
}

async function fetchStoreGroups(searchRequest: {
  text: string | null
  page: number
  perPage: number
}) {
  serviceLoadingStart()
  const response = await apiStoreGroupFetch(searchRequest)
  storeGroups.value = response ? response.data : []
  itemsTotal.value = response ? response.total : 0
  serviceLoadingFinish()
}

async function addAlert() {
  // 全選択の場合は選択しているものを削除する
  if (formData.value.isAllTarget) {
    formData.value.skus = []
    formData.value.groups = []
    formData.value.departments = []
    formData.value.classes = []
    formData.value.lines = []
  }

  serviceLoadingStart()
  const response = await apiConfigCreate(formData.value)
  apiValidationError.value.refresh()

  if (!response || apiValidationError.value.exists()) {
    serviceLoadingFinish()
    return
  }
  await fetch(1)
  serviceLoadingFinish()

  useNuxtApp().$toast.success('閾値設定を追加しました。')
}

function onChangedSkuMonitoringUnitType() {
  // 単位を切り替えたら選択しているものを削除する
  formData.value.skus = []
  formData.value.groups = []
  formData.value.departments = []
  formData.value.classes = []
  formData.value.lines = []
}

const fetchRequest = ref(new ConfigFetchRequestFactory())
const paginationPage = computed({
  get: () => fetchRequest.value.page,
  set: (value) => {
    fetch(value)
  },
})
const thresholds = ref<AdminAlertThreshold[]>([])
const thresholdTotal = ref(0)
async function fetch(page: number) {
  fetchRequest.value.page = page
  serviceLoadingStart()
  const response = await apiConfigFetch(fetchRequest.value)
  apiValidationError.value.refresh()
  serviceLoadingFinish()
  if (!response) {
    return
  }

  thresholds.value = response.data
  thresholdTotal.value = response.total
}
await fetch(1)

const deleteThreshold = ref<AdminAlertThreshold | null>(null)
const showDeleteModal = computed({
  get: () => deleteThreshold.value !== null,
  set: (value) => {
    if (!value) {
      deleteThreshold.value = null
    }
  },
})
const deleteBody = computed(() => {
  return `閾値 ${deleteThreshold.value?.name} を削除します。<br />本当によろしいですか？`
})
function onDelete(threshold: AdminAlertThreshold) {
  deleteThreshold.value = threshold
}
async function submitDelete() {
  serviceLoadingStart()
  const response = await apiConfigDelete(deleteThreshold.value!.id)
  if (!response) {
    serviceLoadingFinish()
    return
  }
  await fetch(1)

  serviceLoadingFinish()
  showDeleteModal.value = false
}

function onEdit(threshold: AdminAlertThreshold) {
  useRouter().push('/config/' + threshold.id)
}

function skuTarget(threshold: AdminAlertThreshold) {
  switch (threshold.skuMonitoringUnitType) {
    case SkuMonitoringUnitTypes.Sku:
      return threshold.isAllTarget
        ? 'すべての商品'
        : formatterNumber(threshold.adminAlertThresholdSkus?.length) +
            ' 件の商品'
    case SkuMonitoringUnitTypes.Group:
      return threshold.isAllTarget
        ? 'すべての部門'
        : formatterNumber(threshold.adminAlertThresholdGroups?.length) +
            ' 件の部門'
    case SkuMonitoringUnitTypes.Department:
      return threshold.isAllTarget
        ? 'すべての中分類'
        : formatterNumber(threshold.adminAlertThresholdDepartments?.length) +
            ' 件の中分類'
    case SkuMonitoringUnitTypes.Line:
      return threshold.isAllTarget
        ? 'すべての小分類'
        : formatterNumber(threshold.adminAlertThresholdLines?.length) +
            ' 件の小分類'
    case SkuMonitoringUnitTypes.Class:
      return threshold.isAllTarget
        ? 'すべての細分類'
        : formatterNumber(threshold.adminAlertThresholdClasses?.length) +
            ' 件の細分類'
  }
}

function storeTarget(threshold: AdminAlertThreshold) {
  switch (threshold.storeMonitoringUnitType) {
    case StoreMonitoringUnitTypes.All:
      return StoreMonitoringUnitTypes.getName(threshold.storeMonitoringUnitType)
    case StoreMonitoringUnitTypes.Store:
      return (
        formatterNumber(threshold.adminAlertThresholdStores?.length) +
        ' 件の店舗'
      )
    case StoreMonitoringUnitTypes.Area:
      return '〇〇件の店舗'
  }
}
</script>

<style scoped></style>
