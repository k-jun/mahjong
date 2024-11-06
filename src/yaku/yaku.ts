import { Pai } from "../pai/pai.ts";
import { PaiSet } from "../paiset/paiset.ts";

type params = {
    options: {
        isTsumo: boolean;
        isRichi: boolean;
        isIppatsu: boolean;
        isHaitei: boolean;
        isHoutei: boolean;
    };
    paiBakaze: Pai;
    paiJikaze: Pai;
    paiDora: Array<Pai>;
    paiDoraUra: Array<Pai>;
    paiHead: Array<Pai>;
    paiSets: Array<PaiSet>;
    paiLast: Pai;
};

type yaku = {
    str: string;
    val: number;
};

export const isRichi = ({ options }: params): yaku[] => {
    if (!options.isRichi) return [];
    return [{ str: "立直", val: 1 }];
};
