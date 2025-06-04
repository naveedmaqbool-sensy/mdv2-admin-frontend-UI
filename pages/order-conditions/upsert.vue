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
        <CommonErrorMessages
          :messages="apiValidationError.get('targetSkuIds')"
        />
      </div>
      <div
        v-if="formData.skuUnitType === OrderConditionsUpsertUnitTypes.Multiple"
        class="basis-2/12"
      >
        <CommonFileUploader
          v-model:upload-files="formData.targetSkuCsvFiles"
          :accept-types="[FileTypes.CSV]"
          :file-size-limit="1024 * 1024 * 400"
          :has-error="apiValidationError.exists('targetSkuCsvFiles')"
          has-download-format
          @download-format="downloadSkuFormat"
        />
        <CommonErrorMessages
          :messages="apiValidationError.get('targetSkuCsvFiles')"
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
      <div class="basis-1/12 text-sm font-bold"></div>
      <div
        v-for="(target, index) in formData.targets"
        :key="index"
        class="basis-2/12 p-1 text-center"
      >
        <UButton
          v-if="formData.targets.length > 1"
          color="red"
          @click="removeTarget(index)"
        >
          グループを削除
        </UButton>
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
          :has-error="
            apiValidationError.exists(`targets.${index}.targetStoreCsvFiles`)
          "
          has-download-format
          @download-format="downloadStoreFormat"
        />
        <CommonErrorMessages
          :messages="
            apiValidationError.get(`targets.${index}.targetStoreCsvFiles`)
          "
        />
      </div>
      <div v-if="formData.targets.length < 5" class="basis-1/12 p-2">
        <UButton color="indigo" @click="addStoreGroup">
          グループを追加
        </UButton>
      </div>
    </div>

    <template v-if="formData.targets.length > 0">
      <div
        v-if="
          formData.storeUnitType === OrderConditionsUpsertStoreUnitTypes.All
        "
        class="flex pt-2"
      >
        <div class="basis-1/12 text-sm font-bold"></div>
        <div
          v-for="(target, index) in formData.targets"
          :key="index"
          class="basis-2/12 p-1 text-center"
        >
          <UButton
            v-if="formData.targets.length > 1"
            color="red"
            @click="removeTarget(index)"
          >
            設定を削除
          </UButton>
        </div>
      </div>

      <div class="flex pt-2">
        <div class="basis-1/12 text-sm font-bold">対象期間(from)</div>
        <div
          v-for="(target, index) in formData.targets"
          :key="index"
          class="basis-2/12 p-1"
        >
          <CommonDatepicker
            v-model="target.orderConditionStartDate"
            :has-error="
              apiValidationError.exists(
                'targets.' + index + '.orderConditionStartDate'
              )
            "
          />
          <CommonErrorMessages
            :messages="
              apiValidationError.get(
                'targets.' + index + '.orderConditionStartDate'
              )
            "
          />
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
          <CommonDatepicker
            v-model="target.orderConditionEndDate"
            :has-error="
              apiValidationError.exists(
                'targets.' + index + '.orderConditionEndDate'
              )
            "
          />
          <CommonErrorMessages
            :messages="
              apiValidationError.get(
                'targets.' + index + '.orderConditionEndDate'
              )
            "
          />
        </div>
      </div>

      <div class="flex pt-2">
        <div class="basis-1/12 text-sm font-bold">優先順位</div>
        <div
          v-for="(target, index) in formData.targets"
          :key="index"
          class="basis-2/12 p-1"
        >
          <CommonInput
            v-model="target.orderConditionPriority!"
            type="number"
            :has-error="
              apiValidationError.exists(
                'targets.' + index + '.orderConditionPriority'
              )
            "
          />
          <CommonErrorMessages
            :messages="
              apiValidationError.get(
                'targets.' + index + '.orderConditionPriority'
              )
            "
          />
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
          <CommonErrorMessages
            :messages="
              apiValidationError.get('targets.' + index + '.orderingMethod')
            "
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
          <CommonInput
            v-model="target.leadTimeOnMonday"
            type="number"
            :has-error="
              apiValidationError.exists(
                'targets.' + index + '.leadTimeOnMonday'
              )
            "
          />
          <CommonErrorMessages
            :messages="
              apiValidationError.get('targets.' + index + '.leadTimeOnMonday')
            "
          />
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
          <CommonInput
            v-model="target.leadTimeOnTuesday"
            type="number"
            :has-error="
              apiValidationError.exists(
                'targets.' + index + '.leadTimeOnTuesday'
              )
            "
          />
          <CommonErrorMessages
            :messages="
              apiValidationError.get('targets.' + index + '.leadTimeOnTuesday')
            "
          />
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
          <CommonInput
            v-model="target.leadTimeOnWednesday"
            type="number"
            :has-error="
              apiValidationError.exists(
                'targets.' + index + '.leadTimeOnWednesday'
              )
            "
          />
          <CommonErrorMessages
            :messages="
              apiValidationError.get(
                'targets.' + index + '.leadTimeOnWednesday'
              )
            "
          />
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
          <CommonInput
            v-model="target.leadTimeOnThursday"
            type="number"
            :has-error="
              apiValidationError.exists(
                'targets.' + index + '.leadTimeOnThursday'
              )
            "
          />
          <CommonErrorMessages
            :messages="
              apiValidationError.get('targets.' + index + '.leadTimeOnThursday')
            "
          />
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
          <CommonInput
            v-model="target.leadTimeOnFriday"
            type="number"
            :has-error="
              apiValidationError.exists(
                'targets.' + index + '.leadTimeOnFriday'
              )
            "
          />
          <CommonErrorMessages
            :messages="
              apiValidationError.get('targets.' + index + '.leadTimeOnFriday')
            "
          />
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
          <CommonInput
            v-model="target.leadTimeOnSaturday"
            type="number"
            :has-error="
              apiValidationError.exists(
                'targets.' + index + '.leadTimeOnSaturday'
              )
            "
          />
          <CommonErrorMessages
            :messages="
              apiValidationError.get('targets.' + index + '.leadTimeOnSaturday')
            "
          />
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
          <CommonInput
            v-model="target.leadTimeOnSunday"
            type="number"
            :has-error="
              apiValidationError.exists(
                'targets.' + index + '.leadTimeOnSunday'
              )
            "
          />
          <CommonErrorMessages
            :messages="
              apiValidationError.get('targets.' + index + '.leadTimeOnSunday')
            "
          />
        </div>
      </div>

      <div class="flex pt-2">
        <div class="basis-1/12 text-sm font-bold">発注ロット</div>
        <div
          v-for="(target, index) in formData.targets"
          :key="index"
          class="basis-2/12 p-1"
        >
          <CommonInput
            v-model="target.orderLot"
            type="number"
            :has-error="
              apiValidationError.exists('targets.' + index + '.orderLot')
            "
            @change="onChangedOrderLog(target)"
          />
          <CommonErrorMessages
            :messages="apiValidationError.get('targets.' + index + '.orderLot')"
          />
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
          <CommonErrorMessages
            :messages="
              apiValidationError.get(
                'targets.' + index + '.roundUpDownDefinition'
              )
            "
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
          <CommonInput
            v-model="target.minimumOrderQty"
            type="number"
            :has-error="
              apiValidationError.exists('targets.' + index + '.minimumOrderQty')
            "
          />
          <CommonErrorMessages
            :messages="
              apiValidationError.get('targets.' + index + '.minimumOrderQty')
            "
          />
        </div>
      </div>

      <div class="flex pt-2">
        <div class="basis-1/12 text-sm font-bold">見栄え在庫</div>
        <div
          v-for="(target, index) in formData.targets"
          :key="index"
          class="basis-2/12 p-1"
        >
          <CommonInput
            v-model="target.displayStockQty"
            type="number"
            :has-error="
              apiValidationError.exists('targets.' + index + '.displayStockQty')
            "
          />
          <CommonErrorMessages
            :messages="
              apiValidationError.get('targets.' + index + '.displayStockQty')
            "
          />
        </div>
      </div>

      <div class="flex pt-2">
        <div class="basis-1/12 text-sm font-bold">陳列上限数</div>
        <div
          v-for="(target, index) in formData.targets"
          :key="index"
          class="basis-2/12 p-1"
        >
          <CommonInput
            v-model="target.displayLimitQty"
            type="number"
            :has-error="
              apiValidationError.exists('targets.' + index + '.displayLimitQty')
            "
          />
          <CommonErrorMessages
            :messages="
              apiValidationError.get('targets.' + index + '.displayLimitQty')
            "
          />
        </div>
      </div>

      <div class="flex pt-2">
        <div class="basis-1/12 text-sm font-bold">終売日</div>
        <div
          v-for="(target, index) in formData.targets"
          :key="index"
          class="basis-2/12 p-1"
        >
          <CommonDatepicker
            v-model="target.cutDate"
            :has-error="
              apiValidationError.exists('targets.' + index + '.cutDate')
            "
          />
          <CommonErrorMessages
            :messages="apiValidationError.get('targets.' + index + '.cutDate')"
          />
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
          <CommonErrorMessages
            :messages="
              apiValidationError.get('targets.' + index + '.deliveryType')
            "
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
      initial-state-is-empty
      @fetch-items="fetchSkus"
      @change="onChangedTargetSkus"
    />
  </div>
