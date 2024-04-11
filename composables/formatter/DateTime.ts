import { format } from 'date-fns'
import { ja } from 'date-fns/locale'

export const formatterDateTime = (date?: Date | string | null) => {
  if (!date) return '-'

  return format(date, 'yyyy/MM/dd HH:mm', { locale: ja })
}
