import * as natural from "natural";
import { AlertCommand, Beacon, Command, NearTask, Task } from "../Task";

const tokenizer = new natural.WordTokenizer();

/** Parses tasks sent to the server. */
export class TaskParser
{
    /** Index of the current word. */
    private pos = 0;
    /** List of words in the text. */
    private words: string[] = [];

    /**
     * Processes the given text and translates it to listener objects.
     * @param text Text to be processed.
     * @returns A list of tasks to be registered by the server.
     */
    public parse(text: string): Task[]
    {
        this.words = tokenizer.tokenize(text.toLowerCase());
        this.pos = 0;
        return this.parseTopLevel();
    }

    /**
     * Gets the current word in the text.
     * @returns The current word in the text.
     */
    private currentWord(): string
    {
        return this.words[this.pos];
    }

    /**
     * Gets the next word in the text.
     * @returns The next word in the text.
     */
    private nextWord(): string
    {
        return this.words[++this.pos];
    }

    /**
     * Throws an error if the current word is not equal to the given word.
     * @param word Word string to check against.
     */
    private expect(word: string): void
    {
        if (this.currentWord() !== word)
        {
            throw new Error(
                `Expected "${word}" but found "${this.currentWord()}"`);
        }
        this.nextWord();
    }

    /** TopLevel ::= (Task)* <eof> */
    private parseTopLevel(): Task[]
    {
        const tasks: Task[] = [];
        while (this.pos < this.words.length)
        {
            switch (this.currentWord())
            {
                // first set of Task
                case "when":
                    tasks.push(this.parseTask());
                    break;
                default:
                    throw new Error(`Unexpected word ${this.currentWord()}`);
            }
        }
        return tasks;
    }

    /** Task ::= SeesTask */
    private parseTask(): Task
    {
        return this.parseNearTask();
    }

    /** SeesTask ::= "when" (Beacon)* "is near" (Beacon) (CodeBlock) "end" */
    private parseNearTask(): NearTask
    {
        this.expect("when");
        const subject = this.parseBeacon();
        this.expect("is");
        this.expect("near");
        const object = this.parseBeacon();
        const then = this.parseCodeBlock();
        this.expect("end");

        return {type: "near", subject, object, then};
    }

    /** Beacon ::= "the" (Word) "beacon" */
    private parseBeacon(): Beacon
    {
        this.expect("the");
        const beacon = {name: this.currentWord()};
        this.expect("beacon");
        this.nextWord();
        return beacon;
    }

    /** CodeBlock ::= "then" (Command)+ */
    private parseCodeBlock(): Command[]
    {
        this.expect("then");
        const commands: Command[] = [];
        do
        {
            commands.push(this.parseCommand());
        }
        // follow set of CodeBlock
        while (this.currentWord() !== "end");

        return commands;
    }

    /** Command ::= "do" CommandHelper "done" */
    private parseCommand(): Command
    {
        this.expect("do");
        const command = this.parseCommandHelper();
        this.expect("done");
        return command;
    }

    /** CommandHelper ::= "alert" (words*) */
    private parseCommandHelper(): AlertCommand
    {
        this.expect("alert");
        const words: string[] = [];
        while (this.currentWord() !== "done")
        {
            words.push(this.currentWord());
            this.nextWord();
        }
        return {type: "alert", words};
    }
}
