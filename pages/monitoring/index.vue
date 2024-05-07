<template>
  <div>
    <CommonHeader title="モニタリング" />

    <!-- 検索条件 -->
    <UForm :state="{}">
      <div class="flex flex-row">
        <div class="basis-1/4"></div>
        <div class="ml-3 basis-1/2">
          <div class="flex gap-1">
            <div class="basis-1/12"></div>
            <div class="basis-4/12 text-center">ふが</div>
            <div class="basis-7/12">ほげ</div>
          </div>
        </div>
      </div>
      <div class="flex flex-row">
        <div class="basis-1/4">
          <UFormGroup class="pb-3">
            <div class="flex items-center gap-1">
              <label class="basis-1/6 whitespace-nowrap font-bold">指標</label>
              <CommonSelect
                v-model:selected="formData.aggregateType"
                class="w-full"
                :options="AggregateTypes.getNameValues()"
              />
              <div></div>
            </div>
          </UFormGroup>
        </div>
        <div class="ml-3 basis-1/2">
          <!-- 商品選択 -->
          <UFormGroup class="pb-3">
            <div class="flex items-center gap-1">
              <label class="basis-1/12 whitespace-nowrap font-bold">商品</label>
              <CommonSelect
                v-model:selected="formData.skuAggregateUnitType"
                class="basis-4/12"
                :options="SkuAggregateUnitTypes.getNameValues()"
                @change="onChangedSkuAggregateUnitType"
              />
              <div class="flex w-full gap-1">
                <UInput
                  v-model.lazy="skuText"
                  class="w-full"
                  @change="fetchSku"
                />
                <UButton color="indigo" @click="openSkuModal"> 選択 </UButton>
              </div>
            </div>
          </UFormGroup>
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
              <label class="basis-1/12 whitespace-nowrap font-bold">店舗</label>
              <CommonSelect
                v-model:selected="formData.storeAggregateUnitType"
                class="basis-4/12"
                :options="StoreAggregateUnitTypes.getNameValues()"
                @change="onChangedStoreAggregateUnitType"
              />
              <div class="flex w-full gap-1">
                <UInput
                  v-model.lazy="storeText"
                  class="w-full"
                  @change="fetchStore"
                />
                <UButton color="indigo" @click="openStoreModal">選択</UButton>
              </div>
            </div>
          </UFormGroup>
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
              <label class="basis-1/12 whitespace-nowrap font-bold">期間</label>
              <CommonSelect
                v-model:selected="formData.aggregateHorizontalAxisType"
                class="basis-4/12"
                :options="AggregateHorizontalAxisTypes.getNameValues()"
              />
              <div class="flex w-full gap-1">
                <CommonDatepicker
                  v-model="formData.targetDateFrom"
                  class="basis-2/5"
                />
                <p class="text-center">~</p>
                <CommonDatepicker
                  v-model="formData.targetDateTo"
                  class="basis-2/5"
                />
              </div>
              <div></div>
            </div>
          </UFormGroup>
        </div>
      </div>
    </UForm>

    <section>
      <UButton color="indigo" @click="fetch">画面表示</UButton>
      <UButton
        color="primary"
        class="ml-2"
        :disabled="kpiRows.length === 0 || kpiColumns.length === 0"
        @click="csvExport"
      >
        CSV出力
      </UButton>
    </section>

    <!-- 集計結果 -->
    <template v-if="kpiRows.length > 0 && kpiColumns.length > 0">
      <UTable :columns="kpiColumns" :rows="kpiRows" />
    </template>

    <AggregatesSelectObjectModal
      v-model:is-open-modal="isOpenSkuModal"
      v-model:selected="formData.skus"
      v-model:items="skus"
      :columns="[{ key: 'skuName', label: '商品名' }]"
      name-column="skuName"
      @fetch-items="fetchSkus"
    />
    <AggregatesSelectObjectModal
      v-model:is-open-modal="isOpenGroupsModal"
      v-model:selected="formData.groups"
      v-model:items="groups"
      :columns="[{ key: 'groupName', label: '部門' }]"
      name-column="groupName"
      @fetch-items="fetchGroups"
    />
    <AggregatesSelectObjectModal
      v-model:is-open-modal="isOpenDepartmentsModal"
      v-model:selected="formData.departments"
      v-model:items="departments"
      :columns="[{ key: 'departmentName', label: '中分類' }]"
      name-column="departmentName"
      @fetch-items="fetchDepartments"
    />
    <AggregatesSelectObjectModal
      v-model:is-open-modal="isOpenLinesModal"
      v-model:selected="formData.lines"
      v-model:items="lines"
      :columns="[{ key: 'lineName', label: '小分類' }]"
      name-column="lineName"
      @fetch-items="fetchLines"
    />
    <AggregatesSelectObjectModal
      v-model:is-open-modal="isOpenClassesModal"
      v-model:selected="formData.classes"
      v-model:items="classes"
      :columns="[{ key: 'className', label: '種別' }]"
      name-column="className"
      @fetch-items="fetchClasses"
    />
    <AggregatesSelectObjectModal
      v-model:is-open-modal="isOpenStoreMasterModal"
      v-model:selected="formData.stores"
      v-model:items="storeMasters"
      :columns="[{ key: 'storeName', label: '店舗' }]"
      name-column="storeName"
      @fetch-items="fetchStores"
    />
    <AggregatesSelectObjectModal
      v-model:is-open-modal="isOpenStoreGroupModal"
      v-model:selected="formData.storeGroups"
      v-model:items="storeGroups"
      :columns="[{ key: 'storeGroupName', label: '店舗グループ' }]"
      name-column="storeGroupName"
      @fetch-items="fetchStoreGroups"
    />
  </div>
