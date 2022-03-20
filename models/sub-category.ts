import {
    QueryDocumentSnapshot,
    DocumentData,
    FirestoreDataConverter,
    WithFieldValue,
} from 'firebase/firestore'

export enum Category {
    evangelism = 'evangelism',
    benevolence = 'benevolence',
    edificacion = 'edificacion',
}

export class SubCategory {
    constructor(data?: Partial<SubCategory>) {
        Object.assign(this, data)
    }

    id?: string
    category!: Category
    name!: string
}

type SubCategoryConverterType = FirestoreDataConverter<SubCategory>

export const subCategoryConverter: SubCategoryConverterType = {
    toFirestore: (data: WithFieldValue<SubCategory>): DocumentData => data,
    fromFirestore: (snap: QueryDocumentSnapshot<DocumentData>): SubCategory =>
        snap.data() as SubCategory,
}
