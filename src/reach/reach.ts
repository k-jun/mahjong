

import { Pai } from "../pai/pai.ts";

export class Shanten {
  private tehai: Pai[];

  constructor(tehai: Pai[]) {
    this.tehai = tehai;
  }

  public calcNormalShanten(): number {
    return 0
  }

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

    return 6 - pairs.size + Math.max(0, 7 - kinds.size);
  }

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

    return 13 - terminals.size - (hasPair ? 1 : 0);
  }

  public calcMinShanten(): number {
    // const normal = this.calcNormalShanten();
    const chiitoi = this.calcChiitoiShanten();
    const kokushi = this.calcKokushiShanten();

    return Math.min(chiitoi, kokushi);
  }
}
