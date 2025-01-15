import { Pai, PaiSet, Shanten, Tokuten } from "@k-jun/mahjong";

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
