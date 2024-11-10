import { Pai, PaiType } from "../pai/pai.ts";
import { MachiType, PaiSet, PaiSetType } from "../paiset/paiset.ts";
import { deepCopy } from "../utils/utils.ts";

export type params = {
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
        isOya: boolean;
    };
    paiBakaze: Pai;
    paiJikaze: Pai;
    paiDora: Array<Pai>;
    paiDoraUra: Array<Pai>;
    paiHead: Array<Pai>;
    paiSets: Array<PaiSet>;
    paiLast: Pai;
    paiChitoitsu?: Array<Pai>;
    paiKokushimuso?: Array<Pai>;
};

export type yaku = {
    str: string;
    val: number;
    yakuman?: boolean;
};

export const isTsumo = ({ options, paiSets }: params): yaku[] => {
    const isTsumo = options.isTsumo;
    const isMenzen = paiSets.every((e) => e.isClose());
    if (isTsumo && isMenzen) {
        return [{ str: "門前清自摸和", val: 1 }];
    }
    return [];
};

export const isRichi = ({ options }: params): yaku[] => {
    if (!options.isRichi) return [];
    return [{ str: "立直", val: 1 }];
};

export const isIppatsu = ({ options }: params): yaku[] => {
    if (!options.isIppatsu) return [];
    return [{ str: "一発", val: 1 }];
};

export const isChankan = ({ options }: params): yaku[] => {
    if (!options.isChankan) return [];
    return [{ str: "槍槓", val: 1 }];
};

export const isRinshankaiho = ({ options }: params): yaku[] => {
    if (!options.isRinshankaiho) return [];
    return [{ str: "嶺上開花", val: 1 }];
};

export const isHaitei = ({ options }: params): yaku[] => {
    if (!options.isHaitei) return [];
    return [{ str: "海底摸月", val: 1 }];
};

export const isHoutei = ({ options }: params): yaku[] => {
    if (!options.isHoutei) return [];
    return [{ str: "河底撈魚", val: 1 }];
};

export const isPinfu = (
    { paiSets, paiHead, paiLast, paiJikaze, paiBakaze }: params,
): yaku[] => {
    if (paiHead.length == 0) return [];

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

export const isTanyao = (
    { paiSets, paiHead, paiChitoitsu }: params,
): yaku[] => {
    const all = [
        ...paiHead,
        ...paiSets.map((e) => e.pais).flat(),
        ...(paiChitoitsu ?? []),
    ];
    if (all.every((e) => e.isChunchanHai())) {
        return [{ str: "断幺九", val: 1 }];
    }
    return [];
};

export const isIpeko = ({ paiSets, paiChitoitsu }: params): yaku[] => {
    if (paiChitoitsu) return [];

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

export const isJikaze = ({ paiSets, paiJikaze }: params): yaku[] => {
    const kotsus = paiSets.filter((e) => e.isKotsu());
    if (kotsus.some((e) => e.pais[0].fmt == paiJikaze.fmt)) {
        return [{ str: `自風 ${paiJikaze.dsp}`, val: 1 }];
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

export const isChanta = (
    { paiHead, paiSets, paiChitoitsu }: params,
): yaku[] => {
    if (paiChitoitsu) return [];
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
        return [{ str: "混全帯幺九", val: isMenzen ? 2 : 1 }];
    }
    return [];
};

export const isIkkitsukan = ({ paiSets, paiChitoitsu }: params): yaku[] => {
    if (paiChitoitsu) return [];

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
            return [{ str: "一気通貫", val: isMenzen ? 2 : 1 }];
        }
    }
    return [];
};

export const isSanshokudojun = ({ paiSets, paiChitoitsu }: params): yaku[] => {
    if (paiChitoitsu) return [];

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
                    return [{ str: "三色同順", val: isMenzen ? 2 : 1 }];
                }
            }
        }
    }

    return [];
};

export const isSanshokudokoku = ({ paiSets, paiChitoitsu }: params): yaku[] => {
    if (paiChitoitsu) return [];

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
                    return [{ str: "三色同刻", val: 2 }];
                }
            }
        }
    }

    return [];
};

export const isSankantsu = ({ paiSets, paiChitoitsu }: params): yaku[] => {
    if (paiChitoitsu) return [];

    const kantsu = paiSets.filter((e) => e.isKantsu());
    if (kantsu.length == 3) {
        return [{ str: "三槓子", val: 2 }];
    }
    return [];
};

