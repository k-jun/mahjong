import { expect } from "jsr:@std/expect";
import { fixtures } from "../utils/utils.ts";
import { Chitoitsu, Kokushimuso, NewWinForm } from "../winform/winform.ts";
import * as yaku from "./yaku.ts";
import { yakus } from "../constant/constant.ts";

Deno.test("isRichi", async () => {
    await fixtures((params) => {
        const wins = NewWinForm({ ...params });
        let exp = false;
        if (params.yakus.map((e) => e.str).includes("立直")) {
            exp = true;
        }
        expect(
            wins.some((e) => yaku.isRichi({ ...params, ...e }).length !== 0),
        ).toBe(exp);
    }, 10000);
});

Deno.test("isPinfu", async () => {
    await fixtures((params) => {
        const wins = NewWinForm({ ...params });
        let exp = false;
        const yakus = params.yakus.map((e) => e.str);
        if (yakus.includes("平和")) {
            exp = true;
        }
        const act = wins.some((e) => {
            if (e instanceof Chitoitsu || e instanceof Kokushimuso) {
                return false;
            }
            return yaku.isPinfu({ ...params, ...e }).length !== 0;
        });
        if (act != exp) {
            console.log(`act: ${act}, exp: ${exp}`);
            console.log(params);
        }
        expect(act).toBe(exp);
    }, 10000);
});

Deno.test("isIppatsu", async () => {
    await fixtures((params) => {
        const wins = NewWinForm({ ...params });
        let exp = false;
        if (params.yakus.map((e) => e.str).includes("一発")) {
            exp = true;
        }
        expect(
            wins.some((e) => yaku.isIppatsu({ ...params, ...e }).length !== 0),
        ).toBe(exp);
    }, 10000);
});

Deno.test("isHaitei", async () => {
    await fixtures((params) => {
        const wins = NewWinForm({ ...params });
        let exp = false;
        if (params.yakus.map((e) => e.str).includes("海底摸月")) {
            exp = true;
        }
        expect(
            wins.some((e) => yaku.isHaitei({ ...params, ...e }).length !== 0),
        ).toBe(exp);
    }, 10000);
});

Deno.test("isHoutei", async () => {
    await fixtures((params) => {
        const wins = NewWinForm({ ...params });
        let exp = false;
        if (params.yakus.map((e) => e.str).includes("河底撈魚")) {
            exp = true;
        }
        expect(
            wins.some((e) => yaku.isHoutei({ ...params, ...e }).length !== 0),
        ).toBe(exp);
    }, 10000);
});

Deno.test("isTsumo", async () => {
    await fixtures((params) => {
        const wins = NewWinForm({ ...params });
        let exp = false;

        const yakus = params.yakus.map((e) => e.str);
        if (yakus.includes("四暗刻")) {
            return;
        }
        if (yakus.includes("門前清自摸和")) {
            exp = true;
        }
        const act = wins.some((e) => yaku.isTsumo({ ...params, ...e }).length !== 0);
        if (act != exp) {
            console.log(`act: ${act}, exp: ${exp}`);
            console.log(params);
        }
        expect(act).toBe(exp);
    }, 10000);
});

Deno.test("isTanyao", async () => {
    await fixtures((params) => {
        const wins = NewWinForm({ ...params });
        let exp = false;
        if (params.yakus.map((e) => e.str).includes("断幺九")) {
            exp = true;
        }
        const act = wins.some((e) => {
            return yaku.isTanyao({ ...params, ...e }).length !== 0;
        });

        if (act != exp) {
            console.log(`act: ${act}, exp: ${exp}`);
            console.log(params);
        }
        expect(act).toBe(exp);
    }, 10000);
});

Deno.test("isChankan", async () => {
    await fixtures((params) => {
        const wins = NewWinForm({ ...params });
        let exp = false;
        if (params.yakus.map((e) => e.str).includes("槍槓")) {
            exp = true;
        }
        expect(
            wins.some((e) => yaku.isChankan({ ...params, ...e }).length !== 0),
        )
            .toBe(exp);
    }, 10000);
});

Deno.test("isRinshankaiho", async () => {
    await fixtures((params) => {
        const wins = NewWinForm({ ...params });
        let exp = false;
        if (params.yakus.map((e) => e.str).includes("嶺上開花")) {
            exp = true;
        }
        expect(
            wins.some((e) =>
                yaku.isRinshankaiho({ ...params, ...e }).length !== 0
            ),
        ).toBe(exp);
    }, 10000);
});

