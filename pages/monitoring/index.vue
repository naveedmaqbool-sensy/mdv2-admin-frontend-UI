<template>
  <div>
    <CommonHeader title="モニタリング" />

    <!-- 検索条件 -->
    <UForm :state="{}">
      <div class="flex flex-row">
        <div class="basis-1/4">
          <div class="flex items-center gap-1">
            <div class="basis-1/12"></div>
            <div class="basis-3/12 text-center font-bold">&nbsp;</div>
            <div class="w-full text-center indent-[-3rem] font-bold">
              &nbsp;
            </div>
          </div>
          <UFormGroup class="pb-3">
            <div class="flex items-center gap-1">
              <label class="basis-10 whitespace-nowrap pr-2 font-bold">
                指標
              </label>
              <CommonSelect
                v-model:selected="formData.monitoringType"
                class="w-full"
                :options="MonitoringTypes.getNameValues()"
              />
              <div></div>
            </div>
          </UFormGroup>
        </div>
        <div class="ml-3 basis-3/4">
          <div class="flex items-center gap-1">
            <div class="basis-10"></div>
            <div class="basis-2/12 text-center font-bold">【取得単位】</div>
            <div class="basis-2/12 text-center font-bold">【取得範囲】</div>
            <div class="basis-12"></div>
          </div>

          <!-- 商品選択 -->
          <UFormGroup class="pb-3">
            <div class="flex items-center gap-1">
              <label class="basis-10 whitespace-nowrap font-bold">商品</label>
              <CommonSelect
                v-model:selected="formData.skuMonitoringUnitType"
                class="basis-2/12"
                :options="SkuMonitoringUnitTypes.getNameValues()"
                @change="onChangedSkuMonitoringUnitType"
              />
              <CommonSelect
                v-model:selected="formData.skuMonitoringRangeType"
                class="basis-2/12"
                :options="
                  skuRangeTypes.map((v) => {
                    return {
                      name: SkuMonitoringUnitTypes.getName(v),
                      value: v,
                    }
                  })
                "
                placeholder="-"
                @change="onChangedSkuMonitoringRangeType"
              />
              <UButton
                class="basis-12"
                color="indigo"
                :disabled="formData.skuMonitoringRangeType === null"
                @click="openSkuModal"
              >
                選択
              </UButton>
            </div>
          </UFormGroup>
          <!-- バリデーションエラー -->
          <div
            v-if="apiValidationError?.exists('skuMonitoringRangeType')"
            class="mt-[-0.5rem] pb-3 text-red-400"
          >
            {{ apiValidationError.first('skuMonitoringRangeType') }}
          </div>
          <div
            v-else-if="apiValidationError?.exists('skuMonitoringUnitType')"
            class="mt-[-0.5rem] pb-3 text-red-400"
          >
            {{ apiValidationError.first('skuMonitoringUnitType') }}
          </div>

          <!-- 選択内容を表示 -->
          <div v-if="formData.skus.length > 0" class="pb-3">
            <template v-for="(sku, index) in formData.skus" :key="sku.skuId">
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

          <!-- 店舗選択 -->
          <UFormGroup class="pb-3">
            <div class="flex items-center gap-1">
              <label class="basis-10 whitespace-nowrap font-bold">店舗</label>
              <!-- FIXME: rfukuma 範囲選択 -->
              <CommonSelect
                v-model:selected="formData.storeMonitoringUnitType"
                class="basis-2/12"
                :options="StoreMonitoringUnitTypes.getNameValues()"
                @change="onChangedStoreMonitoringUnitType"
              />
              <CommonSelect
                v-model:selected="formData.storeMonitoringRangeType"
                class="basis-2/12"
                :options="
                  storeRangeTypes.map((v) => {
                    return {
                      name: StoreMonitoringUnitTypes.getName(v),
                      value: v,
                    }
                  })
                "
                placeholder="-"
                :disabled="
                  formData.storeMonitoringUnitType ===
                  StoreMonitoringUnitTypes.All
                "
                @change="onChangedStoreMonitoringRangeType"
              />
              <UButton
                class="basis-12"
                color="indigo"
                :disabled="formData.storeMonitoringRangeType === null"
                @click="openStoreModal"
              >
                選択
              </UButton>
            </div>
          </UFormGroup>

          <!-- バリデーションエラー -->
          <div
            v-if="apiValidationError?.exists('storeMonitoringRangeType')"
            class="mt-[-0.5rem] pb-3 text-red-400"
          >
            {{ apiValidationError.first('storeMonitoringRangeType') }}
          </div>
          <div
            v-else-if="apiValidationError?.exists('storeMonitoringUnitType')"
            class="mt-[-0.5rem] pb-3 text-red-400"
          >
            {{ apiValidationError.first('storeMonitoringUnitType') }}
          </div>

          <!-- 選択内容を表示 -->
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
          <UFormGroup class="pb-3">
            <div class="flex items-center gap-1">
              <label class="basis-10 whitespace-nowrap font-bold">期間</label>
              <CommonSelect
                v-model:selected="formData.monitoringHorizontalAxisType"
                class="basis-2/12"
                :options="MonitoringHorizontalAxisTypes.getNameValues()"
              />
              <CommonDatepicker
                v-model="formData.targetDateFrom"
                class="basis-2/12"
              />
              <p class="basis-12 text-center">～</p>
              <CommonDatepicker
                v-model="formData.targetDateTo"
                class="basis-2/12"
              />
            </div>
          </UFormGroup>
          <!-- バリデーションエラー -->
          <div
            v-if="apiValidationError?.exists('targetDateFrom')"
            class="mt-[-0.5rem] pb-3 text-red-400"
          >
            {{ apiValidationError.first('targetDateFrom') }}
          </div>
          <div
            v-if="apiValidationError?.exists('targetDateTo')"
            class="mt-[-0.5rem] pb-3 text-red-400"
          >
            {{ apiValidationError.first('targetDateTo') }}
          </div>
        </div>
      </div>
    </UForm>

    <section>
      <UButton color="indigo" @click="fetch">画面表示</UButton>
      <UButton
        color="primary"
        class="ml-2"
        :disabled="kpiRows.length === 0 || kpiHeaders.length === 0"
        @click="csvExport"
      >
        CSV出力
      </UButton>
    </section>

    <!-- 集計結果 -->
    <template v-if="kpiRows.length > 0 && kpiHeaders.length > 0">
      <UTable
        :columns="
          kpiHeaders.map((v, index) => ({
            key: index.toString(),
            label: v,
          }))
        "
        :rows="
          kpiRows.map((values) => {
            const result: { [key: string]: string } = {}
            values.forEach((v, index) => {
              result[index.toString()] = v
            })
            return result
          })
        "
      />
    </template>

    <MonitoringSelectObjectModal
      v-model:is-open-modal="isOpenSkuModal"
      v-model:selected="formData.skus"
      v-model:items="skus"
      v-model:total="itemsTotal"
      :columns="[{ key: 'skuName', label: '商品名' }]"
      id-column-name="skuId"
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
      :columns="[{ key: 'departmentName', label: '中分類' }]"
      id-column-name="departmentId"
      @fetch-items="fetchDepartments"
    />
    <MonitoringSelectObjectModal
      v-model:is-open-modal="isOpenLinesModal"
      v-model:selected="formData.lines"
      v-model:items="lines"
      v-model:total="itemsTotal"
      :columns="[{ key: 'lineName', label: '小分類' }]"
      id-column-name="lineId"
      @fetch-items="fetchLines"
    />
    <MonitoringSelectObjectModal
      v-model:is-open-modal="isOpenClassesModal"
      v-model:selected="formData.classes"
      v-model:items="classes"
      v-model:total="itemsTotal"
      :columns="[{ key: 'className', label: '種別' }]"
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
  </div>
