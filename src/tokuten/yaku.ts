import { Pai, PaiType } from "../pai/pai.ts";
import { MachiType, PaiSetType } from "../paiset/paiset.ts";
import { deepCopy } from "../utils/utils.ts";

import { internalParams } from "./tokuten.ts";

export type yakuParams = {
  str: string;
  val: number;
  yakuman?: boolean;
};

export class Yaku {
  str: string;
  val: number;
  yakuman: boolean;

  constructor(params: yakuParams) {
    this.str = params.str;
    this.val = params.val;
    this.yakuman = params.yakuman || false;
  }
}

export class YakuFactory {
  create(params: internalParams): Yaku[] {
    const { paiChitoi, paiKokushi, paiLast } = params;

    if (paiKokushi) {
      const map: Record<string, number> = {};
      for (const p of paiKokushi) {
        map[p.fmt] = (map[p.fmt] || 0) + 1;
      }
      if (map[paiLast.fmt] == 2) {
        return [{ str: "国士無双１３面", val: 1, yakuman: true }];
      }
      return [
        { str: "国士無双", val: 1, yakuman: true },
      ];
    }
    const yakuYakuman = [
      ...this.isChiho(params),
      ...this.isTenho(params),
      ...this.isDaisangen(params),
      ...this.isSuanko(params),
      ...this.isSuankotanki(params),
      ...this.isTsuiso(params),
      ...this.isRyuiso(params),
      ...this.isChinroto(params),
      ...this.isChurempoto(params),
      ...this.isJunseichurempoto(params),
      ...this.isDaisushi(params),
      ...this.isShosushi(params),
      ...this.isSukantsu(params),
    ];
    if (yakuYakuman.length > 0) {
      return yakuYakuman;
    }
    return [
      ...this.isTsumo(params),
      ...this.isRichi(params),
      ...this.isIppatsu(params),
      ...this.isChankan(params),
      ...this.isRinshankaiho(params),
      ...this.isHaitei(params),
      ...this.isHoutei(params),
      ...this.isPinfu(params),
      ...this.isTanyao(params),
      ...this.isIpeko(params),
      ...this.isJikaze(params),
      ...this.isBakaze(params),
      ...this.isHaku(params),
      ...this.isHatsu(params),
      ...this.isChun(params),
      ...this.isDabururichi(params),
      ...(paiChitoi ? [new Yaku({ str: "七対子", val: 2 })] : []),
      ...this.isChanta(params),
      ...this.isIkkitsukan(params),
      ...this.isSanshokudojun(params),
      ...this.isSanshokudokoku(params),
      ...this.isSankantsu(params),
      ...this.isToitoiho(params),
      ...this.isSananko(deepCopy(params)),
      ...this.isShosangen(params),
      ...this.isHonroto(params),
      ...this.isRyampeko(params),
      ...this.isJunchan(params),
      ...this.isHonitsu(params),
      ...this.isChinitsu(params),
      ...this.isDra(params),
      ...this.isDraUra(params),
      ...this.isDoraAka(params),
    ];
  }

  isTsumo({ options, paiSets }: internalParams): Yaku[] {
    const isTsumo = options.isTsumo;
    const isMenzen = paiSets.every((e) => e.isClose());
    if (!isTsumo || !isMenzen) {
      return [];
    }
    return [new Yaku({ str: "門前清自摸和", val: 1 })];
  }

  isRichi({ options }: internalParams): Yaku[] {
    if (!options.isRichi) {
      return [];
    }
    return [new Yaku({ str: "立直", val: 1 })];
  }

  isIppatsu({ options }: internalParams): Yaku[] {
    if (!options.isIppatsu) {
      return [];
    }
    return [new Yaku({ str: "一発", val: 1 })];
  }

  isChankan({ options }: internalParams): Yaku[] {
    if (!options.isChankan) {
      return [];
    }
    return [new Yaku({ str: "槍槓", val: 1 })];
  }

  isRinshankaiho({ options }: internalParams): Yaku[] {
    if (!options.isRinshankaiho) {
      return [];
    }
    return [new Yaku({ str: "嶺上開花", val: 1 })];
  }

  isHaitei({ options }: internalParams): Yaku[] {
    if (!options.isHaitei) {
      return [];
    }
    return [new Yaku({ str: "海底摸月", val: 1 })];
  }

