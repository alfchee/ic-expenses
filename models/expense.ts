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

export class Expense {
    constructor(data?: Partial<Expense>) {
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

type ExpenseConverterType = FirestoreDataConverter<Expense>

export const expenseConverter: ExpenseConverterType = {
    toFirestore: (data: WithFieldValue<Expense>): DocumentData => data,
    fromFirestore: (snap: QueryDocumentSnapshot<DocumentData>): Expense =>
        snap.data() as Expense,
}
