import {auth} from '@/services/fireinit.js'
export default {

  
    signIn ({commit}, payload) {
      auth.signInWithEmailAndPassword(payload.email, payload.password).then((data) => {
        let userPayload = {
          authUser : {
            email: data.user.email,
            uid: data.user.uid
          }
        }

        commit('SET_AUTH_USER', userPayload)
      })
      .catch(err => alert(err.message))
    },

    signOut ({commit}) {
      auth.signOut()
      .then(() => {
        commit('RESET_STORE')
      })
      .catch(err => alert(err.message))
    },

    signUp ({commit}, payload) {
      auth.createUserWithEmailAndPassword(payload.email, payload.password)
      .then((data) => {
        let userPayload = {
          authUser : {
            email: data.user.email,
            uid: data.user.uid
          }
        }

        commit('SET_AUTH_USER', userPayload)
      })
      .catch(err => alert(err.message))
    },
}