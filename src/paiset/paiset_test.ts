import { Pai } from "../pai/pai.ts";
import { MachiType, PaiSet, PaiSetType, Player } from "./paiset.ts";
import { expect } from "jsr:@std/expect";

Deno.test("PaiSet constructor", () => {
  const paiRest = [new Pai(4), new Pai(8)]; // m1, m2, m3
  const paiCall = [new Pai(0)];
  const paiset = new PaiSet({
    paiRest,
    paiCall,
    type: PaiSetType.MINSHUN,
    fromWho: Player.SHIMOCHA,
  });

  expect(paiset.paiRest).toEqual(paiRest);
  expect(paiset.paiCall).toEqual(paiCall);
  expect(paiset.type).toBe(PaiSetType.MINSHUN);
  expect(paiset.fromWho).toBe(Player.SHIMOCHA);
});

Deno.test("PaiSet machi types", () => {
  // Test RYANMEN machi
  const ryanmenPais = [new Pai(0), new Pai(4), new Pai(8)]; // m1, m2, m3
  const ryanmenSet = new PaiSet({
    paiRest: ryanmenPais,
    type: PaiSetType.ANSHUN,
    fromWho: Player.JICHA,
  });
  expect(ryanmenSet.machi({ pai: new Pai(0) })).toBe(MachiType.RYANMEN); // m4

  // Test KANCHAN machi
  const kanchanPais = [new Pai(0), new Pai(4), new Pai(8)]; // m1, m2, m3
  const kanchanSet = new PaiSet({
    paiRest: kanchanPais,
    type: PaiSetType.ANSHUN,
    fromWho: Player.JICHA,
  });
  expect(kanchanSet.machi({ pai: new Pai(4) })).toBe(MachiType.KANCHAN); // m2

  // Test PENCHAN machi
  const penchanPais = [new Pai(24), new Pai(28), new Pai(32)]; // m8, m9
  const penchanSet = new PaiSet({
    paiRest: penchanPais,
    type: PaiSetType.ANSHUN,
    fromWho: Player.JICHA,
  });
  expect(penchanSet.machi({ pai: new Pai(24) })).toBe(MachiType.PENCHAN); // m7

  // Test SHANPON machi
  const shanponPais = [new Pai(0), new Pai(4), new Pai(8)]; // m1, m1, m1
  const shanponSet = new PaiSet({
    paiRest: shanponPais,
    type: PaiSetType.ANKO,
    fromWho: Player.JICHA,
  });
  expect(shanponSet.machi({ pai: new Pai(0) })).toBe(MachiType.SHANPON); // m1
});

Deno.test("PaiSet isOpen/isClose", () => {
  const paiRest = [new Pai(4), new Pai(8)]; // m1, m2, m3
  const paiCall = [new Pai(0)];

  const openSet = new PaiSet({
    paiRest,
    paiCall,
    type: PaiSetType.MINSHUN,
    fromWho: Player.SHIMOCHA,
  });
  expect(openSet.isOpen()).toBe(true);
  expect(openSet.isClose()).toBe(false);

  const closedSet = new PaiSet({
    paiRest: [...paiRest, ...paiCall],
    type: PaiSetType.ANSHUN,
    fromWho: Player.JICHA,
  });
  expect(closedSet.isOpen()).toBe(false);
  expect(closedSet.isClose()).toBe(true);
});

Deno.test("PaiSet isKotsu/isShuntsu", () => {
  const kotsuSet = new PaiSet({
    paiRest: [],
    type: PaiSetType.MINKO,
    fromWho: Player.SHIMOCHA,
  });
  expect(kotsuSet.isKotsu()).toBe(true);
  expect(kotsuSet.isShuntsu()).toBe(false);

  const shuntsuSet = new PaiSet({
    paiRest: [],
    type: PaiSetType.MINSHUN,
    fromWho: Player.SHIMOCHA,
  });
  expect(shuntsuSet.isKotsu()).toBe(false);
  expect(shuntsuSet.isShuntsu()).toBe(true);
});

Deno.test("PaiSet isKantsu", () => {
  const kantsuSet = new PaiSet({
    paiRest: [new Pai(2), new Pai(3)],
    paiCall: [new Pai(0), new Pai(1)],
    type: PaiSetType.KAKAN,
    fromWho: Player.JICHA,
  });
  expect(kantsuSet.isKantsu()).toBe(true);

  const notKantsuSet = new PaiSet({
    paiRest: [new Pai(0), new Pai(1), new Pai(2)],
    type: PaiSetType.ANSHUN,
    fromWho: Player.JICHA,
  });
  expect(notKantsuSet.isKantsu()).toBe(false);
});
