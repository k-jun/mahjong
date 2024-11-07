import { Pai } from "../pai/pai.ts";
import { MachiType, PaiSet, PaiSetType } from "../paiset/paiset.ts";

type params = {
    options: {
        isTsumo: boolean;
        isRichi: boolean;
        isIppatsu: boolean;
        isHaitei: boolean;
        isHoutei: boolean;
        isChankan: boolean;
        isRinshankaiho: boolean;
    };
    paiBakaze: Pai;
    paiJikaze: Pai;
    paiDora: Array<Pai>;
    paiDoraUra: Array<Pai>;
    paiHead: Array<Pai>;
    paiSets: Array<PaiSet>;
    paiLast: Pai;
    pais?: Array<Pai>;
};

type yaku = {
    str: string;
    val: number;
};

export const isRichi = ({ options }: params): yaku[] => {
    if (!options.isRichi) return [];
    return [{ str: "立直", val: 1 }];
};

export const isIppatsu = ({ options }: params): yaku[] => {
    if (!options.isIppatsu) return [];
    return [{ str: "一発", val: 1 }];
};

export const isHaitei = ({ options }: params): yaku[] => {
    if (!options.isHaitei) return [];
    return [{ str: "海底摸月", val: 1 }];
};

export const isHoutei = ({ options }: params): yaku[] => {
    if (!options.isHoutei) return [];
    return [{ str: "河底撈魚", val: 1 }];
};

export const isTsumo = ({ options, paiSets }: params): yaku[] => {
    const isTsumo = options.isTsumo;
    const isMenzen = paiSets.every((e) => e.isClose());
    if (isTsumo && isMenzen) {
        return [{ str: "門前清自摸和", val: 1 }];
    }
    return [];
};

export const isPinfu = (
    { paiSets, paiHead, paiLast, paiJikaze, paiBakaze }: params,
): yaku[] => {
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
        return [{ str: "平和", val: 1 }];
    }
    return [];
};

export const isTanyao = ({ paiSets, paiHead, pais }: params): yaku[] => {
    if (pais) {
        if (pais.every((e) => e.isChunchanHai())) {
            return [{ str: "断幺九", val: 1 }];
        }
        return [];
    }
    const all = [...paiHead, ...paiSets.map((e) => e.pais)].flat();
    if (all.every((e) => e.isChunchanHai())) {
        return [{ str: "断幺九", val: 1 }];
    }
    return [];
};

export const isChankan = ({ options }: params): yaku[] => {
    if (!options.isChankan) return [];
    return [{ str: "槍槓", val: 1 }];
};

export const isRinshankaiho = ({ options }: params): yaku[] => {
    if (!options.isRinshankaiho) return [];
    return [{ str: "嶺上開花", val: 1 }];
};

export const isIpeko = ({ paiSets }: params): yaku[] => {
    const shuntsus = paiSets.filter((e) => e.isShuntsu());
    const isMenzen = paiSets.every((e) => e.isClose());

    const done: Array<number> = [];
    let cnt = 0;
    for (let i = 0; i < shuntsus.length; i++) {
        for (let j = i + 1; j < shuntsus.length; j++) {
            if (shuntsus[i].pais[0].fmt == shuntsus[j].pais[0].fmt) {
                if (!done.includes(i) && !done.includes(j)) {
                    done.push(i);
                    done.push(j);
                    cnt += 1;
                }
            }2
        }
    }
    if (cnt == 1 && isMenzen) {
        return [{ str: "一盃口", val: 1 }];
    }

    return [];
};

export const isRyampeko = ({ paiSets }: params): yaku[] => {
    const shuntsus = paiSets.filter((e) => e.isShuntsu());
    const isMenzen = paiSets.every((e) => e.isClose());

    const done: Array<number> = [];
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
        return [{ str: "二盃口", val: 3 }];
    }
    return [];
};

export const isSananko = ({ options, paiSets, paiLast }: params): yaku[] => {
    // 和了牌が暗刻のみに含まれており、暗順に逃がせない
    const noescape = paiSets.filter((e) =>
                e.type == PaiSetType.ANSHUN &&
                e.pais.map((e) => e.fmt).includes(paiLast.fmt)
            ).length == 0 &&
        paiSets.filter((e) =>
                e.type == PaiSetType.ANKO &&
                e.pais.map((e) => e.fmt).includes(paiLast.fmt)
            ).length > 0;

    if (!options.isTsumo && noescape) {
        const x = paiSets.find((e) =>
            e.type == PaiSetType.ANKO &&
            e.pais.map((e) => e.fmt).includes(paiLast.fmt)
        );
        if (x) {
            x.type = PaiSetType.MINKO;
        } else {
            throw new Error("Not Found ANKO");
        }
    }

    const ankotsu = paiSets.filter((e) =>
        [PaiSetType.ANKO, PaiSetType.ANKAN].includes(e.type)
    );
    if (ankotsu.length == 3) {
        return [{ str: "三暗刻", val: 2 }];
    }

    return [];
};
