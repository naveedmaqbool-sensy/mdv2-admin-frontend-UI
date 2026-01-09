import type SkuMonitoringUnitTypes from '~/types/enums/SkuMonitoringUnitTypes'

interface Request {
  targetUnitType: SkuMonitoringUnitTypes
  targetId: string
  storeId: string
}

export function apiEffectivenessFetchChildTarget(
  request: Request
): Promise<any[] | null> {
  return apiGet('/effectiveness/fetch-child-target', request)
}