  isHoutei({ options }: internalParams): Yaku[] {
    if (!options.isHoutei) {
      return [];
    }
    return [new Yaku({ str: "河底撈魚", val: 1 })];
  }

  isPinfu(
    { paiSets, paiHead, paiLast, paiJikaze, paiBakaze }: internalParams,
  ): Yaku[] {
    if (paiHead.length == 0) {
      return [];
    }

    const a = paiSets.every((e) => e.type == PaiSetType.ANSHUN);
    const b = !paiHead[0].isSangenHai() &&
      (paiHead[0].fmt != paiJikaze.fmt) &&
      (paiHead[0].fmt != paiBakaze.fmt);
    const c = paiSets.some((e) =>
      e.machi({ pai: paiLast }) == MachiType.RYANMEN
    );
    const isPinfu = a && b && c;
    const isMenzen = paiSets.every((e) => e.isClose());
    if (isPinfu && isMenzen) {
      return [new Yaku({ str: "平和", val: 1 })];
    }
    return [];
  }

  isTanyao({ paiSets, paiHead, paiChitoi }: internalParams): Yaku[] {
    const all = [
      ...paiHead,
      ...paiSets.map((e) => e.pais).flat(),
      ...(paiChitoi ?? []),
    ];
    if (all.every((e) => e.isChunchanHai())) {
      return [new Yaku({ str: "断幺九", val: 1 })];
    }
    return [];
  }

  isIpeko({ paiSets, paiChitoi }: internalParams): Yaku[] {
    if (paiChitoi) {
      return [];
    }

    const shuntsus = paiSets.filter((e) => e.isShuntsu());
    const isMenzen = paiSets.every((e) => e.isClose());

    const done: number[] = [];
    let cnt = 0;
    for (let i = 0; i < shuntsus.length; i++) {
      for (let j = i + 1; j < shuntsus.length; j++) {
        if (shuntsus[i].pais[0].fmt == shuntsus[j].pais[0].fmt) {
          if (!done.includes(i) && !done.includes(j)) {
            done.push(i);
            done.push(j);
            cnt += 1;
          }
        }
        2;
      }
    }
    if (cnt == 1 && isMenzen) {
      return [new Yaku({ str: "一盃口", val: 1 })];
    }

    return [];
  }

  isJikaze({ paiSets, paiJikaze }: internalParams): Yaku[] {
    const kotsus = paiSets.filter((e) => e.isKotsu());
    if (kotsus.some((e) => e.pais[0].fmt == paiJikaze.fmt)) {
      return [new Yaku({ str: `自風 ${paiJikaze.dsp}`, val: 1 })];
    }
    return [];
  }

  isBakaze({ paiSets, paiBakaze }: internalParams): Yaku[] {
    const kotsus = paiSets.filter((e) => e.isKotsu());
    if (kotsus.some((e) => e.pais[0].fmt == paiBakaze.fmt)) {
      return [new Yaku({ str: `場風 ${paiBakaze.dsp}`, val: 1 })];
    }
    return [];
  }

  isHaku({ paiSets }: internalParams): Yaku[] {
    const kotsus = paiSets.filter((e) => e.isKotsu());
    if (kotsus.some((e) => e.pais[0].dsp == "白")) {
      return [new Yaku({ str: "役牌 白", val: 1 })];
    }
    return [];
  }

  isHatsu({ paiSets }: internalParams): Yaku[] {
    const kotsus = paiSets.filter((e) => e.isKotsu());
    if (kotsus.some((e) => e.pais[0].dsp == "發")) {
      return [new Yaku({ str: "役牌 發", val: 1 })];
    }
    return [];
  }

  isChun({ paiSets }: internalParams): Yaku[] {
    const kotsus = paiSets.filter((e) => e.isKotsu());
    if (kotsus.some((e) => e.pais[0].dsp == "中")) {
      return [new Yaku({ str: "役牌 中", val: 1 })];
    }
    return [];
  }

  isDabururichi({ options }: internalParams): Yaku[] {
    if (!options.isDabururichi) {
      return [];
    }
    return [new Yaku({ str: "両立直", val: 2 })];
  }

