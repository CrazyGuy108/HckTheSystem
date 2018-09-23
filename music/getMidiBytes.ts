import { spawn } from "child_process";
import * as path from "path";

/**
 * Converts the notes to a binary midi file.
 * @param notes Notes to be parsed.
 * @returns The byte representation of the generated midi file.
 */
export async function getMidiBytes(notes: string): Promise<string>
{
    return new Promise((resolve, reject) => {
        const py = spawn("python", [path.join(__dirname, "music.py")],
                {stdio: "pipe"});

        py.stdin.write(notes);

        let buf = Buffer.from("");

        py.stdout.on("data", (data: Buffer) =>
        {
            buf = Buffer.concat([buf, data]);
        });
        py.stdout.on("end", () =>
        {
            resolve(buf);
        });

    }).then(buffer => (buffer as Buffer).toString("base64"));
}
