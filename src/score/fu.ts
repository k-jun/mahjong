// import { isPinfu, params } from "./yaku.ts";

// export const fu = (params: params): number => {
//     const { paiChitoitsu, paiSets, options, paiLast } = params;
//     if (paiChitoitsu) {
//         return 25;
//     }
//     const isPinfu = isPinfu(params);
//     if (isPinfu && options.isTsumo) {
//         return 20;
//     }

//     const isMenzen = paiSets.every((e) => e.isClose());

//     // 和了牌が暗刻のみに含まれており、暗順に逃がせない
//     const noescape = paiSets.filter((e) =>
//                 e.type == PaiSetType.ANSHUN &&
//                 e.pais.map((e) => e.fmt).includes(paiLast.fmt)
//             ).length == 0 &&
//         paiSets.filter((e) =>
//                 e.type == PaiSetType.ANKO &&
//                 e.pais.map((e) => e.fmt).includes(paiLast.fmt)
//             ).length > 0;

//     if (!options.isTsumo && noescape) {
//         const x = paiSets.find((e) =>
//             e.type == PaiSetType.ANKO &&
//             e.pais.map((e) => e.fmt).includes(paiLast.fmt)
//         );
//         if (x) {
//             x.type = PaiSetType.MINKO;
//         }
//     }



//     return 0;
// };
