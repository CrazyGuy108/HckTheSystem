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
     * Processes the given text and translates it to a Task object.
     * @param text Text to be processed.
     * @returns A Task to be registered by the server.
     */
    public parse(text: string): Task
    {
        this.words = tokenizer.tokenize(text.toLowerCase());
        this.pos = 0;
        return this.parseTask();
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

    /** Task ::= NearTask */
    private parseTask(): Task
    {
        return this.parseNearTask();
    }

    /** NearTask ::= "when" (Beacon) "is near" (Beacon) "then" (Command) */
    private parseNearTask(): NearTask
    {
        this.expect("when");
        const subject = this.parseBeacon();
        this.expect("is");
        this.expect("near");
        const object = this.parseBeacon();
        this.expect("then");
        const then = this.parseCommand();

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

    /** Command ::= "alert" */
    private parseCommand(): AlertCommand
    {
        this.expect("alert");
        return {type: "alert"};
    }
}
