export default ({ app, route, error, store, redirect }) => {
    // Every time the route changes (fired on initialization too)
    app.router.afterEach((to, from) => {
        if (!store.state.authUser){ 
            if(to.path != '/login') return redirect('/login')
        }
        else {
            if(to.path === '/login') return redirect('/user')
            else{
                let splittedRoute = to.path.split('/')
                if (splittedRoute[1] === 'rooms'){
                    if (splittedRoute.length === 3){
                        app.$fireDb.ref(`rooms/${splittedRoute[2]}/users/${store.state.authUser.uid}`).once('value', (snapshot) => {
                            let user = snapshot.val()
                            if (!user)  error({ statusCode: 403, authorized: true })
                        })
                    }
                    else return redirect('/user')
                }
                else if (splittedRoute[1] === 'matches'){
                    if (splittedRoute.length === 3){
                        app.$fireDb.ref(`matches/${splittedRoute[2]}/room`).once('value', (snapshot) => {
                            let room = snapshot.val()
                            app.$fireDb.ref(`rooms/${room}/users/${store.state.authUser.uid}`).once('value', (snapshot) => {
                                let user = snapshot.val()
                                if (!user)  error({ statusCode: 403, authorized: true })
                            })
                        })
                    }
                    else return redirect('/user')
                }
                else return redirect('/user')
            }
        }
    })
 }


 ////path solo rooms mandare da user