export default ({ app, route, error, store, redirect }) => {
    // Every time the route changes (fired on initialization too)
    console.log('a')
    app.router.afterEach((to, from) => {
        console.log('b')
        console.log('test', to, from)
        redirect('/login')
        // if (!store.state.authUser){
        //     if (route.name != 'login') return redirect('/login')
        // }
        // else {
        //     let splittedRoute = route.path.split('/')
        //     if (splittedRoute.length != 3 || route.path === "/user") {
        //         return app.router.push({name : 'user'})
        //     }
        //     else {
        //         if (splittedRoute[2].split('_')[0] === 'rooms'){

        //         }
        //         else if (splittedRoute[2].split('_')[0] === 'matches'){

        //         }
        //         else return redirect('/user')
        //     }
        // }
    })
 }


 ////path solo rooms mandare da user