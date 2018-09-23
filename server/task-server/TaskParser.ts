import * as natural from "natural";
import { AlertCommand, Beacon, Command, Condition, NearCondition, SeeCondition,
    Task } from "../Task";

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
        console.log(`words: ${JSON.stringify(this.words)}`);
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
     * @param words Word strings to check against.
     */
    private expect(...words: string[]): void
    {
        if (words.every(word => !this.match(this.currentWord(), word)))
        {
            throw new Error(
                `Expected "${words}" but found "${this.currentWord()}"`);
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
        word1 = natural.PorterStemmer.stem(word1);
        word2 = natural.PorterStemmer.stem(word2);
        return natural.Metaphone.compare(word1, word2);
    }

    /** Task ::= (WhenTask) */
    private parseTask(): Task
    {
        return this.parseWhenTask();
    }

    /** WhenTask ::= "when" (Condition) "then" (Command) */
    private parseWhenTask(): Task
    {
        this.expect("when");
        const when = this.parseCondition();
        this.expect("then");
        const then = this.parseCommand();
        return {when, then};
    }

    /** Condition ::= NearCondition */
    private parseCondition(): Condition
    {
        if (this.match(this.currentWord(), "i"))
        {
            return this.parseNearCondition();
        }
        else if (this.match(this.currentWord(), "you"))
        {
            return this.parseSeeCondition();
        }
        else
        {
            throw new Error(`Unexpected word ${this.currentWord()}`);
        }
    }

    /** NearCondition ::= "i am near" (Beacon) */
    private parseNearCondition(): NearCondition
    {
        this.expect("i");
        this.expect("am", "m");
        this.expect("near");
        const beacon = this.parseBeacon();

        return {type: "near", beacon};
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

    /** SeeCondition ::= "you see a" (Word)+ */
    private parseSeeCondition(): SeeCondition
    {
        this.expect("you");
        this.expect("see");
        this.expect("a");

        let object = this.currentWord();
        this.nextWord();
        // follow set of SeeCondition
        while (!this.match(this.currentWord(), "then"))
        {
            object += " " + this.currentWord();
            this.nextWord();
        }

        return {type: "see", object};
    }

    /** Command ::= (AlertCommand) */
    private parseCommand(): Command
    {
        return this.parseAlertCommand();
    }

    /** AlertCommand ::= "alert" (Word)+ */
    private parseAlertCommand(): AlertCommand
    {
        this.expect("alert");
        let msg = this.currentWord();
        this.nextWord();
        // follow set of AlertCommand is <eof>
        while (this.pos < this.words.length)
        {
            msg += " " + this.currentWord();
            this.nextWord();
        }
        return {type: "alert", msg};
    }
}
