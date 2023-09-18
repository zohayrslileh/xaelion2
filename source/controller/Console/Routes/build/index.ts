import router from "@/Tools/Console/Router";

/**
 * Build routes
 * 
 */
export default router(({ route }) => {

    route('controller', () => require('./controller'))
})
