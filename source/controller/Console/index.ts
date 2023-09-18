import router from "@/Tools/Console/Router";

/*
|-----------------------------
|       CLI Application
|-----------------------------
|
|
*/
export default router(({ route }) => {

    route('build', () => require('./Routes/build'))
    route('production', () => require('./Routes/production'))
})