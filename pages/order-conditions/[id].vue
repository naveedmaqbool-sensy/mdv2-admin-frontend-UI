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
        <UFormGroup label="対象期間（開始）" class="basis-2/12 pr-5">
          <CommonDatepicker v-model="orderCondition.orderConditionStartDate" />
        </UFormGroup>
        <UFormGroup label="対象期間（終了）" class="basis-2/12 pr-5">
          <CommonDatepicker v-model="orderCondition.orderConditionEndDate" />
        </UFormGroup>
        <UFormGroup label="優先度" class="basis-1/12 pr-5">
          <UInput
            v-model="orderCondition.orderConditionPriority"
            type="number"
          />
        </UFormGroup>
      </div>
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
      <div class="flex pt-5">
        <UFormGroup label="月曜LT" class="basis-1/12 pr-5">
          <UInput v-model="orderCondition.leadTimeOnMonday!" type="number" />
        </UFormGroup>
        <UFormGroup label="火曜LT" class="basis-1/12 pr-5">
          <UInput v-model="orderCondition.leadTimeOnTuesday!" type="number" />
        </UFormGroup>
        <UFormGroup label="水曜LT" class="basis-1/12 pr-5">
          <UInput v-model="orderCondition.leadTimeOnWednesday!" type="number" />
        </UFormGroup>
        <UFormGroup label="木曜LT" class="basis-1/12 pr-5">
          <UInput v-model="orderCondition.leadTimeOnThursday!" type="number" />
        </UFormGroup>
        <UFormGroup label="金曜LT" class="basis-1/12 pr-5">
          <UInput v-model="orderCondition.leadTimeOnFriday!" type="number" />
        </UFormGroup>
        <UFormGroup label="土曜LT" class="basis-1/12 pr-5">
          <UInput v-model="orderCondition.leadTimeOnSaturday!" type="number" />
        </UFormGroup>
        <UFormGroup label="日曜LT" class="basis-1/12 pr-5">
          <UInput v-model="orderCondition.leadTimeOnSunday!" type="number" />
        </UFormGroup>
      </div>
      <div class="flex pt-5">
        <UFormGroup label="ロット数" class="basis-1/12 pr-5">
          <UInput v-model="orderCondition.orderLot!" type="number" />
        </UFormGroup>
        <UFormGroup label="最低発注数" class="basis-1/12 pr-5">
          <UInput v-model="orderCondition.minimumOrderQty!" type="number" />
        </UFormGroup>
        <UFormGroup
          :label="$config.public.displayStockName"
          class="basis-1/12 pr-5"
        >
          <UInput v-model="orderCondition.displayStockQty!" type="number" />
        </UFormGroup>
        <UFormGroup label="陳列上限在庫" class="basis-1/12 pr-5">
          <UInput v-model="orderCondition.displayLimitQty!" type="number" />
        </UFormGroup>
      </div>
      <div class="flex pt-5">
        <UFormGroup label="終売日" class="basis-2/12 pr-5">
          <CommonDatepicker v-model="orderCondition.cutDate" />
        </UFormGroup>
      </div>

      <UButton color="white" @click="onCancel">戻る</UButton>
      <UButton color="indigo" class="ml-5" @click="onSubmit">保存</UButton>
    </UForm>
  </div>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from '#ui/types'
import DeliveryDateTypes from '~/types/enums/DeliveryDateTypes'
import OrderingMethodTypes from '~/types/enums/OrderingMethodTypes'
import RoundUpDownTypes from '~/types/enums/RoundUpTypes'
import type OrderConditionsMaster from '~/types/interfaces/database/OrderConditionsMaster'

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
  const response = await apiOrderConditionsUpdate(orderCondition.value)

  if (!response) {
    return
  }

  useNuxtApp().$toast.success('入力内容を保存しました。')
}
</script>

<style scoped></style>
