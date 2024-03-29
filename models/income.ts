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

type SubCat = {
    id: string
    name: string
    category: string
}

export class Income {
    constructor(data?: Partial<Income>) {
        Object.assign(this, data)
    }

    id?: string
    description!: string
    account!: Account
    currency!: Currency
    category!: SubCat
    amount!: number
    dateTime!: Timestamp
    createdAt!: Timestamp
    updatedAt?: Timestamp
}

type IncomeConverterType = FirestoreDataConverter<Income>

export const incomeConverter: IncomeConverterType = {
    toFirestore: (data: WithFieldValue<Income>): DocumentData => data,
    fromFirestore: (snap: QueryDocumentSnapshot<DocumentData>): Income =>
        snap.data() as Income,
}
