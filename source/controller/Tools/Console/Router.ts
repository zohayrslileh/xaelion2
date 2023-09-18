
/**
 * Router class
 * 
 */
class Router {

    /**
     * Key
     * 
     */
    private key: number = 0;

    /**
     * Action
     * 
     */
    private action?: ActionType;

    /**
     * Routes
     * 
     */
    private routes: (Router: Router) => void;


    /**
     * Router constructor
     * 
     */
    public constructor(routes: (Router: Router) => void) {

        // Set routes
        this.routes = routes;

        // Bind methods
        this.route = this.route.bind(this)
        this.index = this.index.bind(this)
        this.other = this.other.bind(this)
        this.execute = this.execute.bind(this)
    }

    /**
     * Route method
     * 
     */
    public route(name: string, action: ActionType): void {

        // Check route and set action
        if (params[this.key] === name) this.action = action;
    }

    /**
     * Index method
     * 
     */
    public index(action: ActionType): void {

        // Check route and set action
        if (params[this.key] === undefined) this.action = action;
    }

    /**
     * Other method
     * 
     */
    public other(action: ActionType): void {

        // Check route and set action
        if (this.action === undefined) this.action = action;
    }

    /**
     * Execute method
     * 
     */
    public execute() {

        // Fetch routes
        this.routes(this);

        // Check if set action
        if (!this.action) return;

        // Check if action is new router
        if (this.action instanceof Router) {

            // Increment key
            this.action.key++;

            // Execute
            this.action.execute()
        }

        // Now action is callback
        else {

            // Execute
            const result = this.action();

            // Re-execute if node require
            if (result?.default instanceof Function) result.default();

            // Check if result require is new router
            else if (result?.default instanceof Router) {

                // Increment key
                result.default.key++;

                // Execute
                result.default.execute()
            }
        }
    }
}

/**
 * Router method
 * 
 * @returns 
 */
export default function router(routes: (Router: Router) => void): Router {

    return new Router(routes);
}


/**
 * Params
 * 
 */
export const params = process.argv.slice(2).filter(param => !param.startsWith('--'));

/**
 * Flags
 * 
 */
export const flags = process.argv.slice(2).filter(param => param.startsWith('--')).reduce<Record<string, any>>((prevent, current) => {

    // Current flag
    const [flag, value] = current.slice(2).split('=');

    // Set prevent flags
    return { ...prevent, [flag]: value ?? true };
}, {});


/**
 * Action type
 * 
 */
type ActionType = Router | (() => any)