Deno.test("isRyampeko", async () => {
    await fixtures((params) => {
        const wins = NewWinForm({ ...params });
        let exp = false;
        if (params.yakus.map((e) => e.str).includes("二盃口")) {
            exp = true;
        }
        expect(
            wins.some((e) => yaku.isRyampeko({ ...params, ...e }).length !== 0),
        )
            .toBe(exp);
    }, 10000);
});

Deno.test("isIpeko", async () => {
    await fixtures((params) => {
        const wins = NewWinForm({ ...params });
        let exp = false;
        if (params.yakus.map((e) => e.str).includes("一盃口")) {
            exp = true;
        }
        const act = wins.some((e) =>
            yaku.isIpeko({ ...params, ...e }).length !== 0
        );
        if (act != exp) {
            // NOTE: 一盃口として扱わないほうが点数が高い場合があるので、除外する。
            if (
                wins.some((e) =>
                    yaku.isSananko({ ...params, ...e }).length !== 0
                )
            ) {
                return;
            }

            console.log(`act: ${act}, exp: ${exp}`);
            console.log(params);
        }
        expect(act).toBe(exp);
    }, 10000);
});

Deno.test("isSananko", async () => {
    await fixtures((params) => {
        const wins = NewWinForm({ ...params });
        let exp = false;
        if (params.yakus.map((e) => e.str).includes("三暗刻")) {
            exp = true;
        }
        const act = wins.some((e) =>
            yaku.isSananko({ ...params, ...e }).length !== 0
        );
        if (act != exp) {
            console.log(`act: ${act}, exp: ${exp}`);
            console.log(params);
        }
        expect(act).toBe(exp);
    }, 10000);
});

Deno.test("isBakaze", async () => {
    await fixtures((params) => {
        const wins = NewWinForm({ ...params });
        let exp = false;
        if (
            params.yakus.map((e) => e.str).includes(
                `場風 ${params.paiBakaze.dsp}`,
            )
        ) {
            exp = true;
        }
        expect(
            wins.some((e) => yaku.isBakaze({ ...params, ...e }).length !== 0),
        )
            .toBe(exp);
    }, 10000);
});

Deno.test("isJikaze", async () => {
    await fixtures((params) => {
        const wins = NewWinForm({ ...params });
        let exp = false;
        if (
            params.yakus.map((e) => e.str).includes(
                `自風 ${params.paiJikaze.dsp}`,
            )
        ) {
            exp = true;
        }
        expect(
            wins.some((e) => yaku.isJikaze({ ...params, ...e }).length !== 0),
        )
            .toBe(exp);
    }, 10000);
});

Deno.test("isHaku", async () => {
    await fixtures((params) => {
        const wins = NewWinForm({ ...params });
        let exp = false;
        if (params.yakus.map((e) => e.str).includes("役牌 白")) {
            exp = true;
        }
        expect(wins.some((e) => yaku.isHaku({ ...params, ...e }).length !== 0))
            .toBe(exp);
    }, 10000);
});

Deno.test("isHatsu", async () => {
    await fixtures((params) => {
        const wins = NewWinForm({ ...params });
        let exp = false;
        if (params.yakus.map((e) => e.str).includes("役牌 發")) {
            exp = true;
        }
        expect(wins.some((e) => yaku.isHatsu({ ...params, ...e }).length !== 0))
            .toBe(exp);
    }, 10000);
});

Deno.test("isChun", async () => {
    await fixtures((params) => {
        const wins = NewWinForm({ ...params });
        let exp = false;
        if (params.yakus.map((e) => e.str).includes("役牌 中")) {
            exp = true;
        }
        expect(wins.some((e) => yaku.isChun({ ...params, ...e }).length !== 0))
            .toBe(exp);
    }, 10000);
});

Deno.test("isDabururichi", async () => {
    await fixtures((params) => {
        const wins = NewWinForm({ ...params });
        let exp = false;
        if (params.yakus.map((e) => e.str).includes("両立直")) {
            exp = true;
        }
        expect(
            wins.some((e) =>
                yaku.isDabururichi({ ...params, ...e }).length !== 0
            ),
        )
            .toBe(exp);
    }, 10000);
});