  isChanta({ paiHead, paiSets, paiChitoi }: internalParams): Yaku[] {
    if (paiChitoi) {
      return [];
    }
    const all = [
      ...paiHead,
      ...paiSets.map((e) => e.pais).flat(),
    ];

    const isMenzen = paiSets.every((e) => e.isClose());
    if (
      paiHead.every((e) => e.isYaochuHai()) &&
      paiSets.every((e) => e.pais.some((e) => e.isYaochuHai())) &&
      all.some((e) => e.isJihai()) &&
      all.some((e) => !e.isYaochuHai())
    ) {
      return [new Yaku({ str: "混全帯幺九", val: isMenzen ? 2 : 1 })];
    }
    return [];
  }

  isIkkitsukan({ paiSets, paiChitoi }: internalParams): Yaku[] {
    if (paiChitoi) {
      return [];
    }

    const shuntsu = paiSets.filter((e) => e.isShuntsu());
    const sm = shuntsu.filter((e) => e.pais[0].typ == PaiType.MANZU);
    const sp = shuntsu.filter((e) => e.pais[0].typ == PaiType.PINZU);
    const ss = shuntsu.filter((e) => e.pais[0].typ == PaiType.SOUZU);
    const isMenzen = paiSets.every((e) => e.isClose());

    for (const x of [sm, sp, ss]) {
      if (
        x.find((e) => e.pais[0].num == 1) &&
        x.find((e) => e.pais[0].num == 4) &&
        x.find((e) => e.pais[0].num == 7)
      ) {
        return [new Yaku({ str: "一気通貫", val: isMenzen ? 2 : 1 })];
      }
    }
    return [];
  }

  isSanshokudojun({ paiSets, paiChitoi }: internalParams): Yaku[] {
    if (paiChitoi) {
      return [];
    }

    const shuntsu = paiSets.filter((e) => e.isShuntsu());
    const sm = shuntsu.filter((e) => e.pais[0].typ == PaiType.MANZU);
    const sp = shuntsu.filter((e) => e.pais[0].typ == PaiType.PINZU);
    const ss = shuntsu.filter((e) => e.pais[0].typ == PaiType.SOUZU);
    const isMenzen = paiSets.every((e) => e.isClose());

    for (const m of sm) {
      for (const p of sp) {
        for (const s of ss) {
          if (
            m.pais[0].num == p.pais[0].num &&
            m.pais[0].num == s.pais[0].num
          ) {
            return [new Yaku({ str: "三色同順", val: isMenzen ? 2 : 1 })];
          }
        }
      }
    }

    return [];
  }

  isSanshokudokoku({ paiSets, paiChitoi }: internalParams): Yaku[] {
    if (paiChitoi) {
      return [];
    }

    const kotsus = paiSets.filter((e) => e.isKotsu());
    const km = kotsus.filter((e) => e.pais[0].typ == PaiType.MANZU);
    const kp = kotsus.filter((e) => e.pais[0].typ == PaiType.PINZU);
    const ks = kotsus.filter((e) => e.pais[0].typ == PaiType.SOUZU);

    for (const m of km) {
      for (const p of kp) {
        for (const s of ks) {
          if (
            m.pais[0].num == p.pais[0].num &&
            m.pais[0].num == s.pais[0].num
          ) {
            return [new Yaku({ str: "三色同刻", val: 2 })];
          }
        }
      }
    }

    return [];
  }

  isSankantsu({ paiSets, paiChitoi }: internalParams): Yaku[] {
    if (paiChitoi) {
      return [];
    }

    const kantsu = paiSets.filter((e) => e.isKantsu());
    if (kantsu.length == 3) {
      return [new Yaku({ str: "三槓子", val: 2 })];
    }
    return [];
  }

  isToitoiho({ paiSets, paiChitoi }: internalParams): Yaku[] {
    if (paiChitoi) {
      return [];
    }

    const kotsus = paiSets.filter((e) => e.isKotsu());
    if (kotsus.length == 4) {
      return [new Yaku({ str: "対々和", val: 2 })];
    }
    return [];
  }

