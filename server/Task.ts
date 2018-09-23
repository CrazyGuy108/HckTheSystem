/** Task object that can be registered by the server. */
export interface Task
{
    /** Condition at which the event will fire. */
    when: Condition;
    /** Command to run once the condition is met. */
    then: Command;
}

/** Event condition type. */
export type Condition = NearCondition | SeeCondition;

/** Types of Tasks. */
export type ConditionType = "near" | "see";

/** Base class for conditions. */
interface ConditionBase
{
    type: ConditionType;
}

/** Fires once an estimote beacon is near another. */
export interface NearCondition extends ConditionBase
{
    type: "near";
    /** First beacon. */
    subject: Beacon;
    /** Second beacon. */
    object: Beacon;
}

/** Fires once the camera sees a specific type of object. */
export interface SeeCondition extends ConditionBase
{
    type: "see";
    /** Type of object to look for. */
    object: string;
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
