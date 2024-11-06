import { Pai } from "../pai/pai.ts";
import { PaiSet, PaiSetType, MachiType, Player } from "./paiset.ts";
import { expect } from "jsr:@std/expect";

Deno.test("PaiSet constructor", () => {
  const pais = [new Pai(0), new Pai(4), new Pai(8)]; // m1, m2, m3
  const paiset = new PaiSet({
    pais,
    type: PaiSetType.MINSHUN,
    nakiIdx: 1,
    fromWho: Player.SHIMOCHA
  });

  expect(paiset.pais).toEqual(pais);
  expect(paiset.type).toBe(PaiSetType.MINSHUN);
  expect(paiset.nakiIdx).toBe(1);
  expect(paiset.fromWho).toBe(Player.SHIMOCHA);
});

Deno.test("PaiSet machi types", () => {
  // Test RYANMEN machi
  const ryanmenPais = [new Pai(0), new Pai(4), new Pai(8)]; // m1, m2, m3
  const ryanmenSet = new PaiSet({
    pais: ryanmenPais,
    type: PaiSetType.ANSHUN,
    nakiIdx: -1,
    fromWho: Player.JICHA
  });
  expect(ryanmenSet.machi({ pai: new Pai(0) })).toBe(MachiType.RYANMEN); // m4

  // Test KANCHAN machi
  const kanchanPais = [new Pai(0), new Pai(4),new Pai(8)]; // m1, m2, m3
  const kanchanSet = new PaiSet({
    pais: kanchanPais,
    type: PaiSetType.ANSHUN,
    nakiIdx: -1,
    fromWho: Player.JICHA
  });
  expect(kanchanSet.machi({ pai: new Pai(4) })).toBe(MachiType.KANCHAN); // m2

  // Test PENCHAN machi
  const penchanPais = [new Pai(24), new Pai(28), new Pai(32)]; // m8, m9
  const penchanSet = new PaiSet({
    pais: penchanPais,
    type: PaiSetType.ANSHUN,
    nakiIdx: -1,
    fromWho: Player.JICHA
  });
  expect(penchanSet.machi({ pai: new Pai(24) })).toBe(MachiType.PENCHAN); // m7

  // Test SHANPON machi
  const shanponPais = [new Pai(0), new Pai(4), new Pai(8)]; // m1, m1, m1
  const shanponSet = new PaiSet({
    pais: shanponPais,
    type: PaiSetType.ANKO,
    nakiIdx: -1,
    fromWho: Player.JICHA
  });
  expect(shanponSet.machi({ pai: new Pai(0) })).toBe(MachiType.SHANPON); // m1
});

Deno.test("PaiSet isOpen/isClose", () => {
  const pais = [new Pai(0), new Pai(4), new Pai(8)];
  
  const openSet = new PaiSet({
    pais,
    type: PaiSetType.MINSHUN,
    nakiIdx: 1,
    fromWho: Player.SHIMOCHA
  });
  expect(openSet.isOpen()).toBe(true);
  expect(openSet.isClose()).toBe(false);

  const closedSet = new PaiSet({
    pais,
    type: PaiSetType.ANSHUN,
    nakiIdx: -1,
    fromWho: Player.JICHA
  });
  expect(closedSet.isOpen()).toBe(false);
  expect(closedSet.isClose()).toBe(true);
});

Deno.test("PaiSet isKotsu/isShuntsu", () => {
  const pais = [new Pai(0), new Pai(4), new Pai(8)];
  
  const kotsuSet = new PaiSet({
    pais,
    type: PaiSetType.MINKO,
    nakiIdx: 1,
    fromWho: Player.SHIMOCHA
  });
  expect(kotsuSet.isKotsu()).toBe(true);
  expect(kotsuSet.isShuntsu()).toBe(false);

  const shuntsuSet = new PaiSet({
    pais,
    type: PaiSetType.MINSHUN,
    nakiIdx: 1,
    fromWho: Player.SHIMOCHA
  });
  expect(shuntsuSet.isKotsu()).toBe(false);
  expect(shuntsuSet.isShuntsu()).toBe(true);
});