  isSananko({ options, paiSets, paiLast, paiChitoi }: internalParams): Yaku[] {
    if (paiChitoi) {
      return [];
    }

    // 和了牌が暗刻のみに含まれており、暗順に逃がせない
    const noescape = paiSets.filter((e) =>
          e.type == PaiSetType.ANSHUN &&
          e.pais.map((e) => e.fmt).includes(paiLast.fmt)
        ).length == 0 &&
      paiSets.filter((e) =>
          e.type == PaiSetType.ANKO &&
          e.pais.map((e) => e.fmt).includes(paiLast.fmt)
        ).length != 0;

    if (!options.isTsumo && noescape) {
      const x = paiSets.find((e) =>
        e.type == PaiSetType.ANKO &&
        e.pais.map((e) => e.fmt).includes(paiLast.fmt)
      );
      if (x) {
        x.type = PaiSetType.MINKO;
      }
    }

    const ankotsu = paiSets.filter((e) =>
      [PaiSetType.ANKO, PaiSetType.ANKAN].includes(e.type)
    );
    if (ankotsu.length == 3) {
      return [new Yaku({ str: "三暗刻", val: 2 })];
    }
    return [];
  }

  isShosangen({ paiSets, paiHead, paiChitoi }: internalParams): Yaku[] {
    if (paiChitoi) {
      return [];
    }

    const all: Pai[][] = [...paiSets.map((e) => e.pais), paiHead];
    const map: Record<string, boolean> = {};
    for (const set of all) {
      map[set[0].dsp] = true;
    }
    if (["白", "發", "中"].every((y) => map[y])) {
      return [new Yaku({ str: "小三元", val: 2 })];
    }
    return [];
  }

  isHonroto({ paiSets, paiHead, paiChitoi }: internalParams): Yaku[] {
    const all = [
      ...paiSets.map((e) => e.pais).flat(),
      ...paiHead,
      ...(paiChitoi ?? []),
    ];

    if (all.every((e) => e.isJihai() || e.num == 1 || e.num == 9)) {
      return [new Yaku({ str: "混老頭", val: 2 })];
    }
    return [];
  }

  isRyampeko({ paiSets, paiChitoi }: internalParams): Yaku[] {
    if (paiChitoi) {
      return [];
    }

    const shuntsus = paiSets.filter((e) => e.isShuntsu());
    const isMenzen = paiSets.every((e) => e.isClose());

    const done: number[] = [];
    let cnt = 0;
    for (let i = 0; i < shuntsus.length; i++) {
      for (let j = i + 1; j < shuntsus.length; j++) {
        if (shuntsus[i].pais[0].fmt == shuntsus[j].pais[0].fmt) {
          if (!done.includes(i) && !done.includes(j)) {
            done.push(i);
            done.push(j);
            cnt += 1;
          }
        }
        2;
      }
    }
    if (cnt == 2 && isMenzen) {
      return [new Yaku({ str: "二盃口", val: 3 })];
    }
    return [];
  }

  isJunchan({ paiSets, paiHead, paiChitoi }: internalParams): Yaku[] {
    if (paiChitoi) {
      return [];
    }

    const isMenzen = paiSets.every((e) => e.isClose());
    if (
      paiHead.every((e) => e.num == 1 || e.num == 9) &&
      paiSets.every((e) => e.pais.some((e) => e.num == 1 || e.num == 9)) &&
      !paiSets.every((e) => e.pais.every((e) => e.num == 1 || e.num == 9))
    ) {
      return [new Yaku({ str: "純全帯幺九", val: isMenzen ? 3 : 2 })];
    }
    return [];
  }

  isHonitsu({ paiSets, paiHead, paiChitoi }: internalParams): Yaku[] {
    const all = [
      ...paiSets.map((e) => e.pais).flat(),
      ...paiHead,
      ...(paiChitoi ?? []),
    ];
    let isMenzen = paiSets.every((e) => e.isClose());
    if (paiChitoi) {
      isMenzen = true;
    }
    if (
      (all.every((e) => e.typ == PaiType.MANZU || e.isJihai()) ||
        all.every((e) => e.typ == PaiType.PINZU || e.isJihai()) ||
        all.every((e) => e.typ == PaiType.SOUZU || e.isJihai())) &&
      all.some((e) => e.isJihai())
    ) {
      return [new Yaku({ str: "混一色", val: isMenzen ? 3 : 2 })];
    }
    return [];
  }

  isChinitsu({ paiSets, paiHead, paiChitoi }: internalParams): Yaku[] {
    const all = [
      ...paiSets.map((e) => e.pais).flat(),
      ...paiHead,
      ...(paiChitoi ?? []),
    ];
    let isMenzen = paiSets.every((e) => e.isClose());
    if (paiChitoi) {
      isMenzen = true;
    }
    if (
      all.every((e) => e.typ == PaiType.MANZU) ||
      all.every((e) => e.typ == PaiType.PINZU) ||
      all.every((e) => e.typ == PaiType.SOUZU)
    ) {
      return [new Yaku({ str: "清一色", val: isMenzen ? 6 : 5 })];
    }
    return [];
  }

