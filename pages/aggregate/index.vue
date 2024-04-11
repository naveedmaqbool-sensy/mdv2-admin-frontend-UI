<template>
  <div>
    <CommonHeader title="集計画面" />

    <CommonRoundedContainer>
      <template #header>
        <div class="flex w-full">
          <h2 class="flex-1 justify-start font-bold">集計条件</h2>
          <div class="jsutify-end flex-1 text-right">
            <UButton color="indigo" size="xs" @click="isOpenConditions = true">
              条件を変更
            </UButton>
          </div>
        </div>
      </template>
      <template #content>
        {{
          [
            AggregateTypes.getName(aggregateType),
            AggregateUnitTypes.getName(aggregateUnitType),
            SkuAggregateUnitTypes.getName(skuAggregateUnitType),
            StoreAggregateUnitTypes.getName(storeAggregateUnitType),
            StoreAggregateTypes.getName(storeAggregateType),
            AggregateHorizontalAxisTypes.getName(aggregateHorizontalAxisType),
            formatterDate(targetDateFrom) + ' ~ ' + formatterDate(targetDateTo),
          ].join(' / ')
        }}
      </template>
    </CommonRoundedContainer>

    <img src="/img/mock/aggregates.jpg" />

    <USlideover v-model="isOpenConditions">
      <div class="flex-1 p-4">
        <UForm class="space-y-3" @submit="isOpenConditions = false">
          <USelect
            v-model="uiType"
            legend="ＵＩタイプ"
            :options="[
              { value: 1, name: 'ラジオ' },
              { value: 2, name: 'プルダウン' },
            ]"
            option-attribute="name"
            @change="uiType = parseInt(uiType.toString())"
          />
          <UFormGroup label="集計項目">
            <URadioGroup
              v-if="uiType === 1"
              v-model="aggregateType"
              :options="AggregateTypes.getNameValues()"
              option-attribute="name"
            />
            <USelect
              v-else
              v-model="aggregateType"
              :options="AggregateTypes.getNameValues()"
              option-attribute="name"
            />
          </UFormGroup>
          <UFormGroup label="集計単位">
            <URadioGroup
              v-if="uiType === 1"
              v-model="aggregateUnitType"
              :options="AggregateUnitTypes.getNameValues()"
              option-attribute="name"
            />
            <USelect
              v-else
              v-model="aggregateUnitType"
              :options="AggregateUnitTypes.getNameValues()"
              option-attribute="name"
            />
          </UFormGroup>
          <UFormGroup label="商品集計単位">
            <URadioGroup
              v-if="uiType === 1"
              v-model="skuAggregateUnitType"
              :options="SkuAggregateUnitTypes.getNameValues()"
              option-attribute="name"
            />
            <USelect
              v-else
              v-model="skuAggregateUnitType"
              :options="SkuAggregateUnitTypes.getNameValues()"
              option-attribute="name"
            />
          </UFormGroup>
          <UFormGroup label="店舗集計単位">
            <URadioGroup
              v-if="uiType === 1"
              v-model="storeAggregateUnitType"
              :options="StoreAggregateUnitTypes.getNameValues()"
              option-attribute="name"
            />
            <USelect
              v-else
              v-model="storeAggregateUnitType"
              :options="StoreAggregateUnitTypes.getNameValues()"
              option-attribute="name"
            />
          </UFormGroup>
          <UFormGroup label="集計店舗">
            <URadioGroup
              v-if="uiType === 1"
              v-model="storeAggregateType"
              :options="StoreAggregateTypes.getNameValues()"
              option-attribute="name"
            />
            <USelect
              v-else
              v-model="storeAggregateType"
              :options="StoreAggregateTypes.getNameValues()"
              option-attribute="name"
            />
          </UFormGroup>
          <UFormGroup label="横軸">
            <URadioGroup
              v-if="uiType === 1"
              v-model="aggregateHorizontalAxisType"
              :options="AggregateHorizontalAxisTypes.getNameValues()"
              option-attribute="name"
            />
            <USelect
              v-else
              v-model="aggregateHorizontalAxisType"
              :options="AggregateHorizontalAxisTypes.getNameValues()"
              option-attribute="name"
            />
          </UFormGroup>
          <div class="flex items-center space-x-4">
            <UFormGroup label="対象期間 From" class="flex-1">
              <CommonDatepicker v-model="targetDateFrom" />
            </UFormGroup>
            <UFormGroup label="対象期間 To" class="flex-1">
              <CommonDatepicker v-model="targetDateTo" />
            </UFormGroup>
          </div>
        </UForm>
      </div>
    </USlideover>
  </div>
</template>

<script setup lang="ts">
import AggregateTypes from '~/types/enums/AggregateTypes'
import AggregateUnitTypes from '~/types/enums/AggregateUnitTypes'
import AggregateHorizontalAxisTypes from '~/types/enums/AggregateHorizontalAxisTypes'
import SkuAggregateUnitTypes from '~/types/enums/SkuAggregateUnitTypes'
import StoreAggregateTypes from '~/types/enums/StoreAggregateTypes'
import StoreAggregateUnitTypes from '~/types/enums/StoreAggregateUnitTypes'

const isOpenConditions = ref(true)
const aggregateType = ref(AggregateTypes.OrderPty)
const aggregateUnitType = ref(AggregateUnitTypes.Sku)
const aggregateHorizontalAxisType = ref(AggregateHorizontalAxisTypes.Daily)
const skuAggregateUnitType = ref(SkuAggregateUnitTypes.Sku)
const storeAggregateType = ref(StoreAggregateTypes.All)
const storeAggregateUnitType = ref(StoreAggregateUnitTypes.Store)
const targetDateFrom = ref(new Date())
const targetDateTo = ref(new Date())
const uiType = ref(1)

watch(isOpenConditions, (value) => {
  if (!value) {
    // FIXME: rfukuma 集計開始
  }
})
</script>

<style scoped></style>
