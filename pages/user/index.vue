<template>
  <div>
    <CommonHeader title="ユーザー管理" />

    <UCard
      :ui="{
        ring: 'ring-1 ring-gray-200',
        shadow: 'shadow-sm',
        body: { padding: 'p-6' },
      }"
    >
      <UForm :state="{}">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div class="flex flex-1 items-center gap-4">
            <label
              class="whitespace-nowrap font-bold text-gray-700 sm:w-32 sm:text-right"
            >
              あいまい検索
            </label>
            <div class="max-w-lg flex-1">
              <UInput
                v-model="fetchRequest.text!"
                placeholder="社員番号・氏名"
                icon="i-heroicons-magnifying-glass"
              />
            </div>
          </div>

          <div
            class="flex items-center gap-3 sm:border-l sm:border-gray-100 sm:pl-8"
          >
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-arrow-path"
              @click="reset"
            >
              リセット
            </UButton>
            <UButton color="indigo" @click="fetch(1)"> 検索 </UButton>
            <UButton
              v-if="loginUser.permission === UserPermissionTypes.Admin"
              color="primary"
              variant="outline"
              icon="i-heroicons-plus"
              @click="onCreate"
            >
              新規追加
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
      <UTable :rows="users" :columns="userHeaders" class="w-full">
        <template #permission-data="{ row }">
          <UBadge
            :color="
              row.permission === UserPermissionTypes.Admin ? 'primary' : 'gray'
            "
            variant="subtle"
          >
            {{ UserPermissionTypes.getName(row.permission) }}
          </UBadge>
        </template>
        <template #storeMasters-data="{ row }">
          <template v-if="row.storeMasters.length > 0">
            <span class="text-gray-700">{{
              row.storeMasters.map((v: StoreMaster) => v.storeName).join('/')
            }}</span>
          </template>
          <template v-else>
            <span class="text-gray-400">-</span>
          </template>
        </template>
        <template #groupMasters-data="{ row }">
          <template v-if="row.groupMasters.length > 0">
            <span class="text-gray-700">{{
              row.groupMasters.map((v: GroupMaster) => v.groupName).join('/')
            }}</span>
          </template>
          <template v-else>
            <span class="text-gray-400">-</span>
          </template>
        </template>
        <template #isValid-data="{ row }">
          <UBadge :color="row.isValid ? 'emerald' : 'red'" variant="subtle">
            {{ row.isValid ? '有効' : '無効' }}
          </UBadge>
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
        v-if="userTotal > 0"
        class="flex items-center justify-between rounded-b-lg border-t border-gray-100 bg-gray-50/50 p-4"
      >
        <span class="text-sm text-gray-500">
          全 {{ userTotal }} 件のご確認
        </span>
        <UPagination
          v-model="paginationPage"
          :page-count="fetchRequest.perPage"
          :max="5"
          :total="userTotal"
        />
      </div>
      <div v-else class="p-8 text-center text-gray-500">
        該当するユーザーは見つかりませんでした。
      </div>
    </UCard>

    <CommonConfirmModal v-model="showDeleteModal" @submit="submitDelete">
      <template #body>
        <!-- eslint-disable-next-line vue/no-v-html -->
        <section v-html="deleteBody" />
      </template>
    </CommonConfirmModal>
  </div>
</template>

<script setup lang="ts">
import type User from '@/types/interfaces/database/User'
import UserPermissionTypes from '~/types/enums/UserPermissionTypes'
import type GroupMaster from '~/types/interfaces/database/SensyCloud/GroupMaster'
import type StoreMaster from '~/types/interfaces/database/SensyCloud/StoreMaster'

const fetchRequest = ref(new UserFetchRequestFactory())
const paginationPage = computed({
  get: () => fetchRequest.value.page,
  set: (value) => {
    fetch(value)
  },
})
const users = ref<User[]>([])
const userTotal = ref(0)
const userHeaders = [
  { key: 'code', label: '社員番号' },
  { key: 'name', label: '氏名' },
  { key: 'permission', label: '権限' },
  { key: 'storeMasters', label: '所属店舗' },
  { key: 'groupMasters', label: '所属部門' },
  { key: 'isValid', label: '有効区分' },
  { key: 'actions', label: '操作' },
]
const loginUser = useAuth().data.value as User
if (loginUser.permission === UserPermissionTypes.General) {
  userHeaders.splice(userHeaders.length - 1, 1)
}

function reset() {
  fetchRequest.value = new UserFetchRequestFactory()
}

async function fetch(page: number) {
  fetchRequest.value.page = page

  serviceLoadingStart()
  const response = await apiUserFetch(fetchRequest.value)
  serviceLoadingFinish()

  if (!response) {
    return
  }

  users.value = response.data
  userTotal.value = response.total
}
await fetch(1)

function onCreate() {
  useRouter().push('/user/create')
}

function onEdit(row: User) {
  useRouter().push('/user/' + row.id)
}

const deleteBody = ref('')
const deleteUser = ref<User | null>(null)
const showDeleteModal = computed({
  get: () => deleteUser.value !== null,
  set: (value) => {
    if (!value) {
      deleteUser.value = null
    }
  },
})
function onDelete(row: User) {
  deleteUser.value = row
  deleteBody.value = `${row.name} を削除します。<br />本当によろしいですか？`
}

async function submitDelete() {
  serviceLoadingStart()
  const response = await apiUserDelete(deleteUser.value!.id!)
  if (!response) {
    serviceLoadingFinish()
    return
  }

  await fetch(fetchRequest.value.page)
  serviceLoadingFinish()

  useNuxtApp().$toast.success(deleteUser.value?.name + 'を削除しました。')

  showDeleteModal.value = false
}
</script>

<style scoped></style>
