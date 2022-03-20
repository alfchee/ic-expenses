import {
    collection,
    getDocs,
    doc,
    updateDoc,
    deleteDoc,
    addDoc,
} from 'firebase/firestore'
import { db } from '~/services/fireinit'
import {
    SubCategory,
    Category,
    subCategoryConverter,
} from '~/models/sub-category'

export const state = () => ({
    categories: [
        {
            text: 'Evangelism',
            value: Category.evangelism,
        },
        {
            text: 'Edificación',
            value: Category.edificacion,
        },
        {
            text: 'Benevolence',
            value: Category.benevolence,
        },
    ],
    subcategories: [],
})

export const mutations = {
    setSubCategories(state: any, subcats: SubCategory[]) {
        for (const subcat of subcats) {
            state.subcategories.push(subcat)
        }
    },
    setSubcategory(state: any, subcat: SubCategory) {
        const found = state.subcategories.find(
            (i: SubCategory) => i.id === subcat.id
        )
        if (found) {
            Object.assign(found, subcat)
        } else {
            state.subcategories.push(subcat)
        }
    },
    deleteSubCategory(state: any, subcat: SubCategory) {
        state.subcategories = state.subcategories.filter(
            (i: SubCategory) => i.id !== subcat.id
        )
    },
    clearSubCats(state: any) {
        state.subcategories = []
    },
}

export const actions = {
    clear({ commit }: any) {
        commit('clearSubCats')
    },
    async fetchSubCategories({ commit }: any) {
        const firestore = db.getFirestore()
        const querySnapshot = await getDocs(collection(firestore, 'subcats'))
        const subcats = querySnapshot.docs.map((doc) => {
            return { id: doc.id, ...doc.data() } as SubCategory
        })

        commit('setSubCategories', subcats)
    },

    async addSubCategory({ commit }: any, subcat: SubCategory) {
        const firestore = db.getFirestore()
        const newSubCat = await (
            await addDoc(collection(firestore, 'subcats'), subcat)
        ).withConverter(subCategoryConverter)

        commit(
            'setSubcategory',
            new SubCategory({ ...subcat, id: newSubCat.id })
        )
    },

    async updateSuCat({ commit }: any, subcat: SubCategory) {
        const firestore = db.getFirestore()
        const subcatRef = doc(firestore, 'subcats', subcat.id!).withConverter(
            subCategoryConverter
        )

        await updateDoc(subcatRef, subcat)
        commit('setSubcategory', subcat)
    },

    async deleteSubCat({ commit }: any, subcat: SubCategory) {
        const firestore = db.getFirestore()
        await deleteDoc(doc(firestore, 'subcats', subcat.id!))

        commit('deleteSubCategory', subcat)
    },
}
