import * as Yup from 'yup'

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

const phone_number = Yup.string()
  .required('required')
  .matches(phoneRegExp, 'Phone number is not valid')
  .min(10, 'Phone number is too short')
  .max(10, 'Phone number is too long')

export const validatePhoneNumber = (num: string) => {
  try {
    phone_number.validateSync(num)
    return undefined
  } catch (err: unknown) {
    const error = (err as Yup.ValidationError).message
    return error
  }
}
