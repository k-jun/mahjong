import { expect } from "jsr:@std/expect";
import { fixtures } from "../utils/utils.ts";
import { WinFormFactory } from "../winform/winform.ts";
import { params, Tokuten } from "./tokuten.ts";
import { YakuFactory } from "./yaku.ts";

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
        params.options.isOya ? scores[0] * 3 : scores[0] * 2 + scores[1],
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
