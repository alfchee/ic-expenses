import VuexPersistence from 'vuex-persist'

export default ({ store }) => {
  new VuexPersistence({
    key: 'vuex',
    modules: ['auth'],
  }).plugin(store)
}
