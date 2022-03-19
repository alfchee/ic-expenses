import {
    QueryDocumentSnapshot,
    DocumentData,
    FirestoreDataConverter,
    WithFieldValue,
} from 'firebase/firestore'
import { CurrencyCode } from './currencies'

export class Account {
    constructor(data?: Partial<Account>) {
        Object.assign(this, data)
    }

    id?: string
    name!: string
    description!: string
    currency!: CurrencyCode

    toObject(): Object {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            currency: this.currency,
        }
    }
}

type AccountConverterType = FirestoreDataConverter<Account>

export const accountsConverter: AccountConverterType = {
    toFirestore: (data: WithFieldValue<Account>): DocumentData => data,
    fromFirestore: (snap: QueryDocumentSnapshot<DocumentData>): Account =>
        snap.data() as Account,
}
