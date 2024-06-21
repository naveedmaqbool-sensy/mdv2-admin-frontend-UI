import { addDays, endOfWeek, startOfWeek } from 'date-fns'
import type FormData from './FormData'

export default class FormDataFactory implements FormData {
  public from!: Date
  public to!: Date

  // eslint-disable-next-line no-useless-constructor
  constructor(from: Date | null = null, to: Date | null = null) {
    this.from = from || addDays(startOfWeek(new Date()), 1)
    this.to = to || addDays(endOfWeek(new Date()), 1)
  }
}
