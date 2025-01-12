import { Pai } from "../pai/pai.ts";
import { PaiSet, PaiSetType } from "../paiset/paiset.ts";

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

export const NewWinForm = ({
  paiRest,
  paiLast,
  paiSets,
}: {
  paiRest: Pai[];
  paiSets: PaiSet[];
  paiLast: Pai;
}): WinForm[] => {
  const wins: WinForm[] = [];

  const paiMap: { [key: string]: number } = {};
  for (const p of paiRest) {
    if (p.fmt in paiMap) {
      paiMap[p.fmt] += 1;
    } else {
      paiMap[p.fmt] = 1;
    }
  }

  // 七対子
  if (Object.values(paiMap).every((e) => e == 2) && paiSets.length == 0) {
    wins.push(new Chitoitsu({ pais: paiRest, paiLast }));
  }

  // 国士無双
  const x = [
    "m1",
    "m9",
    "p1",
    "p9",
    "s1",
    "s9",
    "z1",
    "z2",
    "z3",
    "z4",
    "z5",
    "z6",
    "z7",
  ];
  if (
    x.every((e) => paiRest.map((e) => e.fmt).includes(e)) &&
    x.some((e) => paiMap[e] == 2) &&
    paiSets.length == 0
  ) {
    wins.push(new Kokushimuso({ pais: paiRest, paiLast }));
  }

  const heads = Object.entries(paiMap).filter(([_, v]) => v >= 2).map((
    [k, _],
  ) => k);
  for (const head of heads) {
    const paiCopy = [...paiRest];
    const paiHead: Pai[] = [];
    paiHead.push(paiCopy.splice(paiCopy.findIndex((e) => e.fmt == head), 1)[0]);
    paiHead.push(paiCopy.splice(paiCopy.findIndex((e) => e.fmt == head), 1)[0]);
    const ps = findSet({ pais: paiCopy });
    for (const p of ps) {
      const sets = [...paiSets, ...p];
      wins.push(new WinForm({ paiHead, paiSets: sets, paiLast }));
    }
  }

  return wins;
};

const findSet = ({ pais }: { pais: Pai[] }): PaiSet[][] => {
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
      const shuntsuNextNext = shuntsu[0] + (Number(shuntsu[1]) + 2).toString();
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
};

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
