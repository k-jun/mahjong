import { expect } from "jsr:@std/expect";
import { fixtures } from "../utils/utils.ts";
import { WinFormFactory } from "../winform/winform.ts";
import { params, Tokuten } from "./tokuten.ts";
import { YakuFactory } from "./yaku.ts";

import { Pai } from "../pai/pai.ts";
import { PaiSet } from "../paiset/paiset.ts";

const common = (params: params): {
    maxHan: number;
    maxFu: number;
    isYakuman: boolean;
} => {
    const winFactory = new WinFormFactory();
    const yakuFactory = new YakuFactory();
    const wins = winFactory.create({ ...params });
    const tokuten = new Tokuten(params);

    let maxHan = 0;
    let maxFu = 0;
    let isYakuman = false;
    for (const win of wins) {
        const mbyYaku = yakuFactory.create({ ...params, ...win });
        if (mbyYaku.every((yaku) => yaku.yakuman)) {
            isYakuman = true;
            maxHan = mbyYaku.reduce((a, b) => a + b.val, 0);
            maxFu = Math.max(maxFu, tokuten.calcFu({ ...win }));
            break;
        }
        const han = mbyYaku.reduce((a, b) => a + b.val, 0);
        if (han >= maxHan) {
            if (han > maxHan) {
                maxFu = 0;
            }
            maxHan = han;
            maxFu = Math.max(maxFu, tokuten.calcFu({ ...win }));
        }
    }

    return {
        maxHan,
        maxFu,
        isYakuman,
    };
};

Deno.test("calcFuDebug1", () => {
    const params = {
        paiBakaze: new Pai(108), // "z1"
        paiJikaze: new Pai(108), // z1 (東)
        paiDora: [new Pai(124)], // z5 (白)
        paiDoraUra: [],
        paiRest: [
          new Pai(54), // p5
          new Pai(56), // p6
          new Pai(57), // p6
          new Pai(62), // p7
          new Pai(63), // p7
          new Pai(65), // p8
          new Pai(84), // s4
          new Pai(85), // s4
          new Pai(86), // s4
          new Pai(109), // z1 (東)
          new Pai(111), // z1 (東)
        ],
        paiSets: [
          new PaiSet({
            pais: [
              new Pai(132), // z7 (中)
              new Pai(134), // z7 (中)
              new Pai(135), // z7 (中)
            ],
            type: 2, // MINKO
            nakiIdx: 1,
            fromWho: 1
          })
        ],
        paiLast: new Pai(65), // p8
        yakus: [ { str: "役牌 中", val: 1, yakuman: false } ],
        fu: 40,
        ten: 2000,
        options: {
          isTsumo: false,
          isRichi: false,
          isDabururichi: false,
          isIppatsu: false,
          isHaitei: false,
          isHoutei: false,
          isChankan: false,
          isRinshankaiho: false,
          isChiho: false,
          isTenho: false,
          isOya: true
        }
      }
    const { maxFu } = common(params);
    expect(maxFu).toEqual(params.fu);
});

Deno.test("calcFuDebug2", () => {
    const params = {
        paiBakaze: new Pai(108), // z1
        paiJikaze: new Pai(108), // z1
        paiDora: [new Pai(52)], // pr
        paiDoraUra: [new Pai(120)], // z4
        paiRest: [
          new Pai(32), // m9
          new Pai(33), // m9
          new Pai(34), // m9
          new Pai(57), // p6
          new Pai(62), // p7
          new Pai(64), // p8
          new Pai(68), // p9
          new Pai(69), // p9
          new Pai(71), // p9
          new Pai(81), // s3
          new Pai(86), // s4
          new Pai(88), // sr
          new Pai(108), // z1
          new Pai(111), // z1
        ],
        paiSets: [],
        paiLast: new Pai(32), // m9
        yakus: [
          { str: "立直", val: 1, yakuman: false },
          { str: "門前清自摸和", val: 1, yakuman: false },
          { str: "赤ドラ", val: 1, yakuman: false },
          { str: "裏ドラ", val: 0, yakuman: false }
        ],
        fu: 40,
        ten: 7800,
        options: {
          isTsumo: true,
          isRichi: true,
          isDabururichi: false,
          isIppatsu: false,
          isHaitei: false,
          isHoutei: false,
          isChankan: false,
          isRinshankaiho: false,
          isChiho: false,
          isTenho: false,
          isOya: true
        }
      }
    const { maxFu } = common(params);
    expect(maxFu).toEqual(params.fu);
});

Deno.test("calcFu", async () => {
    await fixtures(
        (params) => {
            try {
                const { maxFu } = common(params);
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
        const { maxHan, maxFu, isYakuman } = common(params);
        const tokuten = new Tokuten(params);

        const scores = tokuten.calcTsumoPoint({
            han: maxHan,
            fu: maxFu,
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
        const { maxHan, maxFu, isYakuman } = common(params);
        const tokuten = new Tokuten(params);

        const scores = tokuten.calcRonPoint({
            han: maxHan,
            fu: maxFu,
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

Deno.test("count", async () => {
    await fixtures((params) => {
        const tokuten = new Tokuten(params);
        const result = tokuten.count();
        try {
            expect(result.pointSum).toEqual(params.ten);
        } catch (e) {
            console.log(params);
            throw e;
        }
    });
});