  isTenho({ options }: internalParams): Yaku[] {
    if (!options.isTenho) return [];
    return [new Yaku({ str: "天和", val: 1, yakuman: true })];
  }

  isChiho({ options }: internalParams): Yaku[] {
    if (!options.isChiho) return [];
    return [new Yaku({ str: "地和", val: 1, yakuman: true })];
  }

  isDaisangen({ paiSets }: internalParams): Yaku[] {
    const kotsus = paiSets.filter((e) => e.isKotsu());
    const map: Record<string, boolean> = {};
    for (const kotsu of kotsus) {
      map[kotsu.pais[0].dsp] = true;
    }
    if (["白", "發", "中"].every((e) => map[e])) {
      return [new Yaku({ str: "大三元", val: 1, yakuman: true })];
    }
    return [];
  }

  isSuanko({ paiSets, options, paiLast }: internalParams): Yaku[] {
    const ankos = paiSets.filter((e) =>
      e.type == PaiSetType.ANKAN || e.type == PaiSetType.ANKO
    );
    if (
      ankos.length == 4 && options.isTsumo &&
      ankos.some((e) => e.machi({ pai: paiLast }) == MachiType.SHANPON)
    ) {
      return [new Yaku({ str: "四暗刻", val: 1, yakuman: true })];
    }
    return [];
  }

  isSuankotanki({ paiSets, paiLast }: internalParams): Yaku[] {
    const ankos = paiSets.filter((e) =>
      e.type == PaiSetType.ANKAN || e.type == PaiSetType.ANKO
    );
    if (
      ankos.length == 4 &&
      ankos.every((e) => e.machi({ pai: paiLast }) == MachiType.INVALID)
    ) {
      return [new Yaku({ str: "四暗刻単騎", val: 1, yakuman: true })];
    }
    return [];
  }

  isTsuiso({ paiSets, paiHead }: internalParams): Yaku[] {
    if (paiHead.length == 0) return [];

    const all = [...paiSets.map((e) => e.pais).flat(), ...paiHead];
    if (all.every((e) => e.isJihai())) {
      return [new Yaku({ str: "字一色", val: 1, yakuman: true })];
    }
    return [];
  }

  isRyuiso({ paiSets, paiHead }: internalParams): Yaku[] {
    if (paiHead.length == 0) return [];

    const all = [...paiSets.map((e) => e.pais).flat(), ...paiHead];
    if (
      all.every((e) => ["發", "s2", "s3", "s4", "s6", "s8"].includes(e.dsp))
    ) {
      return [new Yaku({ str: "緑一色", val: 1, yakuman: true })];
    }
    return [];
  }

  isChinroto({ paiSets, paiHead }: internalParams): Yaku[] {
    if (paiHead.length == 0) return [];

    const all = [...paiSets.map((e) => e.pais).flat(), ...paiHead];
    if (all.every((e) => e.num == 1 || e.num == 9)) {
      return [new Yaku({ str: "清老頭", val: 1, yakuman: true })];
    }
    return [];
  }

  isChurempoto({ paiSets, paiHead, paiLast }: internalParams): Yaku[] {
    const all = [...paiSets.map((e) => e.pais).flat(), ...paiHead];
    const am = all.filter((e) => e.typ == PaiType.MANZU);
    const ap = all.filter((e) => e.typ == PaiType.PINZU);
    const as = all.filter((e) => e.typ == PaiType.SOUZU);
    const isMenzen = paiSets.every((e) => e.isClose());
    if (!isMenzen) return [];

    for (const x of [am, ap, as]) {
      const map: Record<number, number> = {};
      for (const e of x) {
        map[e.num] = (map[e.num] || 0) + 1;
      }
      if (
        [1, 2, 3, 4, 5, 6, 7, 8, 9].every((e) => (map[e] ?? 0) >= 1) &&
        [1, 9].every((e) => (map[e] ?? 0) == 3) &&
        [2, 3, 4, 5, 6, 7, 8].some((e) => (map[e] ?? 0) == 2)
      ) {
        // 純正九蓮宝燈と区別
        if (map[paiLast.num] != 2) {
          return [new Yaku({ str: "九蓮宝燈", val: 1, yakuman: true })];
        }
      }
    }
    return [];
  }

