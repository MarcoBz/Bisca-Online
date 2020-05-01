import { auth } from '@/services/fireinit.js'

export default context => {
    const { store } = context 

    return new Promise((resolve, reject) => {
        console.log('c')
        auth.onAuthStateChanged(user => {
            if (user) {
                let userPayload = {
                    authUser : {
                        email: user.email,
                        uid: user.uid
                    }
                }
                return resolve(store.commit('SET_AUTH_USER', userPayload))
            }
            else return resolve(store.commit('RESET_STORE'))
        })
    })
}