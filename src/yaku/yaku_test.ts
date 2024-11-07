import { expect } from "jsr:@std/expect";
// import { Pai } from "../pai/pai.ts";
// import { yakus as constantYakus } from "../constant/constant.ts";
import { fixtures } from "../utils/utils.ts";
import { Chitoitsu, Kokushimuso, NewWinForm } from "../winform/winform.ts";
import {
    isChankan,
    isHaitei,
    isHoutei,
    isIppatsu,
    isPinfu,
    isRichi,
    isRinshankaiho,
    isIpeko,
    isRyampeko,
    isSananko,
    isTanyao,
    isTsumo,
} from "./yaku.ts";

Deno.test("isRichi", async () => {
    await fixtures((params) => {
        const wins = NewWinForm({ ...params });
        let exp = false;
        if (params.yakus.map((e) => e.str).includes("立直")) {
            exp = true;
        }
        expect(
            wins.some((e) => isRichi({ ...params, ...e }).length !== 0),
        ).toBe(exp);
    }, 100);
});

Deno.test("isPinfu", async () => {
    await fixtures((params) => {
        const wins = NewWinForm({ ...params });
        let exp = false;
        if (params.yakus.map((e) => e.str).includes("平和")) {
            exp = true;
        }
        const act = wins.some((e) => {
            if (e instanceof Chitoitsu || e instanceof Kokushimuso) {
                return false;
            }
            return isPinfu({ ...params, ...e }).length !== 0;
        });
        expect(act).toBe(exp);
    }, 100);
});

Deno.test("isIppatsu", async () => {
    await fixtures((params) => {
        const wins = NewWinForm({ ...params });
        let exp = false;
        if (params.yakus.map((e) => e.str).includes("一発")) {
            exp = true;
        }
        expect(
            wins.some((e) => isIppatsu({ ...params, ...e }).length !== 0),
        ).toBe(exp);
    }, 100);
});

Deno.test("isHaitei", async () => {
    await fixtures((params) => {
        const wins = NewWinForm({ ...params });
        let exp = false;
        if (params.yakus.map((e) => e.str).includes("海底摸月")) {
            exp = true;
        }
        expect(
            wins.some((e) => isHaitei({ ...params, ...e }).length !== 0),
        ).toBe(exp);
    }, 100);
});

Deno.test("isHoutei", async () => {
    await fixtures((params) => {
        const wins = NewWinForm({ ...params });
        let exp = false;
        if (params.yakus.map((e) => e.str).includes("河底撈魚")) {
            exp = true;
        }
        expect(
            wins.some((e) => isHoutei({ ...params, ...e }).length !== 0),
        ).toBe(exp);
    }, 100);
});

Deno.test("isTsumo", async () => {
    await fixtures((params) => {
        const wins = NewWinForm({ ...params });
        let exp = false;
        if (params.yakus.map((e) => e.str).includes("門前清自摸和")) {
            exp = true;
        }
        expect(
            wins.some((e) => isTsumo({ ...params, ...e }).length !== 0),
        ).toBe(exp);
    }, 100);
});

Deno.test("isTanyao", async () => {
    await fixtures((params) => {
        const wins = NewWinForm({ ...params });
        let exp = false;
        if (params.yakus.map((e) => e.str).includes("断幺九")) {
            exp = true;
        }
        const act = wins.some((e) => {
            return isTanyao({ ...params, ...e }).length !== 0;
        });

        if (act != exp) {
            console.log(`act: ${act}, exp: ${exp}`);
            console.log(params);
        }
        expect(act).toBe(exp);
    }, 100);
});

Deno.test("isChankan", async () => {
    await fixtures((params) => {
        const wins = NewWinForm({ ...params });
        let exp = false;
        if (params.yakus.map((e) => e.str).includes("槍槓")) {
            exp = true;
        }
        expect(wins.some((e) => isChankan({ ...params, ...e }).length !== 0))
            .toBe(exp);
    }, 100);
});

Deno.test("isRinshankaiho", async () => {
    await fixtures((params) => {
        const wins = NewWinForm({ ...params });
        let exp = false;
        if (params.yakus.map((e) => e.str).includes("嶺上開花")) {
            exp = true;
        }
        expect(
            wins.some((e) => isRinshankaiho({ ...params, ...e }).length !== 0),
        ).toBe(exp);
    }, 100);
});

Deno.test("isRyampeko", async () => {
    await fixtures((params) => {
        const wins = NewWinForm({ ...params });
        let exp = false;
        if (params.yakus.map((e) => e.str).includes("二盃口")) {
            exp = true;
        }
        expect(wins.some((e) => isRyampeko({ ...params, ...e }).length !== 0))
            .toBe(exp);
    });
});

Deno.test("isIpeko", async () => {
    await fixtures((params) => {
        const wins = NewWinForm({ ...params });
        let exp = false;
        if (params.yakus.map((e) => e.str).includes("一盃口")) {
            exp = true;
        }
        const act = wins.some((e) => isIpeko({ ...params, ...e }).length !== 0);
        if (act != exp) {
            // NOTE: 一盃口として扱わないほうが点数が高い場合があるので、除外する。
            if (wins.some((e) => isSananko({ ...params, ...e }).length !== 0)) {
                return;
            }

            console.log(`act: ${act}, exp: ${exp}`);
            console.log(params);
        }
        expect(act).toBe(exp);
    }, 100);
});

Deno.test("isSananko", async () => {
    await fixtures((params) => {
        const wins = NewWinForm({ ...params });
        let exp = false;
        if (params.yakus.map((e) => e.str).includes("三暗刻")) {
            exp = true;
        }
        const act = wins.some((e) =>
            isSananko({ ...params, ...e }).length !== 0
        );
        if (act != exp) {
            console.log(`act: ${act}, exp: ${exp}`);
            console.log(params);
        }
        expect(act).toBe(exp);
    }, 100);
});