export const isToitoiho = ({ paiSets, paiChitoitsu }: params): yaku[] => {
    if (paiChitoitsu) return [];

    const kotsus = paiSets.filter((e) => e.isKotsu());
    if (kotsus.length == 4) {
        return [{ str: "対々和", val: 2 }];
    }
    return [];
};

export const isSananko = (
    { options, paiSets, paiLast, paiChitoitsu }: params,
): yaku[] => {
    if (paiChitoitsu) return [];

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
        return [{ str: "三暗刻", val: 2 }];
    }
    return [];
};

export const isShosangen = (
    { paiSets, paiHead, paiChitoitsu }: params,
): yaku[] => {
    if (paiChitoitsu) return [];

    const all: Array<Array<Pai>> = [...paiSets.map((e) => e.pais), paiHead];
    const map: Record<string, boolean> = {};
    for (const set of all) {
        map[set[0].dsp] = true;
    }
    if (["白", "發", "中"].every((y) => map[y])) {
        return [{ str: "小三元", val: 2 }];
    }
    return [];
};

export const isHonroto = (
    { paiSets, paiHead, paiChitoitsu }: params,
): yaku[] => {
    const all = [
        ...paiSets.map((e) => e.pais).flat(),
        ...paiHead,
        ...(paiChitoitsu ?? []),
    ];

    if (all.every((e) => e.isJihai() || e.num == 1 || e.num == 9)) {
        return [{ str: "混老頭", val: 2 }];
    }
    return [];
};

