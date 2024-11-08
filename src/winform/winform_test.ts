import { expect } from "jsr:@std/expect";
import { fixtures } from "../utils/utils.ts";
import { NewWinForm } from "./winform.ts";

Deno.test("NewWinForm", async () => {
  await fixtures((params) => {
    const wins = NewWinForm({ ...params });
    if (wins.length == 0) {
      console.log(params);
    }
    if (wins.length > 1) {
      console.log(wins.map((e) => e.paiSets.map((e) => e.pais.map((e) => e.val))));
    }
    expect(wins.length != 0).toBe(true);
  }, 10000);
});
