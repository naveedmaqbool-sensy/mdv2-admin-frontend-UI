import { format } from 'date-fns'
import { ja } from 'date-fns/locale'

export const formatterDate = (date?: Date | string | null) => {
  if (!date) return '-'

  return format(date, 'yyyy/MM/dd', { locale: ja })
}
