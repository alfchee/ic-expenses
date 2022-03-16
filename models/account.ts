import {
  QueryDocumentSnapshot,
  DocumentData,
  FirestoreDataConverter,
  WithFieldValue,
} from 'firebase/firestore'

export class Account {
  constructor(data?: Partial<Account>) {
    Object.assign(this, data)
  }

  id!: string
  name: string | undefined
  description?: string
}

type AccountConverterType = FirestoreDataConverter<Account>

export const accountsConverter: AccountConverterType = {
  toFirestore: (data: WithFieldValue<Account>): DocumentData => data,
  fromFirestore: (snap: QueryDocumentSnapshot<DocumentData>): Account =>
    snap.data() as Account,
}
