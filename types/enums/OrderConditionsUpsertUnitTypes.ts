enum OrderConditionsUpsertUnitTypes {
  Single = 1,
  Multiple,
}

namespace OrderConditionsUpsertUnitTypes {
  export function getName(e: OrderConditionsUpsertUnitTypes) {
    switch (e) {
      case OrderConditionsUpsertUnitTypes.Single:
        return '単品'
      case OrderConditionsUpsertUnitTypes.Multiple:
        return 'CSV一括'
    }
  }

  export function all() {
    return [
      OrderConditionsUpsertUnitTypes.Single,
      OrderConditionsUpsertUnitTypes.Multiple,
    ]
  }

  export function getNameValues() {
    return all().map((v) => {
      return {
        name: getName(v),
        value: v,
      }
    })
  }
}

export default OrderConditionsUpsertUnitTypes
