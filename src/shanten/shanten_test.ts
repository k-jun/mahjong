import { Pai } from "../pai/pai.ts";
import { Shanten } from "./shanten.ts";
import { expect } from "jsr:@std/expect";

Deno.test("calcKokushiShanten", () => {
  // Test complete kokushi hand (13 different terminals/honors + pair)
  const completeHand = [
    new Pai(0), // m1
    new Pai(32), // m9
    new Pai(36), // p1
    new Pai(68), // p9
    new Pai(72), // s1
    new Pai(104), // s9
    new Pai(108), // z1 (東)
    new Pai(108), // z1 (東, pair)
    new Pai(112), // z2 (南)
    new Pai(116), // z3 (西)
    new Pai(120), // z4 (北)
    new Pai(124), // z5 (白)
    new Pai(128), // z6 (發)
    new Pai(132), // z7 (中)
  ];
  const completeShanten = new Shanten(completeHand);
  expect(completeShanten.calcKokushiShanten()).toBe(-1);

  // Test tenpai hand (missing one terminal/honor)
  const tenpaiHand = [
    new Pai(0), // m1
    new Pai(32), // m9
    new Pai(36), // p1
    new Pai(68), // p9
    new Pai(72), // s1
    new Pai(104), // s9
    new Pai(108), // z1 (東)
    new Pai(112), // z2 (南)
    new Pai(116), // z3 (西)
    new Pai(120), // z4 (北)
    new Pai(124), // z5 (白)
    new Pai(128), // z6 (發)
    new Pai(128), // z6 (發, pair)
  ];
  const tenpaiShanten = new Shanten(tenpaiHand);
  expect(tenpaiShanten.calcKokushiShanten()).toBe(0);

  // Test hand far from kokushi (few terminals/honors)
  const farHand = [
    new Pai(4), // m2
    new Pai(8), // m3
    new Pai(12), // m4
    new Pai(16), // m5
    new Pai(20), // m6
    new Pai(24), // m7
    new Pai(28), // m8
    new Pai(108), // z1 (東)
    new Pai(108), // z1 (東)
    new Pai(112), // z2 (南)
    new Pai(116), // z3 (西)
    new Pai(120), // z4 (北)
    new Pai(124), // z5 (白)
  ];
  const farShanten = new Shanten(farHand);
  expect(farShanten.calcKokushiShanten()).toBe(7);
});

