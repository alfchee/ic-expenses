import {
    QueryDocumentSnapshot,
    DocumentData,
    FirestoreDataConverter,
    WithFieldValue,
    Timestamp,
} from 'firebase/firestore'

type Account = {
    id: string
    name: string
}

type Currency = {
    code: string
    symbol: string
}

export class MonthEnd {
    constructor(data?: Partial<MonthEnd>) {
        Object.assign(this, data)
    }

    id?: string
    month!: string
    monthDate!: Timestamp
    account!: Account
    currency!: Currency
    incomes!: number
    expenses!: number
    balance!: number
    manual?: boolean
    reason?: string
    createdAt!: Timestamp
    updatedAt?: Timestamp
}

type MonthEndConverterType = FirestoreDataConverter<MonthEnd>

export const monthEndConverter: MonthEndConverterType = {
    toFirestore: (data: WithFieldValue<MonthEnd>): DocumentData => data,
    fromFirestore: (snap: QueryDocumentSnapshot<DocumentData>): MonthEnd =>
        snap.data() as MonthEnd,
}
