import { Command } from "./Task";

/** Types of client events that can be sent. */
export type EventType = "estimote" | "nn";

/** Typings for `share`. */
export type Share = {[E in EventType]?: Command};

/** Shared data across both servers. */
export const share: Share = {};
