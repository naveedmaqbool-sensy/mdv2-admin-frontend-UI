import { format } from 'date-fns'
import { ja } from 'date-fns/locale'

export const formatterDayOnly = (date?: Date | string | null) => {
  if (!date) return '-'

  return format(date, 'E', { locale: ja })
}
