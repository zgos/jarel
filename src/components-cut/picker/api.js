import createAPI from 'utils/helpers/create-api'

export default function addPicker (Vue, Picker) {
  createAPI(Vue, Picker, ['select', 'value-change', 'cancel', 'change'])
}
