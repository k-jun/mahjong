// @deno-types="npm:@types/jsdom"
import { JSDOM } from "npm:jsdom";
import { Pai } from "../pai/pai.ts";
import { PaiSet, PaiSetType } from "../paiset/paiset.ts";
import { yakus as constantYakus } from "../constant/constant.ts";
type state = {
  isYonmaAriAriAka: boolean;
  oya: number;
  kyoku: number;
};

export type params = {
  paiBakaze: Pai;
  paiJikaze: Pai;
  paiDora: Pai[];
  paiDoraUra: Pai[];
  paiRest: Pai[];
  paiLast: Pai;
  paiSets: PaiSet[];
  yakus: { str: string; val: number; yakuman?: boolean }[];
  options: {
    isTsumo: boolean;
    isRichi: boolean;
    isDabururichi: boolean;
    isIppatsu: boolean;
    isHaitei: boolean;
    isHoutei: boolean;
    isChankan: boolean;
    isRinshankaiho: boolean;
    isChiho: boolean;
    isTenho: boolean;
  };
};

export const fixtures = async (
  func: (arg0: params) => void,
  limit: number = 1_000_000_000,
) => {
  let cnt = 0;
  for await (const d of Deno.readDir("./fixtures/")) {
    for await (const f of Deno.readDir(`./fixtures/${d.name}`)) {
      const text = await Deno.readTextFile(
        `./fixtures/${d.name}/${f.name}`,
      );

      const dom = new JSDOM(text, { contentType: "text/xml" });
      let state: state = {
        isYonmaAriAriAka: false,
        oya: 0,
        kyoku: 0,
      };

      for (const e of dom.window.document.children[0].children) {
        switch (e.tagName) {
          case "GO":
            state = _go(e, state);
            break;
          case "INIT":
            state = _init(e, state);
            break;
          case "AGARI":
            if (state.isYonmaAriAriAka) {
              _agari(e, state, func);
              cnt += 1;
            }
            break;
        }
      }
      if (cnt >= limit) {
        break;
      }
    }
    if (cnt >= limit) {
      break;
    }
  }
};

const _go = (e: Element, s: state): state => {
  let isYonmaAriAriAka = true;
  const typ = Number(e.attributes.getNamedItem("type")?.value);
  if (
    // 赤ドラ
    Boolean(typ & (1 << 1)) ||
    // 喰いタン、後付け
    Boolean(typ & (1 << 2)) ||
    // 四麻
    Boolean(typ & (1 << 4))
  ) {
    isYonmaAriAriAka = false;
  }
  return { ...s, isYonmaAriAriAka };
};

const _init = (e: Element, s: state): state => {
  const kyoku = Number(e.attributes.getNamedItem("seed")?.value.split(",")[0]);
  const oya = Number(e.attributes.getNamedItem("oya")?.value);
  return { ...s, kyoku, oya };
};

const _agari = (e: Element, s: state, f: (arg0: params) => void) => {
  const attrs: { [key: string]: string } = {};
  for (let i = 0; i < e.attributes.length; i++) {
    const attr = e.attributes[i];
    attrs[attr.name] = attr.value;
  }
  const kazes = [
    new Pai(4 * 3 * 9), // 東
    new Pai(4 * 3 * 9 + 4), // 南
    new Pai(4 * 3 * 9 + 8), // 西
    new Pai(4 * 3 * 9 + 12), // 北
  ];
  const paiBakaze = kazes[Math.floor(s.kyoku / 4)];
  const paiJikaze = kazes[(Number(attrs["who"]) - (s.kyoku % 4) + 4) % 4];

  const paiDora = attrs["doraHai"].split(",").map((e) =>
    new Pai(Number(e)).next()
  );

  const paiDoraUra: Array<Pai> = [];
  if (attrs["doraHaiUra"]) {
    attrs["doraHaiUra"].split(",").forEach((e) => {
      paiDoraUra.push(new Pai(Number(e)).next());
    });
  }
  const yakus: { str: string; val: number; yakuman?: boolean }[] = [];
  if (attrs["yaku"]) {
    const a = attrs["yaku"].split(",");
    for (let i = 0; i < a.length; i += 2) {
      yakus.push({ str: constantYakus[Number(a[i])], val: Number(a[i + 1]) });
    }
  }

  if (attrs["yakuman"]) {
    attrs["yakuman"].split(",").forEach((e) => {
      const str = constantYakus[Number(e)];
      let val = 1;
      if (
        ["四暗刻単騎", "純正九蓮宝燈", "国士無双１３面", "大四喜"].includes(str)
      ) {
        val = 2;
      }
      yakus.push({ str, val, yakuman: true });
    });
  }

  const isTsumo = attrs["who"] == attrs["fromWho"];
  const isIppatsu = yakus.some((e) => e.str == "一発");
  const isRichi = yakus.some((e) => e.str == "立直");
  const isDabururichi = yakus.some((e) => e.str == "両立直");
  const isHaitei = yakus.some((e) => e.str == "海底摸月");
  const isHoutei = yakus.some((e) => e.str == "河底撈魚");
  const isChankan = yakus.some((e) => e.str == "槍槓");
  const isRinshankaiho = yakus.some((e) => e.str == "嶺上開花");
  const isChiho = yakus.some((e) => e.str == "地和");
  const isTenho = yakus.some((e) => e.str == "天和");

  const paiSets: PaiSet[] = [];
  if (attrs["m"]) {
    for (const mi of attrs["m"].split(",")) {
      paiSets.push(_parseM(Number(mi)));
    }
  }
  const paiLast = new Pai(Number(attrs["machi"]));
  const paiRest =
    attrs["hai"].split(",").map((e: string) => new Pai(Number(e))) ??
      [];

  f({
    paiBakaze,
    paiJikaze,
    paiDora,
    paiDoraUra,
    paiRest,
    paiSets,
    paiLast,
    yakus,
    options: {
      isTsumo,
      isRichi,
      isDabururichi,
      isIppatsu,
      isHaitei,
      isHoutei,
      isChankan,
      isRinshankaiho,
      isChiho,
      isTenho,
    },
  });
};