Deno.test("isChanta", async () => {
    await fixtures((params) => {
        const wins = NewWinForm({ ...params });
        let exp = false;
        const yakus = params.yakus.map((e) => e.str);
        if (
            yakus.includes("純全帯幺九") ||
            yakus.includes("混老頭") ||
            yakus.includes("清老頭") ||
            yakus.includes("小四喜") ||
            yakus.includes("大四喜") ||
            yakus.includes("字一色") ||
            yakus.includes("大三元")
        ) {
            return;
        }
        if (yakus.includes("混全帯幺九")) {
            exp = true;
        }
        const act = wins.some((e) =>
            yaku.isChanta({ ...params, ...e }).length !== 0
        );

        if (act != exp) {
            console.log(`act: ${act}, exp: ${exp}`);
            console.log(params);
        }
        expect(act).toBe(exp);
    }, 10000);
});

Deno.test("isShosushi", async () => {
    await fixtures((params) => {
        const wins = NewWinForm({ ...params });
        let exp = false;
        if (params.yakus.map((e) => e.str).includes("小四喜")) {
            exp = true;
        }
        const act = wins.some((e) =>
            yaku.isShosushi({ ...params, ...e }).length !== 0
        );
        if (act != exp) {
            console.log(`act: ${act}, exp: ${exp}`);
            console.log(params);
        }
        expect(act).toBe(exp);
    }, 10000);
});

Deno.test("isDaisushi", async () => {
    await fixtures((params) => {
        const wins = NewWinForm({ ...params });
        let exp = false;
        if (params.yakus.map((e) => e.str).includes("大四喜")) {
            exp = true;
        }
        const act = wins.some((e) =>
            yaku.isDaisushi({ ...params, ...e }).length !== 0
        );
        if (exp) {
            console.log(`act: ${act}, exp: ${exp}`);
            console.log(params);
        }
        expect(act).toBe(exp);
    }, 10000);
});

Deno.test("isSuanko", async () => {
    await fixtures((params) => {
        const wins = NewWinForm({ ...params });
        let exp = false;
        if (params.yakus.map((e) => e.str).includes("四暗刻")) {
            exp = true;
        }
        const act = wins.some((e) =>
            yaku.isSuanko({ ...params, ...e }).length !== 0
        );
        if (exp != act) {
            console.log(`act: ${act}, exp: ${exp}`);
            console.log(params);
        }
        expect(act).toBe(exp);
    }, 10000);
});

Deno.test("isSuankotanki", async () => {
    await fixtures((params) => {
        const wins = NewWinForm({ ...params });
        let exp = false;
        if (params.yakus.map((e) => e.str).includes("四暗刻単騎")) {
            exp = true;
        }
        const act = wins.some((e) =>
            yaku.isSuankotanki({ ...params, ...e }).length !== 0
        );
        if (exp != act) {
            console.log(`act: ${act}, exp: ${exp}`);
            console.log(params);
        }
        expect(act).toBe(exp);
    }, 10000);
});

Deno.test("isDaisangen", async () => {
    await fixtures((params) => {
        const wins = NewWinForm({ ...params });
        let exp = false;
        if (params.yakus.map((e) => e.str).includes("大三元")) {
            exp = true;
        }
        const act = wins.some((e) =>
            yaku.isDaisangen({ ...params, ...e }).length !== 0
        );
        expect(act).toBe(exp);
    }, 10000);
});

Deno.test("isTsuiso", async () => {
    await fixtures((params) => {
        const wins = NewWinForm({ ...params });
        let exp = false;
        if (params.yakus.map((e) => e.str).includes("字一色")) {
            exp = true;
        }
        const act = wins.some((e) =>
            yaku.isTsuiso({ ...params, ...e }).length !== 0
        );
        if (exp != act) {
            console.log(`act: ${act}, exp: ${exp}`);
            console.log(params);
        }
        expect(act).toBe(exp);
    }, 10000);
});

Deno.test("isRyuiso", async () => {
    await fixtures((params) => {
        const wins = NewWinForm({ ...params });
        let exp = false;
        if (params.yakus.map((e) => e.str).includes("緑一色")) {
            exp = true;
        }
        const act = wins.some((e) =>
            yaku.isRyuiso({ ...params, ...e }).length !== 0
        );
        if (exp != act) {
            console.log(`act: ${act}, exp: ${exp}`);
            console.log(params);
        }
        expect(act).toBe(exp);
    }, 10000);
});

