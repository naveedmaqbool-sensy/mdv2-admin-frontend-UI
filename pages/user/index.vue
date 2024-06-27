<template>
  <div>
    <CommonHeader title="ユーザー管理" />

    <UForm :state="{}">
      <section class="rounded border border-gray-300 p-4">
        <!-- FIXME: rfukuma 暗号化するので -->
        <div class="flex flex-row">
          <div class="my-auto basis-1/12 text-right">
            <label class="whitespace-nowrap pr-2 text-right font-bold">
              あいまい検索
            </label>
          </div>
          <div class="basis-5/12">
            <UInput
              v-model="fetchRequest.text"
              placeholder="社員番号・氏名・メールアドレス"
            />
          </div>
        </div>
      </section>
      <section class="flex flex-row pt-2">
        <div class="basis-1/2 text-left">
          <UButton color="white" @click="reset">リセット</UButton>
          <UButton class="ml-2" color="indigo" @click="fetch(1)">検索</UButton>
        </div>
        <div class="basis-1/2 text-right">
          <UButton @click="onCreate">新規追加</UButton>
        </div>
      </section>
    </UForm>

    <UTable :rows="users" :columns="userHeaders">
      <template #storeMasters-data="{ row }">
        <template v-if="row.storeMasters.length > 0">
          {{ row.storeMasters.map((v: StoreMaster) => v.storeName).join('/') }}
        </template>
        <template v-else> - </template>
      </template>
      <template #groupMasters-data="{ row }">
        <template v-if="row.groupMasters.length > 0">
          {{ row.groupMasters.map((v: GroupMaster) => v.groupName).join('/') }}
        </template>
        <template v-else> - </template>
      </template>
      <template #isValid-data="{ row }">
        {{ row.isValid ? '有効' : '無効' }}
      </template>
      <template #actions-data="{ row }">
        <UButton color="yellow" @click="onEdit(row)">編集</UButton>
        <UButton color="red" class="ml-2" @click="onDelete(row)">削除</UButton>
      </template>
    </UTable>

    <UPagination
      v-model="fetchRequest.page"
      :page-count="fetchRequest.perPage"
      :max="5"
      :total="userTotal"
      @change="fetch(fetchRequest.page)"
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
import type User from '@/types/interfaces/database/User'
import type GroupMaster from '~/types/interfaces/database/SensyCloud/GroupMaster'
import type StoreMaster from '~/types/interfaces/database/SensyCloud/StoreMaster'

const fetchRequest = ref(new UserFetchRequestFactory())
const users = ref<User[]>([])
const userTotal = ref(0)
const userHeaders = [
  { key: 'code', label: '社員番号' },
  { key: 'name', label: '氏名' },
  { key: 'email', label: 'メールアドレス' },
  { key: 'permission', label: '権限' },
  { key: 'storeMasters', label: '所属店舗' },
  { key: 'groupMasters', label: '所属部門' },
  { key: 'isValid', label: '有効区分' },
  { key: 'actions', label: '操作' },
]

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
