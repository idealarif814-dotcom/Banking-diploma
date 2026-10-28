const BN_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯']

export function toBnDigits(value: number | string): string {
  return String(value).replace(/[0-9]/g, (d) => BN_DIGITS[Number(d)])
}

export function toEnDigits(value: string): string {
  return value.replace(/[০-৯]/g, (d) => String(BN_DIGITS.indexOf(d)))
}

const bnNumber = new Intl.NumberFormat('en-IN')

export function formatBnNumber(value: number): string {
  return toBnDigits(bnNumber.format(value))
}
