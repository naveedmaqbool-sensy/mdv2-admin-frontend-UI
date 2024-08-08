import { addDays, endOfWeek, startOfWeek } from 'date-fns'
import type AlertFormData from './FormData'

export default class AlertFormDataFactory implements AlertFormData {
  public from!: Date
  public to!: Date

  public constructor(from: Date | null = null, to: Date | null = null) {
    this.from = from || addDays(startOfWeek(new Date()), 1)
    this.to = to || addDays(endOfWeek(new Date()), 1)
  }
}
