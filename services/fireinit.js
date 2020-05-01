import * as firebase from 'firebase/app'
import 'firebase/auth'

var config = {
    apiKey: 'AIzaSyBvY08wKUp9DMQJ4y9s_tpioux-1gDMivE',
    authDomain: 'bisca-online.firebaseapp.com',
    databaseURL: 'https://bisca-online.firebaseio.com/',
    projectId: 'bisca-online'
}

!firebase.apps.length ? firebase.initializeApp(config) : ''
export const auth = firebase.auth()
export const provider =  new firebase.auth.GoogleAuthProvider() 
export default firebase