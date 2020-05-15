import * as firebase from 'firebase/app'
import 'firebase/auth'

var config = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    databaseURL: process.env.DATABASE_URL,
    projectId: process.env.PROJECT_ID
}
console.log(config)

!firebase.apps.length ? firebase.initializeApp(config) : ''
export const auth = firebase.auth()
export const provider =  new firebase.auth.GoogleAuthProvider() 
export default firebase