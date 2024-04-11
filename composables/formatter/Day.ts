import { format } from 'date-fns'
import { ja } from 'date-fns/locale'

export const formatterDay = (date?: Date | string | null) => {
  if (!date) return '-'

  return (
    format(date, 'd', { locale: ja }) +
    ' ' +
    format(date, '(E)', { locale: ja })
  )
}