Deno.test("calcChiitoiShanten", () => {
  // Test complete chiitoi hand (7 pairs)
  const completeHand = [
    new Pai(0), // m1
    new Pai(0), // m1
    new Pai(32), // m9
    new Pai(32), // m9
    new Pai(36), // p1
    new Pai(36), // p1
    new Pai(68), // p9
    new Pai(68), // p9
    new Pai(72), // s1
    new Pai(72), // s1
    new Pai(104), // s9
    new Pai(104), // s9
    new Pai(108), // z1
    new Pai(108), // z1
  ];
  const completeShanten = new Shanten(completeHand);
  expect(completeShanten.calcChiitoiShanten()).toBe(-1);

  // Test tenpai hand (6 pairs + 1 tile)
  const tenpaiHand = [
    new Pai(0), // m1
    new Pai(0), // m1
    new Pai(32), // m9
    new Pai(32), // m9
    new Pai(36), // p1
    new Pai(36), // p1
    new Pai(68), // p9
    new Pai(68), // p9
    new Pai(72), // s1
    new Pai(72), // s1
    new Pai(104), // s9
    new Pai(104), // s9
    new Pai(108), // z1 (single)
  ];
  const tenpaiShanten = new Shanten(tenpaiHand);
  expect(tenpaiShanten.calcChiitoiShanten()).toBe(0);

  // Test hand far from chiitoi (few pairs)
  const farHand = [
    new Pai(0), // m1
    new Pai(4), // m2
    new Pai(8), // m3
    new Pai(12), // m4
    new Pai(16), // m5
    new Pai(20), // m6
    new Pai(24), // m7
    new Pai(28), // m8
    new Pai(32), // m9
    new Pai(32), // m9
    new Pai(36), // p1
    new Pai(36), // p1
    new Pai(40), // p2
  ];
  const farShanten = new Shanten(farHand);
  expect(farShanten.calcChiitoiShanten()).toBe(4);

  // Test another chiitoi hand
  const hand1 = [
    new Pai(12), // m4
    new Pai(16), // m5
    new Pai(28), // m8
    new Pai(56), // p6
    new Pai(56), // p6
    new Pai(60), // p7
    new Pai(72), // s1
    new Pai(72), // s1
    new Pai(92), // s6
    new Pai(92), // s6
    new Pai(100), // s8
    new Pai(100), // s8
    new Pai(124), // z7 (白)
    new Pai(124), // z7 (白)
  ];
  const hand1Shanten = new Shanten(hand1);
  expect(hand1Shanten.calcChiitoiShanten()).toBe(1);

  const hand2 = [
    new Pai(12), // m4
    new Pai(16), // m5
    new Pai(28), // m8
    new Pai(56), // p6
    new Pai(56), // p6
    new Pai(56), // p6
    new Pai(72), // s1
    new Pai(72), // s1
    new Pai(92), // s6
    new Pai(92), // s6
    new Pai(100), // s8
    new Pai(100), // s8
    new Pai(124), // z7 (白)
    new Pai(124), // z7 (白)
  ];

  const hand2Shanten = new Shanten(hand2);
  expect(hand2Shanten.calcChiitoiShanten()).toBe(1);

  const hand3 = [
    new Pai(12), // m4
    new Pai(12), // m4
    new Pai(56), // p6
    new Pai(56), // p6
    new Pai(56), // p6
    new Pai(56), // p6
    new Pai(72), // s1
    new Pai(72), // s1
    new Pai(92), // s6
    new Pai(92), // s6
    new Pai(100), // s8
    new Pai(100), // s8
    new Pai(124), // z7 (白)
    new Pai(124), // z7 (白)
  ];

  const hand3Shanten = new Shanten(hand3);
  expect(hand3Shanten.calcChiitoiShanten()).toBe(1);

  const hand4 = [
    new Pai(0), // m1
    new Pai(4), // m2
    new Pai(8), // m3
    new Pai(12), // m4
    new Pai(16), // m5
    new Pai(20), // m6
    new Pai(24), // m7
    new Pai(28), // m8
    new Pai(32), // m9
    new Pai(36), // p1
    new Pai(40), // p2
    new Pai(44), // p3
    new Pai(48), // p4
    new Pai(52), // pr
  ];

  const hand4Shanten = new Shanten(hand4);
  expect(hand4Shanten.calcChiitoiShanten()).toBe(6);
});