const _parseM = (m: number): PaiSet => {
  const fromWho = m & 3;
  // 0: 鳴きなし、1: 下家、2: 対面、3: 上家。
  if (m & (1 << 2)) {
    // 順子
    let t = (m & 0xFC00) >> 10;
    const nakiIdx = t % 3;
    t = Math.floor(t / 3);
    t = Math.floor(t / 7) * 9 + t % 7;
    t *= 4;
    const h = [
      t + 4 * 0 + ((m & 0x0018) >> 3),
      t + 4 * 1 + ((m & 0x0060) >> 5),
      t + 4 * 2 + ((m & 0x0180) >> 7),
    ];

    const pais = h.map((e) => new Pai(e));
    return new PaiSet({ type: PaiSetType.MINSHUN, pais, nakiIdx, fromWho });
  } else if (m & (1 << 3) || m & (1 << 4)) {
    // 刻子、加槓
    const extra = (m & 0x0060) >> 5;
    let t = (m & 0xFE00) >> 9;
    const nakiIdx = t % 3;
    t = Math.floor(t / 3);
    t *= 4;
    const h = [t, t, t];
    switch (extra) {
      case 0:
        h[0] += 1;
        h[1] += 2;
        h[2] += 3;
        break;
      case 1:
        h[0] += 0;
        h[1] += 2;
        h[2] += 3;
        break;
      case 2:
        h[0] += 0;
        h[1] += 1;
        h[2] += 3;
        break;
      case 3:
        h[0] += 0;
        h[1] += 1;
        h[2] += 2;
        break;
    }
    if (m & (1 << 3)) {
      // 刻子
      const pais = h.map((e) => new Pai(e));
      return new PaiSet({ type: PaiSetType.MINKO, pais, nakiIdx, fromWho });
    } else {
      // 加槓
      h.unshift(t + extra);
      const pais = h.map((e) => new Pai(e));
      return new PaiSet({ type: PaiSetType.KAKAN, pais, nakiIdx, fromWho });
    }
  } else {
    let hai0 = (m & 0xFF00) >> 8;
    const t = Math.floor(hai0 / 4) * 4;
    if (fromWho == 0) {
      // 暗槓
      const h = [t, t + 1, t + 2, t + 3];
      const pais = h.map((e) => new Pai(e));
      return new PaiSet({
        type: PaiSetType.ANKAN,
        pais,
        nakiIdx: 0,
        fromWho,
      });
    } else {
      // 大明槓
      const h = [t, t, t];
      switch (hai0 % 4) {
        case 0:
          h[0] += 1;
          h[1] += 2;
          h[2] += 3;
          break;
        case 1:
          h[0] += 0;
          h[1] += 2;
          h[2] += 3;
          break;
        case 2:
          h[0] += 0;
          h[1] += 1;
          h[2] += 3;
          break;
        case 3:
          h[0] += 0;
          h[1] += 1;
          h[2] += 2;
          break;
      }
      if (fromWho == 1) {
        const a = hai0;
        hai0 = h[2];
        h[2] = a;
      }
      if (fromWho == 2) {
        const a = hai0;
        hai0 = h[0];
        h[0] = a;
      }
      h.unshift(hai0);
      const pais = h.map((e) => new Pai(e));
      return new PaiSet({
        type: PaiSetType.MINKAN,
        pais,
        nakiIdx: 0,
        fromWho,
      });
    }
  }
};
