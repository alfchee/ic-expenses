export default function({ store, redirect, route }) {
    // store.state.auth.user != null && router.name == 'login' ? redirect('') : ''
    // store.state.auth.user == null && router.name == ''
    const isLogingPage = route.name === 'login';

    if (!isLogingPage && !store.state.auth.user) {
        return redirect('/login')
    }
}