</template>

<script setup lang="ts">
import ApiValidationError from '~/types/classes/ApiValidationError'
import MonitoringHorizontalAxisTypes from '~/types/enums/MonitoringHorizontalAxisTypes'
import MonitoringTypes from '~/types/enums/MonitoringTypes'
import SkuMonitoringUnitTypes from '~/types/enums/SkuMonitoringUnitTypes'
import StoreMonitoringUnitTypes from '~/types/enums/StoreMonitoringUnitTypes'
import type ClassMaster from '~/types/interfaces/database/SensyCloud/ClassMaster'
import type DepartmentMaster from '~/types/interfaces/database/SensyCloud/DepartmentMaster'
import type GroupMaster from '~/types/interfaces/database/SensyCloud/GroupMaster'
import type LineMaster from '~/types/interfaces/database/SensyCloud/LineMaster'
import type StoreGroup from '~/types/interfaces/database/SensyCloud/StoreGroup'
import type StoreMaster from '~/types/interfaces/database/SensyCloud/StoreMaster'
import type FormData from '~/types/interfaces/page/monitoring/FormData'
import FormDataFactory from '~/types/interfaces/page/monitoring/FormDataFactory'

const formData = ref<FormData>(new FormDataFactory())
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

const kpiRows = ref<string[][]>([])
const kpiHeaders = ref<string[]>([])
const apiValidationError = ref<ApiValidationError | null>(null)

