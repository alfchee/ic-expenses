import * as firebase from 'firebase/app'
import * as Auth from 'firebase/auth'
import { getApps } from 'firebase/app';
import { firebaseConfig } from '~/firebaseConfig'

// eslint-disable-next-line no-unused-expressions
!getApps().length ? firebase.initializeApp(firebaseConfig) : ''

// export const GoogleProvider = new firebase.auth.GoogleAuthProvider();
export const auth = Auth
export default firebase
