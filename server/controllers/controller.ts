import { Request, Response, Router } from "express";

const router = Router();

router.get("/", (req: Request, res: Response) =>
{
    res.send("hey there");
})
.get("/:name", (req: Request, res: Response) =>
{
    const { name } = req.params;
    res.send(`hi ${name}`);
});

export const controller: Router = router;
