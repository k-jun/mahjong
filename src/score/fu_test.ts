import { expect } from "jsr:@std/expect";
import { fixtures } from "../utils/utils.ts";
import { NewWinForm } from "../winform/winform.ts";
import { calcFu } from "./fu.ts";
import * as yaku from "./yaku.ts";

Deno.test("calcFu", async () => {
    await fixtures(
        (params) => {
            const wins = NewWinForm({ ...params });

            let maxHan = 0;
            let maxFu = 0;
            for (const win of wins) {
                const mbyYaku = yaku.findYakus({ ...params, ...win });
                const han = mbyYaku.reduce((a, b) => a + b.val, 0);
                if (han >= maxHan) {
                    if (han > maxHan) {
                        maxFu = 0;
                    }
                    maxHan = han;
                    maxFu = Math.max(maxFu, calcFu({ ...params, ...win }));
                }
            }

            try {
                expect(maxFu).toEqual(params.fu);
            } catch (e) {
                console.log(params);
                throw e;
            }
        },
    );
});