export const isRyampeko = ({ paiSets, paiChitoitsu }: params): yaku[] => {
    if (paiChitoitsu) return [];

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

export const isJunchan = (
    { paiSets, paiHead, paiChitoitsu }: params,
): yaku[] => {
    if (paiChitoitsu) return [];

    const isMenzen = paiSets.every((e) => e.isClose());
    if (
        paiHead.every((e) => e.num == 1 || e.num == 9) &&
        paiSets.every((e) => e.pais.some((e) => e.num == 1 || e.num == 9)) &&
        !paiSets.every((e) => e.pais.every((e) => e.num == 1 || e.num == 9))
    ) {
        return [{ str: "純全帯幺九", val: isMenzen ? 3 : 2 }];
    }
    return [];
};

export const isHonitsu = (
    { paiSets, paiHead, paiChitoitsu }: params,
): yaku[] => {
    const all = [
        ...paiSets.map((e) => e.pais).flat(),
        ...paiHead,
        ...(paiChitoitsu ?? []),
    ];
    let isMenzen = paiSets.every((e) => e.isClose());
    if (paiChitoitsu) {
        isMenzen = true;
    }
    if (
        (all.every((e) => e.typ == PaiType.MANZU || e.isJihai()) ||
            all.every((e) => e.typ == PaiType.PINZU || e.isJihai()) ||
            all.every((e) => e.typ == PaiType.SOUZU || e.isJihai())) &&
        all.some((e) => e.isJihai())
    ) {
        return [{ str: "混一色", val: isMenzen ? 3 : 2 }];
    }
    return [];
};

export const isChinitsu = (
    { paiSets, paiHead, paiChitoitsu }: params,
): yaku[] => {
    const all = [
        ...paiSets.map((e) => e.pais).flat(),
        ...paiHead,
        ...(paiChitoitsu ?? []),
    ];
    let isMenzen = paiSets.every((e) => e.isClose());
    if (paiChitoitsu) {
        isMenzen = true;
    }
    if (
        all.every((e) => e.typ == PaiType.MANZU) ||
        all.every((e) => e.typ == PaiType.PINZU) ||
        all.every((e) => e.typ == PaiType.SOUZU)
    ) {
        return [{ str: "清一色", val: isMenzen ? 6 : 5 }];
    }
    return [];
};

export const isTenho = ({ options }: params): yaku[] => {
    if (!options.isTenho) return [];
    return [{ str: "天和", val: 1, yakuman: true }];
};

export const isChiho = ({ options }: params): yaku[] => {
    if (!options.isChiho) return [];
    return [{ str: "地和", val: 1, yakuman: true }];
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
        return [{ str: "四暗刻単騎", val: 1, yakuman: true }];
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
    if (
        all.every((e) => ["發", "s2", "s3", "s4", "s6", "s8"].includes(e.dsp))
    ) {
        return [{ str: "緑一色", val: 1, yakuman: true }];
    }
    return [];
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
        if (
            [1, 2, 3, 4, 5, 6, 7, 8, 9].every((e) => (map[e] ?? 0) >= 1) &&
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

export const isJunseichurempoto = (
    { paiSets, paiHead, paiLast }: params,
): yaku[] => {
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
                return [{ str: "純正九蓮宝燈", val: 1, yakuman: true }];
            }
        }
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
        return [{ str: "大四喜", val: 1, yakuman: true }];
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
    const kazes = ["東", "南", "西", "北"]
    if (
        kazes.every((e) => map[e]) &&
        kazes.includes(paiHead[0].dsp)
    ) {
        return [{ str: "小四喜", val: 1, yakuman: true }];
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

export const isDra = (
    { paiDora, paiSets, paiHead, paiChitoitsu }: params,
): yaku[] => {
    const all = [
        ...paiSets.map((e) => e.pais).flat(),
        ...paiHead,
        ...(paiChitoitsu ?? []),
    ];

    let cnt = 0;
    for (const dora of paiDora) {
        cnt += all.filter((e) => e.fmt == dora.fmt).length;
    }
    if (cnt > 0) {
        return [{ str: "ドラ", val: cnt }];
    }
    return [];
};

export const isDraUra = ({
    paiSets,
    paiHead,
    paiChitoitsu,
    paiDoraUra,
}: params): yaku[] => {
    const all = [
        ...paiSets.map((e) => e.pais).flat(),
        ...paiHead,
        ...(paiChitoitsu ?? []),
    ];

    let cnt = 0;
    for (const dora of paiDoraUra) {
        cnt += all.filter((e) => e.fmt == dora.fmt).length;
    }
    if (paiDoraUra.length > 0) {
        return [{ str: "裏ドラ", val: cnt }];
    }
    return [];
};

export const isDoraAka = (
    { paiSets, paiHead, paiChitoitsu }: params,
): yaku[] => {
    const all = [
        ...paiSets.map((e) => e.pais).flat(),
        ...paiHead,
        ...(paiChitoitsu ?? []),
    ];
    const cnt = all.filter((e) => e.isAka()).length;
    if (cnt > 0) {
        return [{ str: "赤ドラ", val: cnt }];
    }
    return [];
};

export const findYakus = (params: params): yaku[] => {
    const { paiChitoitsu, paiKokushimuso, paiLast } = params;

    if (paiKokushimuso) {
        const map: Record<string, number> = {};
        for (const p of paiKokushimuso) {
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
        ...isChiho(params),
        ...isTenho(params),
        ...isDaisangen(params),
        ...isSuanko(params),
        ...isSuankotanki(params),
        ...isTsuiso(params),
        ...isRyuiso(params),
        ...isChinroto(params),
        ...isChurempoto(params),
        ...isJunseichurempoto(params),
        ...isDaisushi(params),
        ...isShosushi(params),
        ...isSukantsu(params),
    ];
    if (yakuYakuman.length > 0) {
        return yakuYakuman;
    }
    return [
        ...isTsumo(params),
        ...isRichi(params),
        ...isIppatsu(params),
        ...isChankan(params),
        ...isRinshankaiho(params),
        ...isHaitei(params),
        ...isHoutei(params),
        ...isPinfu(params),
        ...isTanyao(params),
        ...isIpeko(params),
        ...isJikaze(params),
        ...isBakaze(params),
        ...isHaku(params),
        ...isHatsu(params),
        ...isChun(params),
        ...isDabururichi(params),
        ...(paiChitoitsu ? [{ str: "七対子", val: 2 }] : []),
        ...isChanta(params),
        ...isIkkitsukan(params),
        ...isSanshokudojun(params),
        ...isSanshokudokoku(params),
        ...isSankantsu(params),
        ...isToitoiho(params),
        ...isSananko(deepCopy(params)),
        ...isShosangen(params),
        ...isHonroto(params),
        ...isRyampeko(params),
        ...isJunchan(params),
        ...isHonitsu(params),
        ...isChinitsu(params),
        ...isDra(params),
        ...isDraUra(params),
        ...isDoraAka(params),
    ];
};
