import { spawn } from 'child_process';

/**
 * Run method
 * 
 * @param directory 
 */
export const run = async ({ command, directory, onReceive, onError }: {
    command: string
    directory?: string
    onReceive?: (data: string) => void
    onError?: (message: string) => void
}) => new Promise<number>((resolve, reject) => {

    // Create command
    const Command = spawn(command, { shell: true, cwd: directory });

    // On received data
    Command.stdout.on('data', data => {

        // onReceive callback
        if (onReceive) onReceive(data.toString())
    });

    // On received error
    Command.stderr.on('data', data => {

        // onError callback
        if (onError) onError(data.toString());

        // Promise reject
        else reject(data.toString());
    });

    // Listen for the 'error' event
    Command.on('error', (error) => {

        // onError callback
        if (onError) onError(error.toString());

        // Promise reject
        else reject(error.toString());
    });

    // Promise resolve
    Command.on('exit', resolve);
})
