import { format } from 'date-fns'
import { ja } from 'date-fns/locale'

export const formatterDateOnly = (date?: Date | string | null) => {
  if (!date) return '-'

  return format(date, 'd', { locale: ja })
}