</template>

<script setup lang="ts">
import AggregateHorizontalAxisTypes from '~/types/enums/AggregateHorizontalAxisTypes'
import AggregateTypes from '~/types/enums/AggregateTypes'
import SkuAggregateUnitTypes from '~/types/enums/SkuAggregateUnitTypes'
import StoreAggregateUnitTypes from '~/types/enums/StoreAggregateUnitTypes'
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

const skuText = ref<string>('')
const storeText = ref<string>('')

// FIXME: rfukuma とりあえずモックとして作る
const kpiRows = ref<any[]>([])
const kpiColumns = ref<{ key: string; label: string }[]>([])

async function fetch() {
  // FIMXE: rfukuma バリデーションがあればここで

  serviceLoadingStart()

  kpiRows.value = []
  kpiColumns.value = []

  await new Promise((resolve) => setTimeout(resolve, 2000))

  // FIXME: rfukuma ＫＰＩ分析
  for (let i = 0; i < 9; i++) {
    kpiRows.value.push({
      skuName: `商品 00${i}`,
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
      key: 'skuName',
      label: '商品',
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
  storeMasters.value = response ? response.data : []
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
  serviceLoadingFinish()
}

function openSkuModal() {
  switch (formData.value.skuAggregateUnitType) {
    case SkuAggregateUnitTypes.Sku:
      isOpenSkuModal.value = true
      break
    case SkuAggregateUnitTypes.Group:
      isOpenGroupsModal.value = true
      break
    case SkuAggregateUnitTypes.Department:
      isOpenDepartmentsModal.value = true
      break
    case SkuAggregateUnitTypes.Line:
      isOpenLinesModal.value = true
      break
    case SkuAggregateUnitTypes.Class:
      isOpenClassesModal.value = true
      break
  }
}

function openStoreModal() {
  switch (formData.value.storeAggregateUnitType) {
    case StoreAggregateUnitTypes.All:
    case StoreAggregateUnitTypes.Store:
      isOpenStoreMasterModal.value = true
      break
    case StoreAggregateUnitTypes.Area:
      isOpenStoreGroupModal.value = true
      break
  }
}

async function fetchSku(text: string) {
  // FIXME: rfukuma 商品検索にヒットした
  if (text === '商品' || text === 'JANCODE') {
    formData.value.skuAggregateUnitType = SkuAggregateUnitTypes.Sku
    formData.value.groups = []
    formData.value.departments = []
    formData.value.lines = []
    formData.value.classes = []

    // FIXME: rfukuma 仮組み
    await fetchSkus({
      text: null,
      page: 1,
      perPage: 10,
    })
    formData.value.skus = [...skus.value]
    return
  }
  // FIXME: rfukuma 部門検索にヒットした
  if (text === '部門') {
    formData.value.skuAggregateUnitType = SkuAggregateUnitTypes.Group
    formData.value.skus = []
    formData.value.departments = []
    formData.value.lines = []
    formData.value.classes = []

    // FIXME: rfukuma 仮組み
    await fetchGroups({
      text: null,
      page: 1,
      perPage: 10,
    })
    formData.value.groups = [...groups.value]
    return
  }
  // FIXME: rfukuma 中分類検索にヒットした
  if (text === '中分類') {
    formData.value.skuAggregateUnitType = SkuAggregateUnitTypes.Department
    formData.value.skus = []
    formData.value.groups = []
    formData.value.lines = []
    formData.value.classes = []

    // FIXME: rfukuma 仮組み
    await fetchDepartments({
      text: null,
      page: 1,
      perPage: 10,
    })
    formData.value.departments = [...departments.value]
    return
  }
  // FIXME: rfukuma 小分類検索にヒットした
  if (text === '小分類') {
    formData.value.skuAggregateUnitType = SkuAggregateUnitTypes.Line
    formData.value.skus = []
    formData.value.groups = []
    formData.value.departments = []
    formData.value.classes = []

    // FIXME: rfukuma 仮組み
    await fetchLines({
      text: null,
      page: 1,
      perPage: 10,
    })
    formData.value.lines = [...lines.value]
    return
  }
  // FIXME: rfukuma 種別検索にヒットした
  if (text === '種別') {
    formData.value.skuAggregateUnitType = SkuAggregateUnitTypes.Class
    formData.value.skus = []
    formData.value.groups = []
    formData.value.departments = []
    formData.value.lines = []

    // FIXME: rfukuma 仮組み
    await fetchClasses({
      text: null,
      page: 1,
      perPage: 10,
    })
    formData.value.classes = [...classes.value]
    return
  }

  useNuxtApp().$toast.warning('お探しの商品は見つかりませんでした。')
}

async function fetchStore(text: string) {
  // FIXME: rfukuma 店舗検索にヒットした
  if (text === '店舗') {
    formData.value.storeAggregateUnitType = StoreAggregateUnitTypes.Store
    formData.value.storeGroups = []

    // FIXME: rfukuma 仮組み
    await fetchStores({
      text: null,
      page: 1,
      perPage: 10,
    })
    formData.value.stores = [...storeMasters.value]
    return
  }

  // FIXME: rfukuma 店舗グループ検索にヒットした
  if (text === '店舗グループ') {
    formData.value.storeAggregateUnitType = StoreAggregateUnitTypes.Area
    formData.value.stores = []

    // FIXME: rfukuma 仮組み
    await fetchStoreGroups({
      text: null,
      page: 1,
      perPage: 10,
    })
    formData.value.storeGroups = [...storeGroups.value]
    return
  }

  useNuxtApp().$toast.warning('お探しの店舗は見つかりませんでした。')
}

function onChangedSkuAggregateUnitType() {
  switch (formData.value.skuAggregateUnitType) {
    case SkuAggregateUnitTypes.Sku:
      formData.value.groups = []
      formData.value.departments = []
      formData.value.lines = []
      formData.value.classes = []
      break
    case SkuAggregateUnitTypes.Group:
      formData.value.skus = []
      formData.value.departments = []
      formData.value.lines = []
      formData.value.classes = []
      break
    case SkuAggregateUnitTypes.Department:
      formData.value.skus = []
      formData.value.groups = []
      formData.value.lines = []
      formData.value.classes = []
      break
    case SkuAggregateUnitTypes.Line:
      formData.value.skus = []
      formData.value.groups = []
      formData.value.departments = []
      formData.value.classes = []
      break
    case SkuAggregateUnitTypes.Class:
      formData.value.skus = []
      formData.value.groups = []
      formData.value.departments = []
      formData.value.lines = []
      break
  }
}

function onChangedStoreAggregateUnitType() {
  switch (formData.value.storeAggregateUnitType) {
    case StoreAggregateUnitTypes.All:
      formData.value.stores = []
      formData.value.storeGroups = []
      break
    case StoreAggregateUnitTypes.Store:
      formData.value.storeGroups = []
      break
    case StoreAggregateUnitTypes.Area:
      formData.value.stores = []
      break
  }
}
</script>

<style scoped></style>
