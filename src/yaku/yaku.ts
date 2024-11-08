import { Pai, PaiType } from "../pai/pai.ts";
import { MachiType, PaiSet, PaiSetType } from "../paiset/paiset.ts";

type params = {
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
    yakuman?: boolean;
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
            }
            2;
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

export const isBakaze = ({ paiSets, paiBakaze }: params): yaku[] => {
    const kotsus = paiSets.filter((e) => e.isKotsu());
    if (kotsus.some((e) => e.pais[0].fmt == paiBakaze.fmt)) {
        return [{ str: `場風 ${paiBakaze.dsp}`, val: 1 }];
    }
    return [];
};

export const isJikaze = ({ paiSets, paiJikaze }: params): yaku[] => {
    const kotsus = paiSets.filter((e) => e.isKotsu());
    if (kotsus.some((e) => e.pais[0].fmt == paiJikaze.fmt)) {
        return [{ str: `自風 ${paiJikaze.dsp}`, val: 1 }];
    }
    return [];
};

export const isHaku = ({ paiSets }: params): yaku[] => {
    const kotsus = paiSets.filter((e) => e.isKotsu());
    if (kotsus.some((e) => e.pais[0].dsp == "白")) {
        return [{ str: "役牌 白", val: 1 }];
    }
    return [];
};

export const isHatsu = ({ paiSets }: params): yaku[] => {
    const kotsus = paiSets.filter((e) => e.isKotsu());
    if (kotsus.some((e) => e.pais[0].dsp == "發")) {
        return [{ str: "役牌 發", val: 1 }];
    }
    return [];
};

export const isChun = ({ paiSets }: params): yaku[] => {
    const kotsus = paiSets.filter((e) => e.isKotsu());
    if (kotsus.some((e) => e.pais[0].dsp == "中")) {
        return [{ str: "役牌 中", val: 1 }];
    }
    return [];
};

export const isDabururichi = ({ options }: params): yaku[] => {
    if (!options.isDabururichi) return [];
    return [{ str: "両立直", val: 2 }];
};

export const isChanta = (params: params): yaku[] => {
    const { paiHead, paiSets } = params;
    if (paiHead.length == 0) return [];

    if (isJunchan(params).length > 0) {
        return [];
    }
    if (
        paiHead.every((e) => e.isYaochuHai()) &&
        paiSets.every((e) => e.pais.some((e) => e.isYaochuHai()))
    ) {
        return [{ str: "混全帯幺九", val: 1 }];
    }
    return [];
};

export const isJunchan = ({ paiSets, paiHead }: params): yaku[] => {
    if (
        paiHead.every((e) => e.num == 1 || e.num == 9) &&
        paiSets.every((e) => e.pais.some((e) => e.num == 1 || e.num == 9))
    ) {
        return [{ str: "純全帯么九", val: 1 }];
    }
    return [];
};

export const isShosushi = ({ paiSets, paiHead }: params): yaku[] => {
    if (paiHead.length == 0) return [];
    const kotsus: Array<Array<Pai>> = [
        paiHead,
        ...paiSets.filter((e) => e.isKotsu()).map((e) => e.pais),
    ];
    const map: Record<string, boolean> = {};
    for (const kotsu of kotsus) {
        map[kotsu[0].dsp] = true;
    }
    if (["東", "南", "西", "北"].every((e) => map[e])) {
        return [{ str: "小四喜", val: 1, yakuman: true }];
    }
    return [];
};

export const isDaisushi = ({ paiSets }: params): yaku[] => {
    const kotsus = paiSets.filter((e) => e.isKotsu());
    const map: Record<string, boolean> = {};
    for (const kotsu of kotsus) {
        map[kotsu.pais[0].dsp] = true;
    }
    if (["東", "南", "西", "北"].every((e) => map[e])) {
        return [{ str: "大四喜", val: 2, yakuman: true }];
    }
    return [];
};

export const isSuanko = ({ paiSets, options, paiLast }: params): yaku[] => {
    const ankos = paiSets.filter((e) =>
        e.type == PaiSetType.ANKAN || e.type == PaiSetType.ANKO
    );
    if (
        ankos.length == 4 && options.isTsumo &&
        ankos.some((e) => e.machi({ pai: paiLast }) == MachiType.SHANPON)
    ) {
        return [{ str: "四暗刻", val: 1, yakuman: true }];
    }
    return [];
};

