export default ({ app, route, error, store, redirect }) => {
    // Every time the route changes (fired on initialization too)
    app.router.afterEach((to, from) => {
        if (!store.state.authUser){ 
            if(to.path != '/v1/login') return redirect('/v1/login')
        }
        else {
            if(to.path === '/v1/login') return redirect('/v1/user')
            else{
                let splittedRoute = to.path.split('/')
                if (splittedRoute[2] === 'rooms' && splittedRoute[1] === 'v1'){
                    if (splittedRoute.length === 4){
                        app.$fireDb.ref(`rooms/${splittedRoute[3]}/users/${store.state.authUser.uid}`).once('value', (snapshot) => {
                            let user = snapshot.val()
                            if (!user)  error({ statusCode: 403, authorized: true })
                        })
                    }
                    else return redirect('/v1/user')
                }
                else if (splittedRoute[2] === 'matches' && splittedRoute[1] === 'v1'){
                    if (splittedRoute.length === 4){
                        app.$fireDb.ref(`matches/${splittedRoute[3]}/room`).once('value', (snapshot) => {
                            let room = snapshot.val()
                            app.$fireDb.ref(`rooms/${room}/users/${store.state.authUser.uid}`).once('value', (snapshot) => {
                                let user = snapshot.val()
                                if (!user)  error({ statusCode: 403, authorized: true })
                            })
                        })
                    }
                    else return redirect('/v1/user')
                }
                else return redirect('/v1/user')
            }
        }
    })
 }


 ////path solo rooms mandare da user