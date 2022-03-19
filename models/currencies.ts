export enum CurrencyCode {
  USD = 'USD',
  CAS = 'CAS',
  EURO = 'EURO',
  AUD = 'AUD',
  CLP = 'CLP',
  CNY = 'CNY',
  COP = 'COP',
  CRC = 'CRC',
  GTQ = 'GTQ',
  HNL = 'HNL',
  JPY = 'JPY',
  MXN = 'MXN',
  NIO = 'NIO',
  PAB = 'PAB',
}

export class Currency {
  constructor(data?: Partial<Currency>) {
    Object.assign(this, data)
  }

  name: string | undefined
  symbol: string | undefined
  code: CurrencyCode | undefined
}

export const currencies: Currency[] = [
  {
    name: 'Nicaraguan Córdoba',
    symbol: 'C$',
    code: CurrencyCode.NIO,
  },
  {
    name: 'US Dollar',
    symbol: '$',
    code: CurrencyCode.USD,
  },
  {
    name: 'Canadian Dollar',
    symbol: 'CA$',
    code: CurrencyCode.CAS,
  },
  {
    name: 'Euro',
    symbol: '€',
    code: CurrencyCode.EURO,
  },
  {
    name: 'Australian Dollar',
    symbol: 'AU$',
    code: CurrencyCode.AUD,
  },
  {
    name: 'Chilean Peso',
    symbol: 'CL$',
    code: CurrencyCode.CLP,
  },
  {
    name: 'Chinese Yuan',
    symbol: 'CN¥',
    code: CurrencyCode.CNY,
  },
  {
    name: 'Colombian Peso',
    symbol: 'CO$',
    code: CurrencyCode.COP,
  },
  {
    name: 'Costa Rican Colón',
    symbol: '₡',
    code: CurrencyCode.CRC,
  },
  {
    name: 'Guatemalan Quetzal',
    symbol: 'GTQ',
    code: CurrencyCode.GTQ,
  },
  {
    name: 'Honduran Lempira',
    symbol: 'HNL',
    code: CurrencyCode.HNL,
  },
  {
    name: 'Japanese Yen',
    symbol: '¥',
    code: CurrencyCode.JPY,
  },
  {
    name: 'Mexican Peso',
    symbol: 'MX$',
    code: CurrencyCode.MXN,
  },
  {
    name: 'Panamanian Balboa',
    symbol: 'B/.',
    code: CurrencyCode.PAB,
  },
]
