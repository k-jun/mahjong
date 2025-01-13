import { expect } from "jsr:@std/expect";
import { fixtures } from "../utils/utils.ts";
import { WinFormFactory } from "./winform.ts";

Deno.test("WinFormFactory", async () => {
  await fixtures((params) => {
    const factory = new WinFormFactory();
    const wins = factory.create({ ...params });

    try {
      expect(wins.length != 0).toBe(true);
    } catch (e) {
      console.log(params);
      throw e;
    }
  }, 10000);
});