  isJunseichurempoto({ paiSets, paiHead, paiLast }: internalParams): Yaku[] {
    const all = [...paiSets.map((e) => e.pais).flat(), ...paiHead];
    const am = all.filter((e) => e.typ == PaiType.MANZU);
    const ap = all.filter((e) => e.typ == PaiType.PINZU);
    const as = all.filter((e) => e.typ == PaiType.SOUZU);
    const isMenzen = paiSets.every((e) => e.isClose());
    if (!isMenzen) return [];

    for (const x of [am, ap, as]) {
      const map: Record<number, number> = {};
      for (const e of x) {
        map[e.num] = (map[e.num] || 0) + 1;
      }
      if (
        [1, 2, 3, 4, 5, 6, 7, 8, 9].every((e) => (map[e] ?? 0) >= 1) &&
        [1, 9].every((e) => (map[e] ?? 0) == 3) &&
        [2, 3, 4, 5, 6, 7, 8].some((e) => (map[e] ?? 0) == 2)
      ) {
        if (map[paiLast.num] == 2) {
          return [new Yaku({ str: "純正九蓮宝燈", val: 1, yakuman: true })];
        }
      }
    }
    return [];
  }

  isDaisushi({ paiSets }: internalParams): Yaku[] {
    const kotsus = paiSets.filter((e) => e.isKotsu());
    const map: Record<string, boolean> = {};
    for (const kotsu of kotsus) {
      map[kotsu.pais[0].dsp] = true;
    }
    if (["東", "南", "西", "北"].every((e) => map[e])) {
      return [new Yaku({ str: "大四喜", val: 1, yakuman: true })];
    }
    return [];
  }

  isShosushi({ paiSets, paiHead }: internalParams): Yaku[] {
    if (paiHead.length == 0) return [];
    const kotsus: Pai[][] = [
      paiHead,
      ...paiSets.filter((e) => e.isKotsu()).map((e) => e.pais),
    ];
    const map: Record<string, boolean> = {};
    for (const kotsu of kotsus) {
      map[kotsu[0].dsp] = true;
    }
    const kazes = ["東", "南", "西", "北"];
    if (
      kazes.every((e) => map[e]) &&
      kazes.includes(paiHead[0].dsp)
    ) {
      return [new Yaku({ str: "小四喜", val: 1, yakuman: true })];
    }
    return [];
  }

  isSukantsu({ paiSets }: internalParams): Yaku[] {
    const kantsu = paiSets.filter((e) => e.isKantsu());
    if (kantsu.length == 4) {
      return [new Yaku({ str: "四槓子", val: 1, yakuman: true })];
    }
    return [];
  }

  isDra({ paiDora, paiSets, paiHead, paiChitoi }: internalParams): Yaku[] {
    const all = [
      ...paiSets.map((e) => e.pais).flat(),
      ...paiHead,
      ...(paiChitoi ?? []),
    ];

    let cnt = 0;
    for (const dora of paiDora) {
      cnt += all.filter((e) => e.fmt == dora.fmt).length;
    }
    if (cnt > 0) {
      return [new Yaku({ str: "ドラ", val: cnt })];
    }
    return [];
  }

  isDraUra(
    { paiSets, paiHead, paiChitoi, paiDoraUra }: internalParams,
  ): Yaku[] {
    const all = [
      ...paiSets.map((e) => e.pais).flat(),
      ...paiHead,
      ...(paiChitoi ?? []),
    ];

    let cnt = 0;
    for (const dora of paiDoraUra) {
      cnt += all.filter((e) => e.fmt == dora.fmt).length;
    }
    if (paiDoraUra.length > 0) {
      return [new Yaku({ str: "裏ドラ", val: cnt })];
    }
    return [];
  }

  isDoraAka({ paiSets, paiHead, paiChitoi }: internalParams): Yaku[] {
    const all = [
      ...paiSets.map((e) => e.pais).flat(),
      ...paiHead,
      ...(paiChitoi ?? []),
    ];
    const cnt = all.filter((e) => e.isAka()).length;
    if (cnt > 0) {
      return [new Yaku({ str: "赤ドラ", val: cnt })];
    }
    return [];
  }
}
