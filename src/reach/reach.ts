

import { Pai } from "../pai/pai.ts";

export class Shanten {
  private tehai: Pai[];

  constructor(tehai: Pai[]) {
    this.tehai = tehai;
  }

//   /**
//    * Calculate shanten number for regular hand (not kokushi/chiitoi)
//    * Returns number of tiles away from tenpai (-1 = win, 0 = tenpai, 1+ = needs more tiles)
//    */
//   public calcNormalShanten(): number {
//     let minShanten = 8; // Max shanten is 8
//     let mentsuCount = 0;
//     let tatsuCount = 0;
//     let toitsuCount = 0;

//     // Count mentsu (complete sets), tatsu (partial sets), toitsu (pairs)
//     for (let i = 0; i < this.tehai.length; i++) {
//       const current = this.tehai[i];
      
//       // Skip if already used
//       if (!current) continue;

//       // Check for triplets
//       if (i + 2 < this.tehai.length && 
//           current.val === this.tehai[i + 1]?.val && 
//           current.val === this.tehai[i + 2]?.val) {
//         mentsuCount++;
//         i += 2;
//         continue;
//       }

//       // Check for sequences
//       if (current.isSuhai() && i + 2 < this.tehai.length) {
//         const next = this.tehai[i + 1];
//         const nextNext = this.tehai[i + 2];
//         if (next && nextNext && 
//             next.val === current.next().val &&
//             nextNext.val === current.next().next().val) {
//           mentsuCount++;
//           i += 2;
//           continue;
//         }
//       }

//       // Check for pairs
//       if (i + 1 < this.tehai.length && current.val === this.tehai[i + 1]?.val) {
//         toitsuCount++;
//         i++;
//         continue;
//       }

//       // Check for partial sets (two consecutive tiles)
//       if (current.isSuhai() && i + 1 < this.tehai.length) {
//         const next = this.tehai[i + 1];
//         if (next && next.val === current.next().val) {
//           tatsuCount++;
//           i++;
//           continue;
//         }
//       }
//     }

//     // Calculate shanten
//     const sets = mentsuCount * 2 + tatsuCount;
//     const pairs = toitsuCount;
    
//     // Need 4 mentsu + 1 pair for complete hand
//     const currentShanten = 8 - (sets + Math.min(4 - mentsuCount, pairs));
//     minShanten = Math.min(minShanten, currentShanten);

//     return minShanten;
//   }

  /**
   * Calculate shanten number for chiitoi (seven pairs)
   * Returns number of tiles away from tenpai
   */
  public calcChiitoiShanten(): number {
    let pairCount = 0;
    const pairs = new Set<string>();
    const kinds = new Set<string>();
    
    for (const pai of this.tehai) {
      if (kinds.has(pai.val)) {
        pairs.add(pai.val);
      }
      kinds.add(pai.val);
    }

    // Need exactly 7 pairs for chiitoi
    return 6 - pairs.size + Math.max(0, 7 - kinds.size);
  }

  /**
   * Calculate shanten number for kokushi musou (thirteen orphans)
   * Returns number of tiles away from tenpai
   */
  public calcKokushiShanten(): number {
    const terminals = new Set<string>();
    let hasPair = false;

    for (const pai of this.tehai) {      
      if (pai.isYaochuHai()) {
        if (terminals.has(pai.val)) {
          hasPair = true;
        } else {
          terminals.add(pai.val);
        }
      }
    }

    // Need 13 different terminals/honors + 1 pair from those
    return 13 - terminals.size - (hasPair ? 1 : 0);
  }

  /**
   * Calculate minimum shanten number across all hand types
   * Returns the lowest shanten number possible
   */
  public calcMinShanten(): number {
    // const normal = this.calcNormalShanten();
    const chiitoi = this.calcChiitoiShanten();
    const kokushi = this.calcKokushiShanten();

    return Math.min(chiitoi, kokushi);
  }
}
