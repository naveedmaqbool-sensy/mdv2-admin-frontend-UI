<template>
  <div>
    <CommonHeader title="発注条件マスタ 編集" />

    <UForm :state="orderCondition" @submit="onSubmit">
      <div class="flex">
        <UFormGroup label="店舗" class="basis-2/12 pr-5">
          <span class="text-sm">
            {{ orderCondition.storeMaster?.storeName }}
          </span>
        </UFormGroup>
        <UFormGroup label="JAN" class="basis-1/12 pr-5">
          <span class="text-sm">
            {{ orderCondition.storeSkuMaster?.janCode }}
          </span>
        </UFormGroup>
        <UFormGroup label="部門" class="basis-1/12 pr-5">
          <span class="text-sm">
            {{ orderCondition.storeSkuMaster?.groupMaster?.groupName }}
          </span>
        </UFormGroup>
        <UFormGroup label="中分類" class="basis-1/12 pr-5">
          <span class="text-sm">
            {{
              orderCondition.storeSkuMaster?.departmentMaster?.departmentName
            }}
          </span>
        </UFormGroup>
        <UFormGroup label="小分類" class="basis-1/12 pr-5">
          <span class="text-sm">
            {{ orderCondition.storeSkuMaster?.lineMaster?.lineName }}
          </span>
        </UFormGroup>
        <UFormGroup label="細分類" class="basis-1/12 pr-5">
          <span class="text-sm">
            {{ orderCondition.storeSkuMaster?.classMaster?.className }}
          </span>
        </UFormGroup>
        <UFormGroup label="商品名" class="basis-5/12 pr-5">
          <span class="text-sm">
            {{ orderCondition.storeSkuMaster?.skuName }}
          </span>
        </UFormGroup>
      </div>
      <div class="flex pt-5">
        <UFormGroup label="対象期間（開始）" class="basis-2/12 pr-5" required>
          <CommonDatepicker
            v-model="orderCondition.orderConditionStartDate"
            :has-error="apiValidationError.exists('orderConditionStartDate')"
          />
        </UFormGroup>
        <UFormGroup label="対象期間（終了）" class="basis-2/12 pr-5" required>
          <CommonDatepicker
            v-model="orderCondition.orderConditionEndDate"
            :has-error="apiValidationError.exists('orderConditionEndDate')"
          />
        </UFormGroup>
        <UFormGroup label="優先度" class="basis-1/12 pr-5" required>
          <CommonInput
            v-model="orderCondition.orderConditionPriority"
            type="number"
            :has-error="apiValidationError.exists('orderConditionPriority')"
          />
        </UFormGroup>
      </div>
      <CommonErrorMessages
        :messages="
          apiValidationError.get([
            'orderConditionStartDate',
            'orderConditionEndDate',
            'orderConditionPriority',
          ]) as string[]
        "
      />
      <div class="flex pt-5">
        <UFormGroup label="発注方式" class="basis-2/12 pr-5">
          <CommonSelect
            v-model:selected="orderCondition.orderingMethod"
            class="w-full"
            :options="OrderingMethodTypes.getNameValues()"
          />
        </UFormGroup>
        <UFormGroup label="切上切下げ区分" class="basis-2/12 pr-5">
          <CommonSelect
            v-model:selected="orderCondition.roundUpDownDefinition"
            class="w-full"
            :options="RoundUpDownTypes.getNameValues()"
          />
        </UFormGroup>
        <UFormGroup label="納品区分" class="basis-4/12 pr-5">
          <CommonSelect
            v-model:selected="orderCondition.deliveryType"
            class="w-full"
            :options="DeliveryDateTypes.getNameValues()"
          />
        </UFormGroup>
      </div>
      <CommonErrorMessages
        :messages="
          apiValidationError.get([
            'orderingMethod',
            'roundUpDownDefinition',
            'deliveryType',
          ]) as string[]
        "
      />
      <div class="flex pt-5">
        <UFormGroup label="月曜LT" class="basis-1/12 pr-5">
          <CommonInput
            v-model="orderCondition.leadTimeOnMonday!"
            type="number"
            :has-error="apiValidationError.exists('leadTimeOnMonday')"
          />
        </UFormGroup>
        <UFormGroup label="火曜LT" class="basis-1/12 pr-5">
          <CommonInput
            v-model="orderCondition.leadTimeOnTuesday!"
            type="number"
            :has-error="apiValidationError.exists('leadTimeOnTuesday')"
          />
        </UFormGroup>
        <UFormGroup label="水曜LT" class="basis-1/12 pr-5">
          <CommonInput
            v-model="orderCondition.leadTimeOnWednesday!"
            type="number"
            :has-error="apiValidationError.exists('leadTimeOnWednesday')"
          />
        </UFormGroup>
        <UFormGroup label="木曜LT" class="basis-1/12 pr-5">
          <CommonInput
            v-model="orderCondition.leadTimeOnThursday!"
            type="number"
            :has-error="apiValidationError.exists('leadTimeOnThursday')"
          />
        </UFormGroup>
        <UFormGroup label="金曜LT" class="basis-1/12 pr-5">
          <CommonInput
            v-model="orderCondition.leadTimeOnFriday!"
            type="number"
            :has-error="apiValidationError.exists('leadTimeOnFriday')"
          />
        </UFormGroup>
        <UFormGroup label="土曜LT" class="basis-1/12 pr-5">
          <CommonInput
            v-model="orderCondition.leadTimeOnSaturday!"
            type="number"
            :has-error="apiValidationError.exists('leadTimeOnSaturday')"
          />
        </UFormGroup>
        <UFormGroup label="日曜LT" class="basis-1/12 pr-5">
          <CommonInput
            v-model="orderCondition.leadTimeOnSunday!"
            type="number"
            :has-error="apiValidationError.exists('leadTimeOnSunday')"
          />
        </UFormGroup>
      </div>
      <CommonErrorMessages
        :messages="
          apiValidationError.get([
            'leadTimeOnMonday',
            'leadTimeOnTuesday',
            'leadTimeOnWednesday',
            'leadTimeOnThursday',
            'leadTimeOnFriday',
            'leadTimeOnSaturday',
            'leadTimeOnSunday',
          ]) as string[]
        "
      />
      <div class="flex pt-5">
        <UFormGroup label="ロット数" class="basis-1/12 pr-5">
          <CommonInput
            v-model="orderCondition.orderLot!"
            type="number"
            :has-error="apiValidationError.exists('orderLot')"
          />
        </UFormGroup>
        <UFormGroup label="最低発注数" class="basis-1/12 pr-5">
          <CommonInput
            v-model="orderCondition.minimumOrderQty!"
            type="number"
            :has-error="apiValidationError.exists('minimumOrderQty')"
          />
        </UFormGroup>
        <UFormGroup
          :label="$config.public.displayStockName"
          class="basis-1/12 pr-5"
        >
          <CommonInput
            v-model="orderCondition.displayStockQty!"
            type="number"
            :has-error="apiValidationError.exists('displayStockQty')"
          />
        </UFormGroup>
        <UFormGroup label="陳列上限在庫" class="basis-1/12 pr-5">
          <CommonInput
            v-model="orderCondition.displayLimitQty!"
            type="number"
            :has-error="apiValidationError.exists('displayLimitQty')"
          />
        </UFormGroup>
      </div>
      <CommonErrorMessages
        :messages="
          apiValidationError.get([
            'orderLot',
            'minimumOrderQty',
            'displayStockQty',
            'displayLimitQty',
          ]) as string[]
        "
      />
      <div class="flex pt-5">
        <UFormGroup label="終売日" class="basis-2/12 pr-5">
          <CommonDatepicker
            v-model="orderCondition.cutDate"
            :has-error="apiValidationError.exists('cutDate')"
          />
        </UFormGroup>
      </div>
      <CommonErrorMessages
        :messages="apiValidationError.get(['cutDate']) as string[]"
      />

      <UButton color="white" @click="onCancel">戻る</UButton>
      <UButton color="indigo" class="ml-5" @click="onSubmit">保存</UButton>
    </UForm>
  </div>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from '#ui/types'
import type ApiValidationError from '~/types/classes/ApiValidationError'
import DeliveryDateTypes from '~/types/enums/DeliveryDateTypes'
import OrderingMethodTypes from '~/types/enums/OrderingMethodTypes'
import RoundUpDownTypes from '~/types/enums/RoundUpTypes'
import type OrderConditionsMaster from '~/types/interfaces/database/OrderConditionsMaster'

const apiValidationError = ref<ApiValidationError>(
  serviceValidationErrorsInstance()
)

const orderConditionId = Number(useRoute().params.id.toString())
const orderConditionFindResponse = await apiOrderConditionsFind({
  orderConditionId,
})
if (!orderConditionFindResponse) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Not Found',
  })
}
const orderCondition = ref<OrderConditionsMaster>(orderConditionFindResponse)

function onCancel() {
  navigateTo('/order-conditions')
}

async function onSubmit(_event: FormSubmitEvent<OrderConditionsMaster>) {
  serviceLoadingStart()
  const response = await apiOrderConditionsUpdate(orderCondition.value)
  serviceLoadingFinish()
  apiValidationError.value.refresh()

  if (!response) {
    return
  }

  useNuxtApp().$toast.success('入力内容を保存しました。')
}
</script>

<style scoped></style>
