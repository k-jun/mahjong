import { expect } from "jsr:@std/expect";
import { fixtures, params } from "../utils/utils.ts";
import { internalParams } from "./tokuten.ts";
import { WinFormFactory } from "../winform/winform.ts";
import * as yaku from "./yaku.ts";

const checkYaku = (
  params: params,
  name: string,
  yakufunc: (params: internalParams) => yaku.Yaku[],
  isYakuman: boolean = false,
): void => {
  if (!isYakuman && params.yakus.some((e) => e.yakuman)) {
    return;
  }

  const factory = new WinFormFactory();
  const wins = factory.create({ ...params });
  const expYaku = params.yakus.find((e) => e.str == name);

  let actYaku: yaku.Yaku | undefined = undefined;
  for (const win of wins) {
    const mybYaku = yakufunc({ ...params, ...win }).find((e) => e.str == name);
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

const factory = new yaku.YakuFactory();

Deno.test("isTsumo", async () => {
  await fixtures(
    (params) => checkYaku(params, "門前清自摸和", factory.isTsumo),
    10000,
  );
});

Deno.test("isRichi", async () => {
  await fixtures((params) => checkYaku(params, "立直", factory.isRichi), 10000);
});

Deno.test("isIppatsu", async () => {
  await fixtures(
    (params) => checkYaku(params, "一発", factory.isIppatsu),
    10000,
  );
});

Deno.test("isChankan", async () => {
  await fixtures(
    (params) => checkYaku(params, "槍槓", factory.isChankan),
    10000,
  );
});

Deno.test("isRinshankaiho", async () => {
  await fixtures(
    (params) => checkYaku(params, "嶺上開花", factory.isRinshankaiho),
    10000,
  );
});

Deno.test("isHaitei", async () => {
  await fixtures(
    (params) => checkYaku(params, "海底摸月", factory.isHaitei),
    10000,
  );
});

Deno.test("isHoutei", async () => {
  await fixtures(
    (params) => checkYaku(params, "河底撈魚", factory.isHoutei),
    10000,
  );
});

Deno.test("isPinfu", async () => {
  await fixtures((params) => checkYaku(params, "平和", factory.isPinfu), 10000);
});

Deno.test("isTanyao", async () => {
  await fixtures(
    (params) => checkYaku(params, "断幺九", factory.isTanyao),
    10000,
  );
});

Deno.test("isIpeko", async () => {
  await fixtures(
    (params) => checkYaku(params, "一盃口", factory.isIpeko),
    10000,
  );
});

Deno.test("isJikaze", async () => {
  await fixtures(
    (params) =>
      checkYaku(params, `自風 ${params.paiJikaze.dsp}`, factory.isJikaze),
    10000,
  );
});

Deno.test("isBakaze", async () => {
  await fixtures(
    (params) =>
      checkYaku(params, `場風 ${params.paiBakaze.dsp}`, factory.isBakaze),
    10000,
  );
});

Deno.test("isHaku", async () => {
  await fixtures(
    (params) => checkYaku(params, "役牌 白", factory.isHaku),
    10000,
  );
});

Deno.test("isHatsu", async () => {
  await fixtures(
    (params) => checkYaku(params, "役牌 發", factory.isHatsu),
    10000,
  );
});

Deno.test("isChun", async () => {
  await fixtures(
    (params) => checkYaku(params, "役牌 中", factory.isChun),
    10000,
  );
});

Deno.test("isDabururichi", async () => {
  await fixtures(
    (params) => checkYaku(params, "両立直", factory.isDabururichi),
    10000,
  );
});

Deno.test("isChanta", async () => {
  await fixtures(
    (params) => checkYaku(params, "混全帯幺九", factory.isChanta),
    10000,
  );
});

Deno.test("isIkkitsukan", async () => {
  await fixtures(
    (params) => checkYaku(params, "一気通貫", factory.isIkkitsukan),
    10000,
  );
});

Deno.test("isSanshokudojun", async () => {
  await fixtures(
    (params) => checkYaku(params, "三色同順", factory.isSanshokudojun),
    10000,
  );
});

Deno.test("isSanshokudokoku", async () => {
  await fixtures(
    (params) => checkYaku(params, "三色同刻", factory.isSanshokudokoku),
    10000,
  );
});

Deno.test("isSananko", async () => {
  await fixtures(
    (params) => checkYaku(params, "三暗刻", factory.isSananko),
    10000,
  );
});

Deno.test("isToitoiho", async () => {
  await fixtures(
    (params) => checkYaku(params, "対々和", factory.isToitoiho),
    10000,
  );
});

Deno.test("isSananko", async () => {
  await fixtures(
    (params) => checkYaku(params, "三暗刻", factory.isSananko),
    10000,
  );
});

Deno.test("isShosangen", async () => {
  await fixtures(
    (params) => checkYaku(params, "小三元", factory.isShosangen),
    10000,
  );
});

Deno.test("isHonroto", async () => {
  await fixtures(
    (params) => checkYaku(params, "混老頭", factory.isHonroto),
    10000,
  );
});

Deno.test("isRyampeko", async () => {
  await fixtures(
    (params) => checkYaku(params, "二盃口", factory.isRyampeko),
    10000,
  );
});

Deno.test("isJunchan", async () => {
  await fixtures(
    (params) => checkYaku(params, "純全帯幺九", factory.isJunchan),
    10000,
  );
});

Deno.test("isHonitsu", async () => {
  await fixtures(
    (params) => checkYaku(params, "混一色", factory.isHonitsu),
    10000,
  );
});

Deno.test("isChinitsu", async () => {
  await fixtures(
    (params) => checkYaku(params, "清一色", factory.isChinitsu),
    10000,
  );
});

Deno.test("isTenho", async () => {
  await fixtures(
    (params) => checkYaku(params, "天和", factory.isTenho, true),
    10000,
  );
});

Deno.test("isChiho", async () => {
  await fixtures(
    (params) => checkYaku(params, "地和", factory.isChiho, true),
    10000,
  );
});

Deno.test("isDaisangen", async () => {
  await fixtures(
    (params) => checkYaku(params, "大三元", factory.isDaisangen, true),
    10000,
  );
});

Deno.test("isSuanko", async () => {
  await fixtures(
    (params) => checkYaku(params, "四暗刻", factory.isSuanko, true),
    10000,
  );
});

Deno.test("isSankoTanki", async () => {
  await fixtures(
    (params) => checkYaku(params, "四暗刻単騎", factory.isSuankotanki, true),
    10000,
  );
});

Deno.test("isTsuiso", async () => {
  await fixtures(
    (params) => checkYaku(params, "字一色", factory.isTsuiso, true),
    10000,
  );
});

Deno.test("isRyuiso", async () => {
  await fixtures(
    (params) => checkYaku(params, "緑一色", factory.isRyuiso, true),
    10000,
  );
});

Deno.test("isChinroto", async () => {
  await fixtures(
    (params) => checkYaku(params, "清老頭", factory.isChinroto, true),
    10000,
  );
});

Deno.test("isChurempoto", async () => {
  await fixtures(
    (params) => checkYaku(params, "九蓮宝燈", factory.isChurempoto, true),
    10000,
  );
});

Deno.test("isJunseichurempoto", async () => {
  await fixtures(
    (params) =>
      checkYaku(params, "純正九蓮宝燈", factory.isJunseichurempoto, true),
    10000,
  );
});

Deno.test("isDaisushi", async () => {
  await fixtures(
    (params) => checkYaku(params, "大四喜", factory.isDaisushi, true),
    10000,
  );
});

Deno.test("isShosushi", async () => {
  await fixtures(
    (params) => checkYaku(params, "小四喜", factory.isShosushi, true),
    10000,
  );
});

Deno.test("isSukantsu", async () => {
  await fixtures(
    (params) => checkYaku(params, "四槓子", factory.isSukantsu, true),
    10000,
  );
});

Deno.test("isDra", async () => {
  await fixtures((params) => checkYaku(params, "ドラ", factory.isDra), 10000);
});

Deno.test("isDraUra", async () => {
  await fixtures(
    (params) => checkYaku(params, "裏ドラ", factory.isDraUra),
    10000,
  );
});

Deno.test("isDoraAka", async () => {
  await fixtures(
    (params) => checkYaku(params, "赤ドラ", factory.isDoraAka),
    10000,
  );
});

Deno.test("findYakus", async () => {
  await fixtures((params) => {
    const winFactory = new WinFormFactory();
    const wins = winFactory.create({ ...params });

    const mbyYakus: yaku.Yaku[][] = [];
    for (const win of wins) {
      mbyYakus.push(factory.create({ ...params, ...win }));
    }

    const max = mbyYakus.reduce((a, b) => {
      const han = b.reduce((a, b) => a + b.val, 0);
      return Math.max(a, han);
    }, 0);
    const actYakus = mbyYakus.filter((e) =>
      e.reduce((a, b) => a + b.val, 0) == max
    );

    actYakus.map((e) => e.sort((a, b) => a.str.localeCompare(b.str)));
    const expSort = params.yakus.sort((a, b) => a.str.localeCompare(b.str));

    try {
      expect(actYakus).toContainEqual(expSort);
    } catch (e) {
      console.log(actYakus, expSort);
      console.log(params);
      throw e;
    }
  }, 10000);
});
