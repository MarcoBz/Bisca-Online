export default ({ app, route, error, store, redirect }) => {
    // Every time the route changes (fired on initialization too)
    app.router.afterEach((to, from) => {
        if (!store.state.authUser && route.name != 'login') {
            return redirect('/login')
        }
        else {
            let splittedRoute = route.path.split('/')
            if (splittedRoute[2]){
                if (splittedRoute[2].split('_')[0] === 'room'){

                }
                else if (splittedRoute[2].split('_')[0] === 'match'){

                }
            }
        }
    })
 }