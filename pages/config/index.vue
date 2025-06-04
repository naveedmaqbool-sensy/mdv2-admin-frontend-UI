<template>
  <div>
    <CommonHeader title="閾値設定" />

    <UForm :state="{}">
      <section class="rounded border border-gray-300 p-4">
        <div class="flex flex-row">
          <!-- アラート名称 -->
          <div class="flex basis-1/12 flex-col justify-center text-right">
            <label class="whitespace-nowrap pr-2 font-bold">アラート名称</label>
          </div>
          <div class="my-auto flex basis-4/12 flex-col justify-center">
            <UInput v-model="formData.name" />
          </div>
        </div>
        <div v-if="apiValidationError?.exists('name')" class="flex flex-row">
          <div class="flex basis-1/12 flex-col justify-center text-right" />
          <div class="text-red-400">
            {{ apiValidationError?.first('name') }}
          </div>
        </div>

        <!-- アラート種類 -->
        <div class="flex flex-row pt-2">
          <div class="flex basis-1/12 flex-col justify-center text-right">
            <label class="whitespace-nowrap pr-2 font-bold">アラート種類</label>
          </div>
          <div class="flex basis-2/12 flex-col justify-center">
            <CommonSelect
              v-model:selected="formData.monitoringType"
              class="w-full"
              :options="MonitoringTypes.getNameValues()"
            />
          </div>
          <div class="flex basis-1/12 flex-col justify-center text-right">
            <label class="whitespace-nowrap pr-2 font-bold">閾値</label>
          </div>
          <div class="flex basis-2/12 flex-col justify-center">
            <UInput v-model="formData.threshold" />
          </div>
        </div>
        <div
          v-if="apiValidationError?.exists('monitoringType')"
          class="flex flex-row"
        >
          <div class="flex basis-1/12 flex-col justify-center text-right" />
          <div class="text-red-400">
            {{ apiValidationError?.first('monitoringType') }}
          </div>
        </div>

        <!-- 対象単位 -->
        <div class="flex flex-row pt-2">
          <div class="flex basis-1/12 flex-col justify-center text-right">
            <label class="whitespace-nowrap pr-2 font-bold">対象単位</label>
          </div>
          <div class="my-auto flex basis-2/12 flex-col justify-center">
            <CommonSelect
              v-model:selected="formData.skuMonitoringUnitType"
              class="w-full"
              :options="SkuMonitoringUnitTypes.getNameValues()"
              @change="onChangedSkuMonitoringUnitType"
            />
          </div>
          <div class="flex flex-col justify-center pl-2">
            <UButton
              color="indigo"
              :disabled="formData.isAllTarget"
              @click="openSkuModal"
              >選択</UButton
            >
          </div>
          <div class="flex flex-col justify-center pl-5">
            <UCheckbox v-model="formData.isAllTarget" label="全選択" />
          </div>
        </div>
        <div
          v-if="apiValidationError?.exists('skuMonitoringUnitType')"
          class="flex flex-row"
        >
          <div class="flex basis-1/12 flex-col justify-center text-right" />
          <div class="text-red-400">
            {{ apiValidationError?.first('skuMonitoringUnitType') }}
          </div>
        </div>
        <!-- 選択内容を表示 -->
        <div class="flex flex-row pt-2">
          <template v-if="!formData.isAllTarget">
            <div class="flex basis-1/12 flex-col justify-center text-right" />
            <div class="my-auto flex flex-col justify-center">
              <div v-if="formData.skus.length > 0" class="pb-3">
                <template
                  v-for="(sku, index) in formData.skus"
                  :key="sku.skuId"
                >
                  <UBadge class="ml-1" color="gray">
                    {{ sku.skuName }}
                    <UButton
                      :padded="false"
                      color="gray"
                      variant="link"
                      icon="i-heroicons-x-mark-20-solid"
                      @click="formData.skus.splice(index, 1)"
                    />
                  </UBadge>
                </template>
              </div>
              <div v-if="formData.groups.length > 0" class="pb-3">
                <template
                  v-for="(group, index) in formData.groups"
                  :key="group.groupId"
                >
                  <UBadge class="ml-1" color="gray">
                    {{ group.groupName }}
                    <UButton
                      :padded="false"
                      color="gray"
                      variant="link"
                      icon="i-heroicons-x-mark-20-solid"
                      @click="formData.groups.splice(index, 1)"
                    />
                  </UBadge>
                </template>
              </div>
              <div v-if="formData.departments.length > 0" class="pb-3">
                <template
                  v-for="(department, index) in formData.departments"
                  :key="department.departmentId"
                >
                  <UBadge class="ml-1" color="gray">
                    {{ department.departmentName }}
                    <UButton
                      :padded="false"
                      color="gray"
                      variant="link"
                      icon="i-heroicons-x-mark-20-solid"
                      @click="formData.departments.splice(index, 1)"
                    />
                  </UBadge>
                </template>
              </div>
              <div v-if="formData.classes.length > 0" class="pb-3">
                <template
                  v-for="(clazz, index) in formData.classes"
                  :key="clazz.classId"
                >
                  <UBadge class="ml-1" color="gray">
                    {{ clazz.className }}
                    <UButton
                      :padded="false"
                      color="gray"
                      variant="link"
                      icon="i-heroicons-x-mark-20-solid"
                      @click="formData.classes.splice(index, 1)"
                    />
                  </UBadge>
                </template>
              </div>
              <div v-if="formData.lines.length > 0" class="pb-3">
                <template
                  v-for="(line, index) in formData.lines"
                  :key="line.lineId"
                >
                  <UBadge class="ml-1" color="gray">
                    {{ line.lineName }}
                    <UButton
                      :padded="false"
                      color="gray"
                      variant="link"
                      icon="i-heroicons-x-mark-20-solid"
                      @click="formData.lines.splice(index, 1)"
                    />
                  </UBadge>
                </template>
              </div>
            </div>
          </template>
        </div>

        <!-- 対象店舗 -->
        <div class="flex flex-row">
          <div class="flex basis-1/12 flex-col justify-center text-right">
            <label class="whitespace-nowrap pr-2 font-bold"> 対象店舗 </label>
          </div>
          <div class="my-auto flex basis-2/12 flex-col justify-center">
            <CommonSelect
              v-model:selected="formData.storeMonitoringUnitType"
              class="w-full"
              :options="StoreMonitoringUnitTypes.getNameValues()"
            />
          </div>
          <div class="flex flex-col justify-center pl-2">
            <UButton
              color="indigo"
              :disabled="
                formData.storeMonitoringUnitType ===
                StoreMonitoringUnitTypes.All
              "
              @click="openStoreModal"
              >選択</UButton
            >
          </div>
        </div>
        <div
          v-if="apiValidationError?.exists('storeMonitoringUnitType')"
          class="flex flex-row"
        >
          <div class="flex basis-1/12 flex-col justify-center text-right" />
          <div class="text-red-400">
            {{ apiValidationError?.first('storeMonitoringUnitType') }}
          </div>
        </div>

        <!-- 選択内容を表示 -->
        <div class="flex flex-row pt-2">
          <div class="flex basis-1/12 flex-col justify-center text-right" />
          <div class="my-auto flex flex-col justify-center">
            <div v-if="formData.stores.length > 0" class="pb-3">
              <template
                v-for="(store, index) in formData.stores"
                :key="store.storeId"
              >
                <UBadge class="ml-1" color="gray">
                  {{ store.storeName }}
                  <UButton
                    :padded="false"
                    color="gray"
                    variant="link"
                    icon="i-heroicons-x-mark-20-solid"
                    @click="formData.stores.splice(index, 1)"
                  />
                </UBadge>
              </template>
            </div>
            <div v-if="formData.storeGroups.length > 0" class="pb-3">
              <template
                v-for="(storeGroup, index) in formData.storeGroups"
                :key="storeGroup.storeGroupId"
              >
                <UBadge class="ml-1" color="gray">
                  {{ storeGroup.storeGroupName }}
                  <UButton
                    :padded="false"
                    color="gray"
                    variant="link"
                    icon="i-heroicons-x-mark-20-solid"
                    @click="formData.storeGroups.splice(index, 1)"
                  />
                </UBadge>
              </template>
            </div>
          </div>
        </div>
      </section>

      <section class="pt-2 text-left">
        <UButton class="text-white" @click="addAlert">
          <UIcon name="i-heroicons-plus" class="text-white" />
          追加
        </UButton>
      </section>
    </UForm>

    <UTable :rows="thresholds" :columns="headers">
      <template #monitoringType-data="{ row }">
        {{ MonitoringTypes.getName(row.monitoringType) }}
      </template>

      <template #skuMonitoringUnitType-data="{ row }">
        <div class="flex flex-row">
          <div class="my-auto basis-2/3">
            {{ skuTarget(row) }}
          </div>
          <div class="w-full"></div>
        </div>
      </template>

      <template #storeMonitoringUnitType-data="{ row }">
        <div class="flex flex-row">
          <div class="my-auto basis-2/3">
            {{ storeTarget(row) }}
          </div>
          <div class="w-full"></div>
        </div>
      </template>

      <template #actions-data="{ row }">
        <UButton color="yellow" @click="onEdit(row)">編集</UButton>
        <UButton color="red" class="ml-2" @click="onDelete(row)">削除</UButton>
      </template>
    </UTable>
    <UPagination
      v-model="paginationPage"
      :page-count="fetchRequest.perPage"
      :max="5"
      :total="thresholdTotal"
    />

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
