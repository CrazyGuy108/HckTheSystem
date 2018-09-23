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
        if (!this.match(this.currentWord(), word))
        {
            throw new Error(
                `Expected "${word}" but found "${this.currentWord()}"`);
        }
        this.nextWord();
    }

    /**
     * Tests whether two words match phonetically.
     * @param word1 First word.
     * @param word2 Second word.
     * @returns Whether the two words match.
     */
    private match(word1: string, word2: string): boolean
    {
        return natural.Metaphone.compare(word1, word2);
    }

    /** TopLevel ::= (Task)* <eof> */
    private parseTopLevel(): Task[]
    {
        const tasks: Task[] = [];
        while (this.pos < this.words.length)
        {
            const word = this.currentWord();
            if (this.match(word, "when"))
            {
                tasks.push(this.parseTask());
            }
            else
            {
                throw new Error(`Unexpected word ${this.currentWord()}`);
            }
        }
        return tasks;
    }

    /** Task ::= NearTask */
    private parseTask(): Task
    {
        return this.parseNearTask();
    }

    /** NearTask ::= "when" (Beacon)* "is near" (Beacon) (CodeBlock) "end" */
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
        this.nextWord();
        this.expect("beacon");
        return beacon;
    }

    /** CodeBlock ::= "then" (Command)+ */
    private parseCodeBlock(): Command[]
    {
        this.expect("then");
        const commands: Command[] = [];
        // follow set of CodeBlock
        while (!this.match(this.currentWord(), "end"))
        {
            commands.push(this.parseCommand());
        }

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
        while (!this.match(this.currentWord(), "done"))
        {
            words.push(this.currentWord());
            this.nextWord();
        }
        return {type: "alert", words};
    }
}
