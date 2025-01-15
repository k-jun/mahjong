import { Shanten } from "./src/shanten/shanten.ts";
import { Tokuten } from "./src/tokuten/tokuten.ts";
import { Pai, PaiType } from "./src/pai/pai.ts";
import { PaiSet, PaiSetType } from "./src/paiset/paiset.ts";
export { Shanten } from "./src/shanten/shanten.ts";
export { Tokuten } from "./src/tokuten/tokuten.ts";
export { Pai, PaiType } from "./src/pai/pai.ts";
export { PaiSet, PaiSetType } from "./src/paiset/paiset.ts";

const tokuten = new Tokuten({
  options: {
    isOya: true,
    isTsumo: false,
  },
  paiBakaze: new Pai("z1"),
  paiJikaze: new Pai("z1"),
  paiDora: [new Pai("m1")],
  paiDoraUra: [new Pai("m1")],
  paiRest: [
    new Pai("m1"),
    new Pai("m1"),
    new Pai("m2"),
    new Pai("m2"),
    new Pai("m2"),
    new Pai("m3"),
    new Pai("m3"),
    new Pai("m3"),
    new Pai("m4"),
    new Pai("m4"),
    new Pai("m4"),
    new Pai("m5"),
    new Pai("m5"),
  ],
  paiLast: new Pai("m1"),
  paiSets: [],
});
console.log(tokuten.count());

const shanten = new Shanten({
  paiRest: [
    new Pai("m1"),
    new Pai("m1"),
    new Pai("m1"),
    new Pai("m2"),
    new Pai("m2"),
    new Pai("m2"),
    new Pai("m3"),
    new Pai("m3"),
    new Pai("m3"),
    new Pai("m4"),
    new Pai("m4"),
    new Pai("m4"),
    new Pai("m5"),
    new Pai("m5"),
  ],
  paiSets: [],
});
console.log(shanten.count());
