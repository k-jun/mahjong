import { pais } from "../constant/constant.ts";
import { Pai, PaiType } from "./pai.ts";
import { expect } from "jsr:@std/expect";

Deno.test("Pai Class", () => {
  const pai = new Pai(0);
  expect(pai.id).toBe(0);
  expect(pai.val).toBe(pais[0]);
});

Deno.test("Pai typ", () => {
  const pai = new Pai(0);
  expect(pai.typ).toBe(PaiType.MANZU);
});

Deno.test("Pai num", () => {
  const pai = new Pai(0);
  expect(pai.num).toBe(1);
});

Deno.test("Pai fmt", () => {
  const pai = new Pai(0);
  expect(pai.fmt).toBe("m1");
});

Deno.test("Pai dsp", () => {
  const manzu = new Pai(0);
  expect(manzu.dsp).toBe("m1");

  const jihai = new Pai(108); // z1 (東)
  expect(jihai.dsp).toBe("東");
});

Deno.test("Pai next", () => {
  const pai1 = new Pai(0); // m1
  expect(pai1.next().fmt).toBe("m2");

  const pai9 = new Pai(32); // m9
  expect(pai9.next().fmt).toBe("m1");

  const z4 = new Pai(120); // z4 (北)
  expect(z4.next().fmt).toBe("z1");

  const z7 = new Pai(132); // z7 (中)
  expect(z7.next().fmt).toBe("z5");
});

Deno.test("Pai isJihai", () => {
  const manzu = new Pai(0);
  expect(manzu.isJihai()).toBe(false);

  const jihai = new Pai(108);
  expect(jihai.isJihai()).toBe(true);
});

Deno.test("Pai isSuhai", () => {
  const manzu = new Pai(0);
  expect(manzu.isSuhai()).toBe(true);

  const jihai = new Pai(108);
  expect(jihai.isSuhai()).toBe(false);
});

Deno.test("Pai isYaochuHai", () => {
  const manzu1 = new Pai(0); // m1
  expect(manzu1.isYaochuHai()).toBe(true);

  const manzu5 = new Pai(16); // m5
  expect(manzu5.isYaochuHai()).toBe(false);

  const manzu9 = new Pai(32); // m9
  expect(manzu9.isYaochuHai()).toBe(true);

  const jihai = new Pai(108); // z1
  expect(jihai.isYaochuHai()).toBe(true);
});

Deno.test("Pai isChunchanHai", () => {
  const manzu1 = new Pai(0); // m1
  expect(manzu1.isChunchanHai()).toBe(false);

  const manzu5 = new Pai(16); // m5
  expect(manzu5.isChunchanHai()).toBe(true);

  const manzu9 = new Pai(32); // m9
  expect(manzu9.isChunchanHai()).toBe(false);

  const jihai = new Pai(108); // z1
  expect(jihai.isChunchanHai()).toBe(false);
});

Deno.test("Pai isSangenHai", () => {
  const manzu = new Pai(0); // m1
  expect(manzu.isSangenHai()).toBe(false);

  const haku = new Pai(128); // z5 (白)
  expect(haku.isSangenHai()).toBe(true);

  const hatsu = new Pai(132); // z6 (發)
  expect(hatsu.isSangenHai()).toBe(true);

  const chun = new Pai(132); // z7 (中)
  expect(chun.isSangenHai()).toBe(true);

  const ton = new Pai(108); // z1 (東)
  expect(ton.isSangenHai()).toBe(false);
});