const skuRangeTypes = computed(() => {
  switch (formData.value.skuMonitoringUnitType) {
    case SkuMonitoringUnitTypes.Sku:
      return [
        SkuMonitoringUnitTypes.Sku,
        SkuMonitoringUnitTypes.Group,
        SkuMonitoringUnitTypes.Department,
        SkuMonitoringUnitTypes.Line,
        SkuMonitoringUnitTypes.Class,
      ]
    case SkuMonitoringUnitTypes.Group:
      return [SkuMonitoringUnitTypes.Group]
    case SkuMonitoringUnitTypes.Department:
      return [SkuMonitoringUnitTypes.Group, SkuMonitoringUnitTypes.Department]
    case SkuMonitoringUnitTypes.Line:
      return [
        SkuMonitoringUnitTypes.Group,
        SkuMonitoringUnitTypes.Department,
        SkuMonitoringUnitTypes.Line,
      ]
    case SkuMonitoringUnitTypes.Class:
      return [
        SkuMonitoringUnitTypes.Group,
        SkuMonitoringUnitTypes.Department,
        SkuMonitoringUnitTypes.Line,
        SkuMonitoringUnitTypes.Class,
      ]
  }
  return []
})

const storeRangeTypes = computed(() => {
  switch (formData.value.storeMonitoringUnitType) {
    case StoreMonitoringUnitTypes.Store:
      return [StoreMonitoringUnitTypes.Store, StoreMonitoringUnitTypes.Area]
    case StoreMonitoringUnitTypes.Area:
      return [StoreMonitoringUnitTypes.Area]
  }
  return []
})

async function fetch() {
  // FIXME: rfukuma バリデーションがあればここで

  // 検索できない分類をはじく

  serviceLoadingStart()

  const response = await apiMonitoringFetch(formData.value)

  serviceLoadingFinish()

  apiValidationError.value = new ApiValidationError()
  if (!response || apiValidationError.value!.exists()) {
    return
  }

  kpiRows.value = response.rows
  kpiHeaders.value = response.headers
}

function csvExport() {
  // FIXME: rfukuma CSV出力
  alert('CSV 出力を行います')
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
  // FIXME: rfukuma 店舗グループの扱いが変わる可能性があるため StoreMaster 参照とする
  const response = await apiStoreGroupFetch(searchRequest)
  storeGroups.value = response ? response.data : []
  itemsTotal.value = response ? response.total : 0
  serviceLoadingFinish()
}

function openSkuModal() {
  switch (formData.value.skuMonitoringRangeType) {
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
  switch (formData.value.storeMonitoringRangeType) {
    case StoreMonitoringUnitTypes.All:
    case StoreMonitoringUnitTypes.Store:
      isOpenStoreMasterModal.value = true
      break
    case StoreMonitoringUnitTypes.Area:
      isOpenStoreGroupModal.value = true
      break
  }
}

function onChangedSkuMonitoringUnitType() {
  // 指定できない場合は初期化する
  if (
    formData.value.skuMonitoringRangeType &&
    !skuRangeTypes.value.includes(formData.value.skuMonitoringRangeType)
  ) {
    formData.value.skuMonitoringRangeType = null
    formData.value.skus = []
    formData.value.groups = []
    formData.value.departments = []
    formData.value.classes = []
    formData.value.lines = []
  }
}

function onChangedSkuMonitoringRangeType() {
  formData.value.skus = []
  formData.value.groups = []
  formData.value.departments = []
  formData.value.classes = []
  formData.value.lines = []
}

function onChangedStoreMonitoringUnitType() {
  if (
    formData.value.storeMonitoringRangeType &&
    !storeRangeTypes.value.includes(formData.value.storeMonitoringRangeType)
  ) {
    formData.value.storeMonitoringRangeType = null
    formData.value.storeGroups = []
    formData.value.stores = []
  }
}

function onChangedStoreMonitoringRangeType() {
  formData.value.storeGroups = []
  formData.value.stores = []
}
</script>

<style scoped></style>
