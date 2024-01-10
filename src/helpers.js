export const toPascalCase = (sliceName) => {
  const arr = sliceName.split('-')
  let result = ''
  arr.forEach((el) => {
    result += el.charAt(0).toUpperCase() + el.slice(1)
  })
  return result
}
export const toCamelCase = (kebabCaseString) => {
  return kebabCaseString.replace(/-([a-z])/g, (_, letter) =>
    letter.toUpperCase()
  )
}
export const toKebabCase = (inputString) => {
  return inputString.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
}
