<template>
  <div>
    <CommonHeader title="発注条件マスタ 一括更新登録" />

    <div class="flex pt-2">
      <div class="basis-1/12 text-sm font-bold">SKU設定単位</div>
      <div class="basis-2/12">
        <CommonSelect
          v-model="formData.skuUnitType"
          class="w-full"
          :options="OrderConditionsUpsertUnitTypes.getNameValues()"
          @change="onChangedSkuUnitType"
        />
      </div>
    </div>

    <div class="flex pt-2">
      <div class="basis-1/12 text-sm font-bold">対象SKU</div>
      <div
        v-if="formData.skuUnitType === OrderConditionsUpsertUnitTypes.Single"
        class="basis-11/12"
      >
        <div class="flex">
          <template v-if="formData.targetSkus.length > 0">
            <span>{{ formData.targetSkus[0].skuId }}</span>
            <span class="ml-2">{{ formData.targetSkus[0].skuName }}</span>
          </template>
          <UButton color="indigo" class="ml-2" @click="showSkuModal">
            選択
          </UButton>
        </div>
      </div>
      <div
        v-if="formData.skuUnitType === OrderConditionsUpsertUnitTypes.Multiple"
        class="basis-2/12"
      >
        <CommonFileUploader
          v-model:upload-files="formData.targetSkuCsvFiles"
          :accept-types="[FileTypes.CSV]"
          :file-size-limit="1024 * 1024 * 400"
        />
      </div>
    </div>

    <div class="flex pt-2">
      <div class="basis-1/12 text-sm font-bold">設定単位</div>
      <div class="basis-2/12">
        <CommonSelect
          v-model="formData.storeUnitType"
          class="w-full"
          :options="OrderConditionsUpsertStoreUnitTypes.getNameValues()"
          @change="onChangedStoreUnitType"
        />
      </div>
    </div>

    <div
      v-if="
        formData.storeUnitType === OrderConditionsUpsertStoreUnitTypes.Group
      "
      class="flex pt-2"
    >
      <div class="basis-1/12 text-sm font-bold">店舗グループ</div>
      <div
        v-for="(target, index) in formData.targets"
        :key="index"
        class="basis-2/12 p-1"
      >
        <CommonFileUploader
          v-model:upload-files="target.targetStoreCsvFiles"
          :accept-types="[FileTypes.CSV]"
          :file-size-limit="1024 * 1024 * 10"
        />
      </div>
      <div v-if="formData.targets.length < 5" class="basis-1/12 p-2">
        <UButton color="indigo" @click="addStoreGroup">
          グループを追加
        </UButton>
      </div>
    </div>

    <template v-if="formData.targets.length > 0">
      <div class="flex pt-2">
        <div class="basis-1/12 text-sm font-bold">対象期間(from)</div>
        <div
          v-for="(target, index) in formData.targets"
          :key="index"
          class="basis-2/12 p-1"
        >
          <CommonDatepicker v-model="target.orderConditionStartDate" />
        </div>
        <div
          v-if="
            formData.targets.length < 5 &&
            formData.storeUnitType === OrderConditionsUpsertStoreUnitTypes.All
          "
          class="basis-1/12 p-2"
        >
          <UButton color="indigo" @click="addTarget"> 設定を追加 </UButton>
        </div>
      </div>

      <div class="flex pt-2">
        <div class="basis-1/12 text-sm font-bold">対象期間(to)</div>
        <div
          v-for="(target, index) in formData.targets"
          :key="index"
          class="basis-2/12 p-1"
        >
          <CommonDatepicker v-model="target.orderConditionEndDate" />
        </div>
      </div>

      <div class="flex pt-2">
        <div class="basis-1/12 text-sm font-bold">優先順位</div>
        <div
          v-for="(target, index) in formData.targets"
          :key="index"
          class="basis-2/12 p-1"
        >
          <CommonInput v-model="target.orderConditionPriority!" type="number" />
        </div>
      </div>

      <div class="flex pt-2">
        <div class="basis-1/12 text-sm font-bold">発注方式</div>
        <div
          v-for="(target, index) in formData.targets"
          :key="index"
          class="basis-2/12 p-1"
        >
          <CommonSelect
            v-model="target.orderingMethod"
            :options="OrderingMethodTypes.getNameValues()"
          />
        </div>
      </div>

      <div class="flex pt-2">
        <div class="basis-1/12 text-sm font-bold">リードタイム</div>
      </div>

      <div class="flex pt-2">
        <div class="basis-1/12 pr-10 text-right text-sm font-bold">
          【月曜日】
        </div>
        <div
          v-for="(target, index) in formData.targets"
          :key="index"
          class="basis-2/12 p-1"
        >
          <CommonInput v-model="target.leadTimeOnMonday" type="number" />
        </div>
      </div>

      <div class="flex pt-2">
        <div class="basis-1/12 pr-10 text-right text-sm font-bold">
          【火曜日】
        </div>
        <div
          v-for="(target, index) in formData.targets"
          :key="index"
          class="basis-2/12 p-1"
        >
          <CommonInput v-model="target.leadTimeOnTuesday" type="number" />
        </div>
      </div>

      <div class="flex pt-2">
        <div class="basis-1/12 pr-10 text-right text-sm font-bold">
          【水曜日】
        </div>
        <div
          v-for="(target, index) in formData.targets"
          :key="index"
          class="basis-2/12 p-1"
        >
          <CommonInput v-model="target.leadTimeOnWednesday" type="number" />
        </div>
      </div>

      <div class="flex pt-2">
        <div class="basis-1/12 pr-10 text-right text-sm font-bold">
          【木曜日】
        </div>
        <div
          v-for="(target, index) in formData.targets"
          :key="index"
          class="basis-2/12 p-1"
        >
          <CommonInput v-model="target.leadTimeOnThursday" type="number" />
        </div>
      </div>

      <div class="flex pt-2">
        <div class="basis-1/12 pr-10 text-right text-sm font-bold">
          【金曜日】
        </div>
        <div
          v-for="(target, index) in formData.targets"
          :key="index"
          class="basis-2/12 p-1"
        >
          <CommonInput v-model="target.leadTimeOnFriday" type="number" />
        </div>
      </div>

      <div class="flex pt-2">
        <div class="basis-1/12 pr-10 text-right text-sm font-bold">
          【土曜日】
        </div>
        <div
          v-for="(target, index) in formData.targets"
          :key="index"
          class="basis-2/12 p-1"
        >
          <CommonInput v-model="target.leadTimeOnSaturday" type="number" />
        </div>
      </div>

      <div class="flex pt-2">
        <div class="basis-1/12 pr-10 text-right text-sm font-bold">
          【日曜日】
        </div>
        <div
          v-for="(target, index) in formData.targets"
          :key="index"
          class="basis-2/12 p-1"
        >
          <CommonInput v-model="target.leadTimeOnSunday" type="number" />
        </div>
      </div>

      <div class="flex pt-2">
        <div class="basis-1/12 text-sm font-bold">発注ロット</div>
        <div
          v-for="(target, index) in formData.targets"
          :key="index"
          class="basis-2/12 p-1"
        >
          <CommonInput v-model="target.orderLot" type="number" />
        </div>
      </div>

      <div class="flex pt-2">
        <div class="basis-1/12 text-sm font-bold">切上切下区分</div>
        <div
          v-for="(target, index) in formData.targets"
          :key="index"
          class="basis-2/12 p-1"
        >
          <CommonSelect
            v-model="target.roundUpDownDefinition"
            :options="RoundUpDownTypes.getNameValues()"
            :disabled="target.orderLot === 1"
          />
        </div>
      </div>

      <div class="flex pt-2">
        <div class="basis-1/12 text-sm font-bold">最低発注数量</div>
        <div
          v-for="(target, index) in formData.targets"
          :key="index"
          class="basis-2/12 p-1"
        >
          <CommonInput v-model="target.minimumOrderQty" type="number" />
        </div>
      </div>

      <div class="flex pt-2">
        <div class="basis-1/12 text-sm font-bold">見栄え在庫</div>
        <div
          v-for="(target, index) in formData.targets"
          :key="index"
          class="basis-2/12 p-1"
        >
          <CommonInput v-model="target.displayStockQty" type="number" />
        </div>
      </div>

      <div class="flex pt-2">
        <div class="basis-1/12 text-sm font-bold">陳列上限数</div>
        <div
          v-for="(target, index) in formData.targets"
          :key="index"
          class="basis-2/12 p-1"
        >
          <CommonInput v-model="target.displayLimitQty" type="number" />
        </div>
      </div>

      <div class="flex pt-2">
        <div class="basis-1/12 text-sm font-bold">終売日</div>
        <div
          v-for="(target, index) in formData.targets"
          :key="index"
          class="basis-2/12 p-1"
        >
          <CommonDatepicker v-model="target.cutDate" />
        </div>
      </div>

      <div class="flex pt-2">
        <div class="basis-1/12 text-sm font-bold">納品日判定区分</div>
        <div
          v-for="(target, index) in formData.targets"
          :key="index"
          class="basis-2/12 p-1"
        >
          <CommonSelect
            v-model="target.deliveryType"
            :options="DeliveryDateTypes.getNameValues()"
          />
        </div>
      </div>

      <UButton color="white" @click="reset">リセット</UButton>
      <UButton class="ml-2" color="indigo" @click="submit">更新</UButton>
    </template>

    <MonitoringSelectObjectModal
      v-model:is-open-modal="isOpenSkuModal"
      v-model:selected="formData.targetSkus"
      v-model:items="skus"
      v-model:total="skuTotal"
      is-radio
      :columns="[
        { key: 'groupName', label: '部門' },
        { key: 'departmentName', label: '中分類' },
        { key: 'lineName', label: '小分類' },
        { key: 'className', label: '細分類' },
        { key: 'skuId', label: 'JAN' },
        { key: 'skuName', label: '商品名' },
      ]"
      id-column-name="skuId"
      @fetch-items="fetchSkus"
      @change="onChangedTargetSkus"
    />
  </div>
