/** Task object that can be registered by the server. */
export type Task = NearTask;

/** Types of Tasks. */
export type TaskType = "near";

/** Base class for Tasks. */
interface TaskBase
{
    /** Task type. */
    type: TaskType;
}

/** Runs commands once an estimote beacon is near another. */
export interface NearTask extends TaskBase
{
    type: "near";
    /** First beacon. */
    subject: Beacon;
    /** Second beacon. */
    object: Beacon;
    /** Command to be run */
    then: Command;
}

/** Represents an estimote beaon. */
export interface Beacon
{
    /** Beacon name. */
    name: string;
}

/** Command object encapsulating an action to be executed. */
export type Command = AlertCommand;

/** Types of Commands. */
export type CommandType = "alert";

/** Base class for Commands. */
interface CommandBase
{
    /** Command type. */
    type: CommandType;
}

/** Sends an alert message to the client. */
export interface AlertCommand extends CommandBase
{
    type: "alert";
}