Deno.test("isChiho", async () => {
    await fixtures((params) => {
        const wins = NewWinForm({ ...params });
        let exp = false;
        if (params.yakus.map((e) => e.str).includes("地和")) {
            exp = true;
        }
        const act = wins.some((e) =>
            yaku.isChiho({ ...params, ...e }).length !== 0
        );
        expect(act).toBe(exp);
    }, 10000);
});

Deno.test("isTenho", async () => {
    await fixtures((params) => {
        const wins = NewWinForm({ ...params });
        let exp = false;
        if (params.yakus.map((e) => e.str).includes("天和")) {
            exp = true;
        }
        const act = wins.some((e) =>
            yaku.isTenho({ ...params, ...e }).length !== 0
        );
        expect(act).toBe(exp);
    }, 10000);
});

Deno.test("isChinroto", async () => {
    await fixtures((params) => {
        const wins = NewWinForm({ ...params });
        let exp = false;
        if (params.yakus.map((e) => e.str).includes("清老頭")) {
            exp = true;
        }
        const act = wins.some((e) =>
            yaku.isChinroto({ ...params, ...e }).length !== 0
        );
        if (exp || act != exp) {
            console.log(`act: ${act}, exp: ${exp}`);
            console.log(params);
        }
        expect(act).toBe(exp);
    }, 10000);
});

Deno.test("isChurempoto", async () => {
    await fixtures((params) => {
        const wins = NewWinForm({ ...params });
        let exp = false;
        if (params.yakus.map((e) => e.str).includes("九蓮宝燈")) {
            exp = true;
        }
        const act = wins.some((e) =>
            yaku.isChurempoto({ ...params, ...e }).length !== 0
        );
        if (exp || exp != act) {
            console.log(`act: ${act}, exp: ${exp}`);
            console.log(params);
        }
        expect(act).toBe(exp);
    }, 10000);
});

Deno.test("isJunseichurempoto", async () => {
    await fixtures((params) => {
        const wins = NewWinForm({ ...params });
        let exp = false;
        if (params.yakus.map((e) => e.str).includes("純正九蓮宝燈")) {
            exp = true;
        }
        const act = wins.some((e) =>
            yaku.isJunseichurempoto({ ...params, ...e }).length !== 0
        );
        if (exp || exp != act) {
            console.log(`act: ${act}, exp: ${exp}`);
            console.log(params);
        }
        expect(act).toBe(exp);
    }, 10000);
});

Deno.test("isSukantsu", async () => {
    await fixtures((params) => {
        const wins = NewWinForm({ ...params });
        let exp = false;
        if (params.yakus.map((e) => e.str).includes("四槓子")) {
            exp = true;
        }
        const act = wins.some((e) =>
            yaku.isSukantsu({ ...params, ...e }).length !== 0
        );
        if (exp != act) {
            console.log(`act: ${act}, exp: ${exp}`);
            console.log(params);
        }
        expect(act).toBe(exp);
    }, 10000);
});

Deno.test("isChinitsu", async () => {
    await fixtures((params) => {
        const wins = NewWinForm({ ...params });
        let exp = false;

        if (params.yakus.map((e) => e.str).includes("九蓮宝燈")) {
            return;
        }
        if (params.yakus.map((e) => e.str).includes("清一色")) {
            exp = true;
        }
        const act = wins.some((e) =>
            yaku.isChinitsu({ ...params, ...e }).length !== 0
        );
        if (exp != act) {
            console.log(`act: ${act}, exp: ${exp}`);
            console.log(params);
        }
        expect(act).toBe(exp);
    }, 10000);
});

Deno.test("isHonitsu", async () => {
    await fixtures((params) => {
        const wins = NewWinForm({ ...params });
        let exp = false;

        const yakus = params.yakus.map((e) => e.str);
        if (
            yakus.includes("清一色") ||
            yakus.includes("小四喜") ||
            yakus.includes("大四喜") ||
            yakus.includes("字一色") ||
            yakus.includes("大三元")
        ) {
            return;
        }
        if (yakus.includes("混一色")) {
            exp = true;
        }
        const act = wins.some((e) =>
            yaku.isHonitsu({ ...params, ...e }).length !== 0
        );
        if (exp != act) {
            console.log(`act: ${act}, exp: ${exp}`);
            console.log(params);
        }
        expect(act).toBe(exp);
    }, 10000);
});

