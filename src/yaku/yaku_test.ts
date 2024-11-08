import { expect } from "jsr:@std/expect";
import { fixtures, params } from "../utils/utils.ts";
import { NewWinForm } from "../winform/winform.ts";
import * as yaku from "./yaku.ts";

const checkYaku = (
    params: params,
    name: string,
    yakufunc: (params: yaku.params) => yaku.yaku[],
): void => {
    if (params.yakus.some((e) => e.yakuman)) {
        return;
    }

    const wins = NewWinForm({ ...params });
    const expYaku = params.yakus.find((e) => e.str == name);

    let actYaku: yaku.yaku | undefined = undefined;
    for (const win of wins) {
        const mybYaku = yakufunc({ ...params, ...win }).find((e) =>
            e.str == name
        );
        if (mybYaku) {
            actYaku = mybYaku;
        }
    }
    try {
        expect(actYaku).toEqual(expYaku);
    } catch (e) {
        console.log(actYaku, expYaku);
        console.log(params);
        throw e;
    }
};

Deno.test("isTsumo", async () => {
    await fixtures(
        (params) => checkYaku(params, "門前清自摸和", yaku.isTsumo),
        10000,
    );
});

Deno.test("isRichi", async () => {
    await fixtures((params) => checkYaku(params, "立直", yaku.isRichi), 10000);
});

Deno.test("isIppatsu", async () => {
    await fixtures(
        (params) => checkYaku(params, "一発", yaku.isIppatsu),
        10000,
    );
});

Deno.test("isChankan", async () => {
    await fixtures(
        (params) => checkYaku(params, "槍槓", yaku.isChankan),
        10000,
    );
});

Deno.test("isRinshankaiho", async () => {
    await fixtures(
        (params) => checkYaku(params, "嶺上開花", yaku.isRinshankaiho),
        10000,
    );
});

Deno.test("isHaitei", async () => {
    await fixtures(
        (params) => checkYaku(params, "海底摸月", yaku.isHaitei),
        10000,
    );
});

Deno.test("isHoutei", async () => {
    await fixtures(
        (params) => checkYaku(params, "河底撈魚", yaku.isHoutei),
        10000,
    );
});

Deno.test("isPinfu", async () => {
    await fixtures((params) => checkYaku(params, "平和", yaku.isPinfu), 10000);
});

Deno.test("isTanyao", async () => {
    await fixtures(
        (params) => checkYaku(params, "断幺九", yaku.isTanyao),
        10000,
    );
});

Deno.test("isIpeko", async () => {
    await fixtures(
        (params) => checkYaku(params, "一盃口", yaku.isIpeko),
        10000,
    );
});

Deno.test("isJikaze", async () => {
    await fixtures(
        (params) =>
            checkYaku(params, `自風 ${params.paiJikaze.dsp}`, yaku.isJikaze),
        10000,
    );
});

Deno.test("isBakaze", async () => {
    await fixtures(
        (params) =>
            checkYaku(params, `場風 ${params.paiBakaze.dsp}`, yaku.isBakaze),
        10000,
    );
});

Deno.test("isHaku", async () => {
    await fixtures(
        (params) => checkYaku(params, "役牌 白", yaku.isHaku),
        10000,
    );
});

Deno.test("isHatsu", async () => {
    await fixtures(
        (params) => checkYaku(params, "役牌 發", yaku.isHatsu),
        10000,
    );
});

Deno.test("isChun", async () => {
    await fixtures(
        (params) => checkYaku(params, "役牌 中", yaku.isChun),
        10000,
    );
});

Deno.test("isDabururichi", async () => {
    await fixtures(
        (params) => checkYaku(params, "両立直", yaku.isDabururichi),
        10000,
    );
});

Deno.test("isChanta", async () => {
    await fixtures(
        (params) => checkYaku(params, "混全帯幺九", yaku.isChanta),
        10000,
    );
});

Deno.test("isIkkitsukan", async () => {
    await fixtures(
        (params) => checkYaku(params, "一気通貫", yaku.isIkkitsukan),
        10000,
    );
});

Deno.test("isSanshokudojun", async () => {
    await fixtures(
        (params) => checkYaku(params, "三色同順", yaku.isSanshokudojun),
        10000,
    );
});

Deno.test("isSanshokudokoku", async () => {
    await fixtures(
        (params) => checkYaku(params, "三色同刻", yaku.isSanshokudokoku),
        10000,
    );
});

Deno.test("isSananko", async () => {
    await fixtures(
        (params) => checkYaku(params, "三暗刻", yaku.isSananko),
        10000,
    );
});

Deno.test("isToitoiho", async () => {
    await fixtures(
        (params) => checkYaku(params, "対々和", yaku.isToitoiho),
        10000,
    );
});

Deno.test("isSananko", async () => {
    await fixtures(
        (params) => checkYaku(params, "三暗刻", yaku.isSananko),
        10000,
    );
});

Deno.test("isShosangen", async () => {
    await fixtures(
        (params) => checkYaku(params, "小三元", yaku.isShosangen),
        10000,
    );
});

Deno.test("isHonroto", async () => {
    await fixtures(
        (params) => checkYaku(params, "混老頭", yaku.isHonroto),
        10000,
    );
});

Deno.test("isRyampeko", async () => {
    await fixtures(
        (params) => checkYaku(params, "二盃口", yaku.isRyampeko),
        10000,
    );
});

Deno.test("isJunchan", async () => {
    await fixtures(
        (params) => checkYaku(params, "純全帯幺九", yaku.isJunchan),
        10000,
    );
});

Deno.test("isHonitsu", async () => {
    await fixtures(
        (params) => checkYaku(params, "混一色", yaku.isHonitsu),
        10000,
    );
});

Deno.test("isChinitsu", async () => {
    await fixtures(
        (params) => checkYaku(params, "清一色", yaku.isChinitsu),
        10000,
    );
});