export const isSuankotanki = ({ paiSets, paiLast }: params): yaku[] => {
    const ankos = paiSets.filter((e) =>
        e.type == PaiSetType.ANKAN || e.type == PaiSetType.ANKO
    );
    if (
        ankos.length == 4 &&
        ankos.every((e) => e.machi({ pai: paiLast }) == MachiType.INVALID)
    ) {
        return [{ str: "四暗刻単騎", val: 2, yakuman: true }];
    }
    return [];
};

export const isDaisangen = ({ paiSets }: params): yaku[] => {
    const kotsus = paiSets.filter((e) => e.isKotsu());
    const map: Record<string, boolean> = {};
    for (const kotsu of kotsus) {
        map[kotsu.pais[0].dsp] = true;
    }
    if (["白", "發", "中"].every((e) => map[e])) {
        return [{ str: "大三元", val: 1, yakuman: true }];
    }
    return [];
};

export const isTsuiso = ({ paiSets, paiHead }: params): yaku[] => {
    if (paiHead.length == 0) return [];

    const all = [...paiSets.map((e) => e.pais).flat(), ...paiHead];
    if (all.every((e) => e.isJihai())) {
        return [{ str: "字一色", val: 1, yakuman: true }];
    }
    return [];
};

export const isRyuiso = ({ paiSets, paiHead }: params): yaku[] => {
    if (paiHead.length == 0) return [];

    const all = [...paiSets.map((e) => e.pais).flat(), ...paiHead];
    if (all.every((e) => ["發", "s2", "s3", "s4", "s6", "s8"].includes(e.dsp))) {
        return [{ str: "緑一色", val: 1, yakuman: true }];
    }
    return [];
};

export const isChiho = ({ options }: params): yaku[] => {
    if (!options.isChiho) return [];
    return [{ str: "地和", val: 1, yakuman: true }];
};

export const isTenho = ({ options }: params): yaku[] => {
    if (!options.isTenho) return [];
    return [{ str: "天和", val: 1, yakuman: true }];
};

export const isChinroto = ({ paiSets, paiHead }: params): yaku[] => {
    if (paiHead.length == 0) return [];

    const all = [...paiSets.map((e) => e.pais).flat(), ...paiHead];
    if (all.every((e) => e.num == 1 || e.num == 9)) {
        return [{ str: "清老頭", val: 1, yakuman: true }];
    }
    return [];
};

export const isChurempoto = ({ paiSets, paiHead, paiLast }: params): yaku[] => {
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
        if ([1, 2, 3, 4, 5, 6, 7, 8, 9].every((e) => (map[e] ?? 0) >= 1) &&
            [1, 9].every((e) => (map[e] ?? 0) == 3) &&
            [2, 3, 4, 5, 6, 7, 8].some((e) => (map[e] ?? 0) == 2)
        ) {
            // 純正九蓮宝燈と区別
            if (map[paiLast.num] != 2) {
                return [{ str: "九蓮宝燈", val: 1, yakuman: true }];
            }
        }
    }
    return [];
};

export const isJunseichurempoto = ({ paiSets, paiHead, paiLast }: params): yaku[] => {
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
        if ([1, 2, 3, 4, 5, 6, 7, 8, 9].every((e) => (map[e] ?? 0) >= 1) &&
            [1, 9].every((e) => (map[e] ?? 0) == 3) &&
            [2, 3, 4, 5, 6, 7, 8].some((e) => (map[e] ?? 0) == 2)
        ) {
            if (map[paiLast.num] == 2) {
                return [{ str: "純正九蓮宝燈", val: 2, yakuman: true }];
            }
        }
    }
    return [];
};

export const isSukantsu = ({ paiSets }: params): yaku[] => {
    const kantsu = paiSets.filter((e) => e.isKantsu());
    if (kantsu.length == 4) {
        return [{ str: "四槓子", val: 1, yakuman: true }];
    }
    return [];
};