</template>

<script setup lang="ts">
import {
  OrderConditionsUpsertRequestFactory,
  type OrderConditionsUpsertTarget,
} from '~/composables/api/order-conditions/Upsert'
import type ApiValidationError from '~/types/classes/ApiValidationError'
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
const apiValidationError = ref<ApiValidationError>(
  serviceValidationErrorsInstance()
)

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

async function submit() {
  let hasError = false
  if (
    formData.value.skuUnitType === OrderConditionsUpsertUnitTypes.Multiple &&
    formData.value.targetSkuCsvFiles.length === 0
  ) {
    apiValidationError.value.set(
      'targetSkuCsvFiles',
      '対象SKUを指定してください。'
    )
    hasError = true
  }

  if (
    formData.value.storeUnitType === OrderConditionsUpsertStoreUnitTypes.Group
  ) {
    formData.value.targets.forEach((target, index) => {
      if (target.targetStoreCsvFiles.length === 0) {
        apiValidationError.value.set(
          'targets.' + index + '.targetStoreCsvFiles',
          '対象店舗を指定してください。'
        )
        hasError = true
      }
    })
  }
  if (hasError) {
    return
  }

  // レコードの作成とファイルアップロード用ＵＲＬの発行
  serviceLoadingStart()
  const response = await apiOrderConditionsUpsert(formData.value)

  apiValidationError.value.refresh()
  if (!response) {
    serviceLoadingFinish()
    return
  }

  const { skuUploadUrl, storeUploadUrls, importId } = response

  // 商品ＣＳＶがある場合はアップロードする
  const uploadApi: Promise<any>[] = []
  if (skuUploadUrl) {
    uploadApi.push(
      apiUploadStorageBySignedUrl(
        skuUploadUrl,
        formData.value.targetSkuCsvFiles[0].file
      )
    )
  }

  // 店舗ＣＳＶがある場合はアップロードする
  if (storeUploadUrls.length > 0) {
    storeUploadUrls.forEach((storeUploadUrl, index) => {
      uploadApi.push(
        apiUploadStorageBySignedUrl(
          storeUploadUrl,
          formData.value.targets[index].targetStoreCsvFiles[0].file
        )
      )
    })
  }

  // ファイルアップロードが終わるまで待機
  if (uploadApi.length > 0) {
    try {
      await Promise.all(uploadApi)
    } catch {}
  }
  serviceLoadingFinish()

  // 取り込みの実行命令をサーバに送信
  apiOrderConditionsUpsertExecute({
    id: importId,
  })

  useNuxtApp().$toast.success('更新・登録内容を受け付けました。')
}

async function downloadSkuFormat() {
  serviceLoadingStart()
  await apiOrderConditionsDownloadSkuFormat()
  serviceLoadingFinish()
}

async function downloadStoreFormat() {
  serviceLoadingStart()
  await apiOrderConditionsDownloadStoreFormat()
  serviceLoadingFinish()
}

function removeTarget(index: number) {
  formData.value.targets.splice(index, 1)
}

function onChangedOrderLog(target: OrderConditionsUpsertTarget) {
  // 発注ロットが1ではない場合は切上切下区分をUpにする
  if (target.orderLot === 1) {
    target.roundUpDownDefinition = RoundUpDownTypes.Up
  }
}
</script>

<style scoped></style>
