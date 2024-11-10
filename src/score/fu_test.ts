import { expect } from "jsr:@std/expect";
import { fixtures } from "../utils/utils.ts";
import { NewWinForm } from "../winform/winform.ts";
import { calcFu, calcTsumoPoint, calcRonPoint } from "./fu.ts";
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

Deno.test("calcTsumoPoint", async () => {
    await fixtures((params) => {
        if (!params.options.isTsumo) {
            return;
        }

        const wins = NewWinForm({ ...params });
        let maxHan = 0;
        let maxFu = 0;
        let isYakuman = false;
        for (const win of wins) {
            const mbyYaku = yaku.findYakus({ ...params, ...win });
            if (mbyYaku.every((yaku) => yaku.yakuman)) {
                isYakuman = true;
                maxHan = mbyYaku.reduce((a, b) => a + b.val, 0);
                break
            }
            const han = mbyYaku.reduce((a, b) => a + b.val, 0);
            if (han >= maxHan) {
                if (han > maxHan) {
                    maxFu = 0;
                }
                maxHan = han;
                maxFu = Math.max(maxFu, calcFu({ ...params, ...win }));
            }
        }

        const scores = calcTsumoPoint({
            han: maxHan,
            fu: maxFu,
            isOya: params.options.isOya,
            isYakuman,
        });
        try {
            expect(
                params.options.isOya
                ? scores[0] * 3
                : scores[0] * 2 + scores[1],
            ).toEqual(params.ten);
        } catch (e) {
            console.log(params);
            throw e;
        }
    });
});


Deno.test("calcRonPoint", async () => {
    await fixtures((params) => {
        if (params.options.isTsumo) {
            return;
        }

        const wins = NewWinForm({ ...params });
        let maxHan = 0;
        let maxFu = 0;
        let isYakuman = false;
        for (const win of wins) {
            const mbyYaku = yaku.findYakus({ ...params, ...win });
            if (mbyYaku.every((yaku) => yaku.yakuman)) {
                isYakuman = true;
                maxHan = mbyYaku.reduce((a, b) => a + b.val, 0);
                break
            }
            const han = mbyYaku.reduce((a, b) => a + b.val, 0);
            if (han >= maxHan) {
                if (han > maxHan) {
                    maxFu = 0;
                }
                maxHan = han;
                maxFu = Math.max(maxFu, calcFu({ ...params, ...win }));
            }
        }

        const scores = calcRonPoint({
            han: maxHan,
            fu: maxFu,
            isOya: params.options.isOya,
            isYakuman,
        });
        try {
            expect(scores).toEqual(params.ten);
        } catch (e) {
            console.log(params);
            throw e;
        }
    });
});
