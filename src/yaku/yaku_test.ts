import { expect } from "jsr:@std/expect";
// @deno-types="npm:@types/jsdom"
import { JSDOM } from "npm:jsdom";
import { Pai } from "../pai/pai.ts";
import { yakus as constantYakus } from "../constant/constant.ts";
import { fixtures } from "../utils/utils.ts";

Deno.test("isRichi", async () => {
    await fixtures();
});
