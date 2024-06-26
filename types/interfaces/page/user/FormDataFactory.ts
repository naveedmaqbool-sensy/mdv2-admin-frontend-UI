import type UserFormData from './FormData'

export default class UserFormDataFactory implements UserFormData {
  // eslint-disable-next-line no-useless-constructor
  public constructor(public text: string | null = null) {}
}
