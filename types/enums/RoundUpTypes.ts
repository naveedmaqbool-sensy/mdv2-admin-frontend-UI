enum RoundUpDownTypes {
  Up = 1,
  Down = 2,
}
namespace RoundUpDownTypes {
  export function getName(type: RoundUpDownTypes) {
    switch (type) {
      case RoundUpDownTypes.Up:
        return '切上げ'
      case RoundUpDownTypes.Down:
        return '切下げ'
    }
  }

  export function all() {
    return [RoundUpDownTypes.Up, RoundUpDownTypes.Down]
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

export default RoundUpDownTypes
