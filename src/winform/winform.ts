import { yaochuPais } from "../constant/constant.ts";
import { Pai } from "../pai/pai.ts";
import { PaiSet, PaiSetType } from "../paiset/paiset.ts";

type WinFormParams = {
  paiRest: Pai[];
  paiSets: PaiSet[];
  paiLast: Pai;
};

export class WinFormFactory {
  create(params: WinFormParams): WinForm[] {
    const wins: WinForm[] = [];
    const paiMap = new Map<string, number>();

    for (const pai of params.paiRest) {
      paiMap.set(pai.fmt, (paiMap.get(pai.fmt) || 0) + 1);
    }

    wins.push(...this.createChitoi({ ...params, paiMap }));
    wins.push(...this.createKokushi({ ...params, paiMap }));
    wins.push(...this.createNormal({ ...params, paiMap }));
    return wins;
  }

  createChitoi(
    params: WinFormParams & { paiMap: Map<string, number> },
  ): WinForm[] {
    const wins = [];

    if (
      params.paiMap.values().every((e) => e == 2) && params.paiSets.length == 0
    ) {
      wins.push(
        new Chitoitsu({ pais: params.paiRest, paiLast: params.paiLast }),
      );
    }
    return wins;
  }

  createKokushi(
    params: WinFormParams & { paiMap: Map<string, number> },
  ): WinForm[] {
    const wins = [];
    if (
      yaochuPais.every((e) => params.paiRest.map((e) => e.fmt).includes(e)) &&
      yaochuPais.some((e) => params.paiMap.get(e) == 2) &&
      params.paiSets.length == 0
    ) {
      wins.push(
        new Kokushimuso({ pais: params.paiRest, paiLast: params.paiLast }),
      );
    }
    return wins;
  }

  createNormal(
    params: WinFormParams & { paiMap: Map<string, number> },
  ): WinForm[] {
    const { paiRest, paiSets, paiLast, paiMap } = params;
    const wins = [];

    const heads = [];
    for (const [k, v] of paiMap.entries()) {
      if (v >= 2) {
        heads.push(k);
      }
    }

    for (const head of heads) {
      const paiCopy = [...paiRest];
      const paiHead = [];
      paiHead.push(
        paiCopy.splice(paiCopy.findIndex((e) => e.fmt == head), 1)[0],
      );
      paiHead.push(
        paiCopy.splice(paiCopy.findIndex((e) => e.fmt == head), 1)[0],
      );
      const ps = this.findSet({ pais: paiCopy });
      for (const p of ps) {
        const sets = [...paiSets, ...p];
        wins.push(new WinForm({ paiHead, paiSets: sets, paiLast }));
      }
    }

    return wins;
  }

  findSet({ pais }: { pais: Pai[] }): PaiSet[][] {
    const result: PaiSet[][] = [];
    const loop = ({ pais, done }: { pais: Pai[]; done: PaiSet[] }) => {
      if (pais.length == 0) {
        done = done.sort((a, b) => {
          return a.type - b.type;
        });
        const chkDone = done.map((e) => e.pais.map((e) => e.fmt)).flat().join(
          ",",
        );

        const chkRslt = result.map((e) =>
          e
            .map((e) => e.pais.map((e) => e.fmt)).flat()
            .join(",")
        );
        if (!chkRslt.includes(chkDone)) {
          result.push(done);
        }
      }

      // 刻子
      const cnt = pais.reduce<{ [key: string]: number }>((mp, e) => {
        mp[e.fmt] = e.fmt in mp ? mp[e.fmt] + 1 : 1;
        return mp;
      }, {});
      let kotsu = "";
      for (const [k, v] of Object.entries(cnt)) {
        if (v >= 3) {
          kotsu = k;
          break;
        }
      }
      if (kotsu != "") {
        const paisCopy = [...pais];
        const doneCopy = [...done];
        const a = paisCopy.splice(
          paisCopy.findIndex((e) => e.fmt == kotsu),
          1,
        )[0];
        const b = paisCopy.splice(
          paisCopy.findIndex((e) => e.fmt == kotsu),
          1,
        )[0];
        const c = paisCopy.splice(
          paisCopy.findIndex((e) => e.fmt == kotsu),
          1,
        )[0];
        doneCopy.push(
          new PaiSet({
            pais: [a, b, c],
            type: PaiSetType.ANKO,
            nakiIdx: -1,
            fromWho: 0,
          }),
        );
        loop({ pais: paisCopy, done: doneCopy });
      }

      // 順子
      let shuntsu = "";
      const fmts = pais.map((e) => e.fmt);
      for (const p of pais) {
        if (p.isJihai() || p.num >= 8) {
          continue;
        }
        const pfmt = p.fmt;
        const pn = pfmt[0] + (Number(pfmt[1]) + 1).toString();
        const pnn = pfmt[0] + (Number(pfmt[1]) + 2).toString();
        if (fmts.includes(pn) && fmts.includes(pnn)) {
          shuntsu = p.fmt;
          break;
        }
      }
      if (shuntsu != "") {
        const paisCopy = [...pais];
        const doneCopy = [...done];
        const shuntsuNext = shuntsu[0] + (Number(shuntsu[1]) + 1).toString();
        const shuntsuNextNext = shuntsu[0] +
          (Number(shuntsu[1]) + 2).toString();
        const a = paisCopy.splice(
          paisCopy.findIndex((e) => e.fmt == shuntsu),
          1,
        )[0];
        const b = paisCopy.splice(
          paisCopy.findIndex((e) => e.fmt == shuntsuNext),
          1,
        )[0];
        const c = paisCopy.splice(
          paisCopy.findIndex((e) => e.fmt == shuntsuNextNext),
          1,
        )[0];
        doneCopy.push(
          new PaiSet({
            pais: [a, b, c],
            type: PaiSetType.ANSHUN,
            nakiIdx: -1,
            fromWho: 0,
          }),
        );
        loop({ pais: paisCopy, done: doneCopy });
      }
    };

    loop({ pais, done: [] });
    return result;
  }
}

class WinForm {
  paiHead: Pai[];
  paiSets: PaiSet[];
  paiLast: Pai;
  constructor({ paiHead, paiSets, paiLast }: {
    paiHead: Pai[];
    paiSets: PaiSet[];
    paiLast: Pai;
  }) {
    this.paiHead = paiHead;
    this.paiSets = paiSets;
    this.paiLast = paiLast;
  }
}

export class Chitoitsu extends WinForm {
  paiChitoitsu: Pai[];
  constructor({ pais, paiLast }: { pais: Pai[]; paiLast: Pai }) {
    super({ paiHead: [], paiSets: [], paiLast });
    this.paiChitoitsu = pais;
  }
}

export class Kokushimuso extends WinForm {
  paiKokushimuso: Pai[];
  constructor({ pais, paiLast }: { pais: Pai[]; paiLast: Pai }) {
    super({ paiHead: [], paiSets: [], paiLast });
    this.paiKokushimuso = pais;
  }
}
