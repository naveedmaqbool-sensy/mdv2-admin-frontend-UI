<template>
  <div>
    <CommonHeader :title="title" />

    <UForm :state="{}" @submit="onSave">
      <section class="rounded border border-gray-300 p-4">
        <div class="flex flex-row">
          <div class="my-auto basis-2/12 text-right">
            <label class="pr-2 font-bold">社員番号</label>
          </div>
          <div class="basis-3/12">
            <UInput v-model="user.code" />
          </div>
        </div>
        <div v-if="apiValidationError.exists('code')" class="flex flex-row">
          <div class="basis-2/12"></div>
          <div class="basis-10/12">
            <p class="text-red-500">{{ apiValidationError.first('code') }}</p>
          </div>
        </div>

        <div class="flex flex-row pt-2">
          <div class="my-auto basis-2/12 text-right">
            <label class="pr-2 font-bold">パスワード</label>
          </div>
          <div class="basis-3/12">
            <UInput v-model="user.password" type="password" />
          </div>
        </div>
        <div class="flex flex-row pt-2">
          <div class="my-auto basis-2/12 text-right">
            <label class="pr-2 font-bold">確認用パスワード</label>
          </div>
          <div class="basis-3/12">
            <UInput v-model="confirmedPassword" type="password" />
          </div>
        </div>
        <div v-if="apiValidationError.exists('password')" class="flex flex-row">
          <div class="basis-2/12"></div>
          <div class="basis-10/12">
            <p class="text-red-500">
              {{ apiValidationError.first('password') }}
            </p>
          </div>
        </div>

        <div class="flex flex-row pt-2">
          <div class="my-auto basis-2/12 text-right">
            <label class="pr-2 font-bold">氏名</label>
          </div>
          <div class="basis-3/12">
            <UInput v-model="user.name" />
          </div>
        </div>
        <div v-if="apiValidationError.exists('name')" class="flex flex-row">
          <div class="basis-2/12"></div>
          <div class="basis-10/12">
            <p class="text-red-500">{{ apiValidationError.first('name') }}</p>
          </div>
        </div>

        <div class="flex flex-row pt-2">
          <div class="my-auto basis-2/12 text-right">
            <label class="pr-2 font-bold">権限</label>
          </div>
          <div class="basis-2/12">
            <CommonSelect
              v-model:selected="user.permission"
              class="w-full"
              :options="UserPermissionTypes.getNameValues()"
            />
          </div>
        </div>
        <div
          v-if="apiValidationError.exists('permission')"
          class="flex flex-row"
        >
          <div class="basis-2/12"></div>
          <div class="basis-10/12">
            <p class="text-red-500">
              {{ apiValidationError.first('permission') }}
            </p>
          </div>
        </div>

        <div class="flex flex-row pt-2">
          <div class="my-auto basis-2/12 text-right">
            <label class="pr-2 font-bold">有効区分</label>
          </div>
          <div class="basis-2/12">
            <CommonSelect
              v-model="user.isValid"
              class="w-full"
              :options="[
                { value: true, name: '有効' },
                { value: false, name: '無効' },
              ]"
            />
          </div>
        </div>
        <div v-if="apiValidationError.exists('isValid')" class="flex flex-row">
          <div class="basis-2/12"></div>
          <div class="basis-10/12">
            <p class="text-red-500">
              {{ apiValidationError.first('isValid') }}
            </p>
          </div>
        </div>
      </section>

      <div class="pt-2">
        <UButton color="white" @click="back">戻る</UButton>
        <UButton class="ml-2" @click="onSave">保存</UButton>
      </div>
    </UForm>
  </div>
</template>

<script setup lang="ts">
import ApiValidationError from '~/types/classes/ApiValidationError'
import UserPermissionTypes from '~/types/enums/UserPermissionTypes'
import type User from '~/types/interfaces/database/User'
import UserFactory from '~/types/interfaces/database/UserFactory'

const confirmedPassword = ref('')
const userId = useRoute().params.id.toString()
const isCreate = computed(() => {
  return userId === 'create'
})

const title = computed(() => {
  return isCreate.value ? 'ユーザー登録' : 'ユーザー編集'
})

const user = ref<User>(new UserFactory())
const apiValidationError = ref<ApiValidationError>(
  serviceValidationErrorsInstance()
)
if (isCreate.value === false) {
  const response = await apiUserFind(Number(userId))
  if (!response) {
    throw createError({ statusCode: 404, statusMessage: 'Not Found' })
  }
  user.value = response
}

function back() {
  useRouter().back()
}

async function onSave() {
  if (user.value.password && user.value.password !== confirmedPassword.value) {
    apiValidationError.value.set('password', 'パスワードが一致しません。')
    return
  }

  serviceLoadingStart()
  const response = await apiUserSave(user.value)
  serviceLoadingFinish()
  apiValidationError.value.refresh()

  if (!response) {
    return
  }

  useNuxtApp().$toast.success('保存しました。')
}
</script>

<style scoped></style>
