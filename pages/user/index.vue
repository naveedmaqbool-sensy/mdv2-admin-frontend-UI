<template>
  <div>
    <CommonHeader title="発注修正" />

    <UForm :state="{}">
      <section class="rounded border border-gray-300 p-4">
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
      <section class="pt-2">
        <UButton color="white" @click="reset">リセット</UButton>
        <UButton class="ml-2" color="indigo" @click="fetch(1)">検索</UButton>
      </section>
    </UForm>

    <UTable :rows="users" :columns="userHeaders" />

    <Upagination
      v-model="fetchRequest.page"
      :page-count="fetchRequest.perPage"
      :max="5"
      :total="userTotal"
      @change="fetch(fetchRequest.page)"
    />
  </div>
</template>

<script setup lang="ts">
import type User from '@/types/interfaces/database/User'

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
</script>

<style scoped></style>
