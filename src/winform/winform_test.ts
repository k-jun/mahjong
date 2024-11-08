import { expect } from "jsr:@std/expect";
import { fixtures } from "../utils/utils.ts";
import { NewWinForm } from "./winform.ts";

Deno.test("NewWinForm", async () => {
  await fixtures((params) => {
    const wins = NewWinForm({ ...params });
    expect(wins.length != 0).toBe(true);
  }, 10000);
});