Deno.test("calcNormalShanten", () => {
  const hand1 = [
    new Pai(0), // m1
    new Pai(4), // m2
    new Pai(8), // m3
    new Pai(12), // m4
    new Pai(16), // m5
    new Pai(20), // m6
    new Pai(24), // m7
    new Pai(28), // m8
    new Pai(32), // m9
    new Pai(32), // m9
    new Pai(32), // m9
    new Pai(36), // p1
    new Pai(40), // p2
    new Pai(44), // p3
  ];

  const hand1Shanten = new Shanten(hand1);
  expect(hand1Shanten.calcNormalShanten()).toBe(-1);

  const hand2 = [
    new Pai(0), // m1
    new Pai(4), // m2
    new Pai(12), // m4
    new Pai(16), // m5
    new Pai(52), // p5
    new Pai(56), // p6
    new Pai(60), // p7
    new Pai(72), // s1
    new Pai(76), // s2
    new Pai(80), // s3
    new Pai(88), // s5
    new Pai(92), // s6
    new Pai(100), // s8
    new Pai(104) // s9
  ];

  const hand2Shanten = new Shanten(hand2);
  expect(hand2Shanten.calcNormalShanten()).toBe(2);

  const hand3 = [
    new Pai(0), // m1
    new Pai(4), // m2
    new Pai(12), // m4
    new Pai(16), // m5
    new Pai(52), // p5
    new Pai(56), // p6
    new Pai(60), // p7
    new Pai(72), // s1
    new Pai(76), // s2
    new Pai(80), // s3
    new Pai(88), // s5
    new Pai(92), // s6
    new Pai(100), // s8
    new Pai(100) // s8
  ];

  const hand3Shanten = new Shanten(hand3);
  expect(hand3Shanten.calcNormalShanten()).toBe(1);
  
  const hand4 = [
    new Pai(4),  // m2
    new Pai(8),  // m3
    new Pai(16), // m5
    new Pai(20), // m6
    new Pai(44), // p3
    new Pai(48), // p4
    new Pai(60), // p7
    new Pai(64), // p8
    new Pai(64), // p8
    new Pai(80), // s3
    new Pai(84), // s4
    new Pai(108), // z1 (東)
    new Pai(112), // z2 (南)
    new Pai(116), // z3 (西)
  ];

  const hand4Shanten = new Shanten(hand4);
  expect(hand4Shanten.calcNormalShanten()).toBe(3);

  const hand5 = [
    new Pai(0),  // m1
    new Pai(4),  // m2
    new Pai(8),  // m3
    new Pai(12), // m4
    new Pai(16), // m5
    new Pai(20), // m6
    new Pai(24), // m7
    new Pai(28), // m8
    new Pai(32), // m9
    new Pai(36), // p1
    new Pai(40), // p2
    new Pai(44), // p3
    new Pai(48), // p4
    new Pai(52)  // p5
  ];

  const hand5Shanten = new Shanten(hand5);
  expect(hand5Shanten.calcNormalShanten()).toBe(0);
});

Deno.test("calcMinShanten", () => {
  // Normal hand (2 shanten)
  const hand1 = [
    new Pai(0),  // m1
    new Pai(4),  // m2
    new Pai(8),  // m3
    new Pai(12), // m4
    new Pai(16), // m5
    new Pai(20), // m6
    new Pai(24), // m7
    new Pai(28), // m8
    new Pai(32), // m9
    new Pai(36), // p1
    new Pai(40), // p2
    new Pai(44), // p3
    new Pai(48), // p4
    new Pai(52)  // p5
  ];
  const hand1Shanten = new Shanten(hand1);
  expect(hand1Shanten.calcMinShanten()).toBe(0);

  // Chiitoi hand (1 shanten)
  const hand2 = [
    new Pai(0),  // m1
    new Pai(0),  // m1
    new Pai(4),  // m2
    new Pai(4),  // m2
    new Pai(8),  // m3
    new Pai(8),  // m3
    new Pai(12), // m4
    new Pai(16), // m5
    new Pai(16), // m5
    new Pai(20), // m6
    new Pai(20), // m6
    new Pai(24), // m7
    new Pai(28), // m8
    new Pai(32)  // m9
  ];
  const hand2Shanten = new Shanten(hand2);
  expect(hand2Shanten.calcMinShanten()).toBe(0);

  // Kokushi hand (3 shanten)
  const hand3 = [
    new Pai(0),   // m1
    new Pai(32),  // m9
    new Pai(36),  // p1
    new Pai(68),  // p9
    new Pai(72),  // s1
    new Pai(104), // s9
    new Pai(108), // z1 (東)
    new Pai(112), // z2 (南)
    new Pai(116), // z3 (西)
    new Pai(120), // z4 (北)
    new Pai(124), // z5 (白)
    new Pai(128), // z6 (発)
    new Pai(132), // z7 (中)
    new Pai(132)  // z7 (中)
  ];
  const hand3Shanten = new Shanten(hand3);
  expect(hand3Shanten.calcMinShanten()).toBe(-1);
});
