enum OrderConditionsUpsertStoreUnitTypes {
  All = 1,
  Group,
}

namespace OrderConditionsUpsertStoreUnitTypes {
  export function getName(e: OrderConditionsUpsertStoreUnitTypes) {
    switch (e) {
      case OrderConditionsUpsertStoreUnitTypes.All:
        return '全店'
      case OrderConditionsUpsertStoreUnitTypes.Group:
        return '店舗(グループ)別'
    }
  }

  export function all() {
    return [
      OrderConditionsUpsertStoreUnitTypes.All,
      OrderConditionsUpsertStoreUnitTypes.Group,
    ]
  }

  export function getNameValues() {
    return all().map((v) => {
      return {
        name: `${v}:` + getName(v),
        value: v,
      }
    })
  }
}

export default OrderConditionsUpsertStoreUnitTypes
