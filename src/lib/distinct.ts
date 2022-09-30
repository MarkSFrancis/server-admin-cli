export function distinct<T>(distinctValues: T[], currentValue: T) {
  if (!distinctValues.includes(currentValue)) {
    return [...distinctValues, currentValue]
  } else {
    return distinctValues
  }
}