</template>

<script setup lang="ts">
import { OrderConditionsUpsertRequestFactory } from '~/composables/api/order-conditions/Upsert'
import DeliveryDateTypes from '~/types/enums/DeliveryDateTypes'
import FileTypes from '~/types/enums/FileTypes'
import OrderConditionsUpsertStoreUnitTypes from '~/types/enums/OrderConditionsUpsertStoreUnitTypes'
import OrderConditionsUpsertUnitTypes from '~/types/enums/OrderConditionsUpsertUnitTypes'
import OrderingMethodTypes from '~/types/enums/OrderingMethodTypes'
import RoundUpDownTypes from '~/types/enums/RoundUpTypes'

const isOpenSkuModal = ref(false)
const skus = ref<any[]>([])
const skuTotal = ref(0)
const formData = ref(new OrderConditionsUpsertRequestFactory())

function showSkuModal() {
  isOpenSkuModal.value = true
}

async function fetchSkus(searchRequest: {
  text: string | null
  page: number
  perPage: number
}) {
  serviceLoadingStart()
  const response = await apiSkuMasterFetch(searchRequest)
  skus.value = response?.data ?? []
  skuTotal.value = response?.total ?? 0
  serviceLoadingFinish()
}

function onChangedSkuUnitType() {
  formData.value.targetSkus = []
  formData.value.targetSkuCsvFiles = []
}

function onChangedStoreUnitType() {
  // 設定対象の配列を必ず１つにする
  formData.value.targets = []
  formData.value.targets.push(new OrderConditionsUpsertTargetFactory())
}

function onChangedTargetSkus() {}

function addStoreGroup() {
  formData.value.targets.push(new OrderConditionsUpsertTargetFactory())
}

function addTarget() {
  formData.value.targets.push(new OrderConditionsUpsertTargetFactory())
}

function reset() {
  formData.value = new OrderConditionsUpsertRequestFactory()
}

function submit() {
  serviceLoadingStart()
  apiOrderConditionsUpsert(formData.value)
  serviceLoadingFinish()
}
</script>

<style scoped></style>