Deno.test("isSankantsu", async () => {
    await fixtures((params) => {
        const wins = NewWinForm({ ...params });
        let exp = false;
        if (params.yakus.map((e) => e.str).includes("三槓子")) {
            exp = true;
        }
        const act = wins.some((e) =>
            yaku.isSankantsu({ ...params, ...e }).length !== 0
        );
        if (exp != act) {
            console.log(`act: ${act}, exp: ${exp}`);
            console.log(params);
        }
        expect(act).toBe(exp);
    }, 10000);
});

Deno.test("isHonroto", async () => {
    await fixtures((params) => {
        const wins = NewWinForm({ ...params });
        let exp = false;

        const yakus = params.yakus.map((e) => e.str);
        if (yakus.includes("国士無双")) {
            return;
        }
        if (yakus.includes("混老頭")) {
            exp = true;
        }
        const act = wins.some((e) =>
            yaku.isHonroto({ ...params, ...e }).length !== 0
        );
        if (exp != act) {
            console.log(`act: ${act}, exp: ${exp}`);
            console.log(params);
        }
        expect(act).toBe(exp);
    }, 10000);
});

Deno.test("isJunchan", async () => {
    await fixtures((params) => {
        const wins = NewWinForm({ ...params });
        let exp = false;
        const yakus = params.yakus.map((e) => e.str);
        if (yakus.includes("混老頭") || yakus.includes("清老頭")) {
            return
        }
        if (yakus.includes("純全帯幺九")) {
            exp = true;
        }
        const act = wins.some((e) =>
            yaku.isJunchan({ ...params, ...e }).length !== 0
        );
        if (exp != act) {
            console.log(`act: ${act}, exp: ${exp}`);
            console.log(params);
        }
        expect(act).toBe(exp);
    }, 10000);
});

Deno.test("isShosangen", async () => {
    await fixtures((params) => {
        const wins = NewWinForm({ ...params });
        let exp = false;
        const yakus = params.yakus.map((e) => e.str);
        if (yakus.includes("大三元")) {
            return;
        }
        if (yakus.includes("小三元")) {
            exp = true;
        }
        const act = wins.some((e) =>
            yaku.isShosangen({ ...params, ...e }).length !== 0
        );
        if (exp != act) {
            console.log(`act: ${act}, exp: ${exp}`);
            console.log(params);
        }
        expect(act).toBe(exp);
    }, 10000);
});

Deno.test("isIkkitsukan", async () => {
    await fixtures((params) => {
        const wins = NewWinForm({ ...params });
        let exp = false;
        if (params.yakus.map((e) => e.str).includes("一気通貫")) {
            exp = true;
        }
        const act = wins.some((e) =>
            yaku.isIkkitsukan({ ...params, ...e }).length !== 0
        );
        if (exp != act) {
            console.log(`act: ${act}, exp: ${exp}`);
            console.log(params);
        }
        expect(act).toBe(exp);
    }, 10000);
});

Deno.test("isSanshokudojun", async () => {
    await fixtures((params) => {
        const wins = NewWinForm({ ...params });
        let exp = false;
        const yakus = params.yakus.map((e) => e.str);
        if (yakus.includes("三色同順")) {
            exp = true;
        }
        const act = wins.some((e) =>
            yaku.isSanshokudojun({ ...params, ...e }).length !== 0
        );
        if (exp != act) {
            console.log(`act: ${act}, exp: ${exp}`);
            console.log(params);
        }
        expect(act).toBe(exp);
    }, 10000);
});

Deno.test("isSanshokudokoku", async () => {
    await fixtures((params) => {
        const wins = NewWinForm({ ...params });
        let exp = false;
        const yakus = params.yakus.map((e) => e.str);
        if (yakus.includes("三色同刻")) {
            exp = true;
        }
        const act = wins.some((e) =>
            yaku.isSanshokudokoku({ ...params, ...e }).length !== 0
        );
        if (exp != act) {
            console.log(`act: ${act}, exp: ${exp}`);
            console.log(params);
        }
        expect(act).toBe(exp);
    }, 10000);
});

Deno.test("isToitoiho", async () => {
    await fixtures((params) => {
        const wins = NewWinForm({ ...params });
        let exp = false;
        const yakus = params.yakus.map((e) => e.str);
        if (yakus.includes("四暗刻")) {
            return;
        }
        if (yakus.includes("対々和")) {
            exp = true;
        }
        const act = wins.some((e) =>
            yaku.isToitoiho({ ...params, ...e }).length !== 0
        );
        if (exp != act) {
            console.log(`act: ${act}, exp: ${exp}`);
            console.log(params);
        }
        expect(act).toBe(exp);
    }, 10000);
});
