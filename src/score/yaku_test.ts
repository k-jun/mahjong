import { expect } from "jsr:@std/expect";
import { fixtures, params } from "../utils/utils.ts";
import { NewWinForm } from "../winform/winform.ts";
import * as yaku from "./yaku.ts";

const checkYaku = (
    params: params,
    name: string,
    yakufunc: (params: yaku.params) => yaku.yaku[],
    isYakuman: boolean = false,
): void => {
    if (!isYakuman && params.yakus.some((e) => e.yakuman)) {
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

Deno.test("isTenho", async () => {
    await fixtures(
        (params) => checkYaku(params, "天和", yaku.isTenho, true),
        10000,
    );
});

Deno.test("isChiho", async () => {
    await fixtures(
        (params) => checkYaku(params, "地和", yaku.isChiho, true),
        10000,
    );
});

Deno.test("isDaisangen", async () => {
    await fixtures(
        (params) => checkYaku(params, "大三元", yaku.isDaisangen, true),
        10000,
    );
});

Deno.test("isSuanko", async () => {
    await fixtures(
        (params) => checkYaku(params, "四暗刻", yaku.isSuanko, true),
        10000,
    );
});

Deno.test("isSankoTanki", async () => {
    await fixtures(
        (params) => checkYaku(params, "四暗刻単騎", yaku.isSuankotanki, true),
        10000,
    );
});

Deno.test("isTsuiso", async () => {
    await fixtures(
        (params) => checkYaku(params, "字一色", yaku.isTsuiso, true),
        10000,
    );
});

Deno.test("isRyuiso", async () => {
    await fixtures(
        (params) => checkYaku(params, "緑一色", yaku.isRyuiso, true),
        10000,
    );
});

Deno.test("isChinroto", async () => {
    await fixtures(
        (params) => checkYaku(params, "清老頭", yaku.isChinroto, true),
        10000,
    );
});

Deno.test("isChurempoto", async () => {
    await fixtures(
        (params) => checkYaku(params, "九蓮宝燈", yaku.isChurempoto, true),
        10000,
    );
});

Deno.test("isJunseichurempoto", async () => {
    await fixtures(
        (params) =>
            checkYaku(params, "純正九蓮宝燈", yaku.isJunseichurempoto, true),
        10000,
    );
});

Deno.test("isDaisushi", async () => {
    await fixtures(
        (params) => checkYaku(params, "大四喜", yaku.isDaisushi, true),
        10000,
    );
});

Deno.test("isShosushi", async () => {
    await fixtures(
        (params) => checkYaku(params, "小四喜", yaku.isShosushi, true),
        10000,
    );
});

Deno.test("isSukantsu", async () => {
    await fixtures(
        (params) => checkYaku(params, "四槓子", yaku.isSukantsu, true),
        10000,
    );
});

Deno.test("isDra", async () => {
    await fixtures((params) => checkYaku(params, "ドラ", yaku.isDra), 10000);
});

Deno.test("isDraUra", async () => {
    await fixtures(
        (params) => checkYaku(params, "裏ドラ", yaku.isDraUra),
        10000,
    );
});

Deno.test("isDoraAka", async () => {
    await fixtures(
        (params) => checkYaku(params, "赤ドラ", yaku.isDoraAka),
        10000,
    );
});

Deno.test("findYakus", async () => {
    await fixtures((params) => {
        const wins = NewWinForm({ ...params });

        let max = 0;
        let actYakus: yaku.yaku[] = [];
        for (const win of wins) {
            const mybYakus = yaku.findYakus({ ...params, ...win });
            const han = mybYakus.reduce((a, b) => a + b.val, 0);
            if (max < han) {
                max = han;
                actYakus = mybYakus;
            }
        }

        const actSort = actYakus.sort((a, b) => a.str.localeCompare(b.str));
        const expSort = params.yakus.sort((a, b) => a.str.localeCompare(b.str));
        try {
            expect(actSort).toEqual(expSort);
        } catch (e) {
            console.log(actSort, expSort);
            console.log(params);
            throw e;
        }
    });
});