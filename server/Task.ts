/** Task object that can be registered by the main server. */
export interface Task
{
    /** Event name. */
    event: string;
    /** Event parameters. */
    params: any;
}
