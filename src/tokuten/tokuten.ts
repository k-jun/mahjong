import { MachiType, PaiSetType } from "../paiset/paiset.ts";
import { Pai } from "../pai/pai.ts";
import { PaiSet } from "../paiset/paiset.ts";
import { WinFormFactory, WinFormOutputParams } from "../winform/winform.ts";

import { Yaku, YakuFactory } from "./yaku.ts";

export type params = {
  options: {
    isTsumo: boolean;
    isOya: boolean;
    isRichi?: boolean;
    isDabururichi?: boolean;
    isIppatsu?: boolean;
    isHaitei?: boolean;
    isHoutei?: boolean;
    isChankan?: boolean;
    isRinshankaiho?: boolean;
    isChiho?: boolean;
    isTenho?: boolean;
  };
  paiBakaze: Pai;
  paiJikaze: Pai;
  paiDora: Pai[];
  paiDoraUra: Pai[];
  paiRest: Pai[];
  paiSets: PaiSet[];
  paiLast: Pai;
};

export type paramsOutput = {
  han: number;
  fu: number;
  pointSum: number;
  pointPrt: number;
  pointCdn: number;
  yakus: Yaku[];
};

export type internalParams = params & WinFormOutputParams;

export class Tokuten {
  private params: params;

  constructor(params: params) {
    this.params = params;
  }

  count(): paramsOutput {
    const winFactory = new WinFormFactory();
    const yakuFactory = new YakuFactory();
    const wins = winFactory.create({ ...this.params });

    let maxHan = 0;
    let maxFu = 0;
    let isYakuman = false;
    let yakus: Yaku[] = [];
    for (const win of wins) {
      const mbyYaku = yakuFactory.create({ ...this.params, ...win });
      if (mbyYaku.every((yaku) => yaku.yakuman)) {
        maxHan = mbyYaku.reduce((a, b) => a + b.val, 0);
        maxFu = Math.max(maxFu, this.calcFu({ ...win }));
        isYakuman = true;
        yakus = mbyYaku;
        break;
      }
      const han = mbyYaku.reduce((a, b) => a + b.val, 0);
      if (han >= maxHan) {
        if (han > maxHan) {
          maxFu = 0;
        }
        maxHan = han;
        maxFu = Math.max(maxFu, this.calcFu({ ...win }));
        yakus = mbyYaku;
      }
    }
    const { pointSum, pointPrt, pointCdn } = this.calcPoint({
      han: maxHan,
      fu: maxFu,
      isYakuman,
    });

    return {
      han: maxHan,
      fu: maxFu,
      pointSum,
      pointPrt,
      pointCdn,
      yakus,
    };
  }

  calcFu(
    params: WinFormOutputParams,
  ): number {
    const {
      paiChitoi,
      paiKokushi,
      paiSets,
      paiHead,
      paiLast,
    } = params;

    const {
      options,
      paiBakaze,
      paiJikaze,
    } = this.params;
    if (paiChitoi) return 25;
    if (paiKokushi) return 0;

    const factory = new YakuFactory();
    const ispinfu = factory.isPinfu({ ...this.params, ...params }).length != 0;
    if (ispinfu && options.isTsumo) {
      return 20;
    }

    let base = 20;
    const isMenzen = paiSets.every((e) => e.isClose());
    const machis = paiSets.map((e) => e.machi({ pai: params.paiLast }));

    if (ispinfu) {
      // pass
    } else if (paiHead[0].fmt == paiLast.fmt) {
      base += 2;
    } else if (machis.includes(MachiType.KANCHAN)) {
      base += 2;
    } else if (machis.includes(MachiType.PENCHAN)) {
      base += 2;
    } else if (machis.includes(MachiType.RYANMEN)) {
      // pass
    } else if (machis.includes(MachiType.SHANPON)) {
      const idx = paiSets.findIndex(
        (e) => e.machi({ pai: params.paiLast }) == MachiType.SHANPON,
      );
      if (idx != -1 && !options.isTsumo) {
        paiSets[idx].type = PaiSetType.MINKO;
      }
    }

    for (const set of paiSets) {
      let x = 0;
      switch (set.type) {
        case PaiSetType.MINKO:
          x = 2;
          break;
        case PaiSetType.ANKO:
          x = 4;
          break;
        case PaiSetType.MINKAN:
        case PaiSetType.KAKAN:
          x = 8;
          break;
        case PaiSetType.ANKAN:
          x = 16;
          break;
      }
      if (set.pais[0].isYaochuHai()) {
        x *= 2;
      }
      base += x;
    }

    if (paiHead[0].isSangenHai()) {
      base += 2;
    }
    if (paiHead[0].fmt == paiBakaze.fmt) {
      base += 2;
    }
    if (paiHead[0].fmt == paiJikaze.fmt) {
      base += 2;
    }

    if (isMenzen && !options.isTsumo) {
      base += 10;
    }
    if (options.isTsumo) {
      base += 2;
    }

    const point = Math.floor(base / 10) * 10 + (base % 10 > 0 ? 10 : 0);

    // console.log(point);
    return Math.max(point, 30);
  }

  // [fromChild, fromOya]
  calcPoint(params: {
    han: number;
    fu: number;
    isYakuman: boolean;
  }): {
    pointSum: number;
    pointPrt: number;
    pointCdn: number;
  } {
    let pointPrt = 0;
    let pointCdn = 0;
    let pointSum = 0;
    if (params.han == 0 || params.fu == 0) {
      return { pointSum, pointPrt ,pointCdn };
    }

    if (this.params.options.isTsumo) {
      [pointCdn, pointPrt] = this.calcTsumoPoint(params);
      pointSum = this.params.options.isOya
        ? pointCdn * 3
        : pointPrt + pointCdn * 2;
    } else {
      pointCdn = this.calcRonPoint(params);
      pointSum = pointCdn;
    }

    return { pointSum, pointPrt ,pointCdn };
  }

  // [fromChild, fromOya]
  calcTsumoPoint(
    { han, fu, isYakuman }: {
      han: number;
      fu: number;
      isYakuman: boolean;
    },
  ): number[] {
    const { isOya } = this.params.options;
    if (isYakuman) {
      return isOya ? [16000 * han, 0] : [8000 * han, 16000 * han];
    }
    if (han >= 13) {
      return isOya ? [16000, 0] : [8000, 16000];
    }
    if (han >= 11) {
      return isOya ? [12000, 0] : [6000, 12000];
    }
    if (han >= 8) {
      return isOya ? [8000, 0] : [4000, 8000];
    }
    if (han >= 6) {
      return isOya ? [6000, 0] : [3000, 6000];
    }
    if (han >= 5) {
      return isOya ? [4000, 0] : [2000, 4000];
    }
    const scoresOya: { [key: string]: number[][] } = {
      "20": [[0, 0], [700, 0], [1300, 0], [2600, 0]],
      "25": [[0, 0], [0, 0], [1600, 0], [3200, 0]],
      "30": [[500, 0], [1000, 0], [2000, 0], [3900, 0]],
      "40": [[700, 0], [1300, 0], [2600, 0], [4000, 0]],
      "50": [[800, 0], [1600, 0], [3200, 0], [4000, 0]],
      "60": [[1000, 0], [2000, 0], [3900, 0], [4000, 0]],
      "70": [[1200, 0], [2300, 0], [4000, 0], [4000, 0]],
      "80": [[1300, 0], [2600, 0], [4000, 0], [4000, 0]],
      "90": [[1500, 0], [2900, 0], [4000, 0], [4000, 0]],
      "100": [[1600, 0], [3200, 0], [4000, 0], [4000, 0]],
      "110": [[1800, 0], [3600, 0], [4000, 0], [4000, 0]],
    };
    const scoresKo: { [key: string]: number[][] } = {
      "20": [[0, 0], [400, 700], [700, 1300], [1300, 2600]],
      "25": [[0, 0], [0, 0], [800, 1600], [1600, 3200]],
      "30": [[300, 500], [500, 1000], [1000, 2000], [2000, 3900]],
      "40": [[400, 700], [700, 1300], [1300, 2600], [2000, 4000]],
      "50": [[400, 800], [800, 1600], [1600, 3200], [2000, 4000]],
      "60": [[500, 1000], [1000, 2000], [2000, 3900], [2000, 4000]],
      "70": [[600, 1200], [1200, 2300], [2000, 4000], [2000, 4000]],
      "80": [[700, 1300], [1300, 2600], [2000, 4000], [2000, 4000]],
      "90": [[800, 1500], [1500, 2900], [2000, 4000], [2000, 4000]],
      "100": [[800, 1600], [1600, 3200], [2000, 4000], [2000, 4000]],
      "110": [[900, 1800], [1800, 3600], [2000, 4000], [2000, 4000]],
    };

    return isOya
      ? scoresOya[fu.toString()][han - 1]
      : scoresKo[fu.toString()][han - 1];
  }

  calcRonPoint(
    { han, fu, isYakuman }: {
      han: number;
      fu: number;
      isYakuman: boolean;
    },
  ): number {
    const { isOya } = this.params.options;

    if (isYakuman) {
      return isOya ? 48000 * han : 32000 * han;
    }
    if (han >= 13) {
      return isOya ? 48000 : 32000;
    }
    if (han >= 11) {
      return isOya ? 36000 : 24000;
    }
    if (han >= 8) {
      return isOya ? 24000 : 16000;
    }
    if (han >= 6) {
      return isOya ? 18000 : 12000;
    }
    if (han >= 5) {
      return isOya ? 12000 : 8000;
    }
    const scoresOya: { [key: string]: number[] } = {
      "25": [0, 2400, 4800, 9600],
      "30": [1500, 2900, 5800, 11600],
      "40": [2000, 3900, 7700, 12000],
      "50": [2400, 4800, 9600, 12000],
      "60": [2900, 5800, 11600, 12000],
      "70": [3400, 6800, 12000, 12000],
      "80": [3900, 7700, 12000, 12000],
      "90": [4400, 8700, 12000, 12000],
      "100": [4800, 9600, 12000, 12000],
      "110": [5300, 10600, 12000, 12000],
    };
    const scoresKo: { [key: string]: number[] } = {
      "25": [0, 1600, 3200, 6400],
      "30": [1000, 2000, 3900, 7700],
      "40": [1300, 2600, 5200, 8000],
      "50": [1600, 3200, 6400, 8000],
      "60": [2000, 3900, 7700, 8000],
      "70": [2300, 4500, 8000, 8000],
      "80": [2600, 5200, 8000, 8000],
      "90": [2900, 5800, 8000, 8000],
      "100": [3200, 6400, 8000, 8000],
      "110": [3600, 7100, 8000, 8000],
    };
    return isOya
      ? scoresOya[fu.toString()][han - 1]
      : scoresKo[fu.toString()][han - 1];
  }
}
