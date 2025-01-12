import { Pai, PaiType } from "../pai/pai.ts";

export class Shanten {
    private tehai: Pai[];

    constructor(tehai: Pai[]) {
        this.tehai = tehai;
    }

    calcPairAB(nums: number[]) {
        let cnt = 0;
        let pnt = 0;
        for (let n = 0; n <= 9; n++) {
            cnt += nums[n];
            if (n <= 7 && nums[n + 1] == 0 && nums[n + 2] == 0) {
                pnt += Math.floor(cnt / 2);
                cnt = 0;
            }
        }
        pnt += Math.floor(cnt / 2);
        return pnt;
    }

    calcSetPairAB(nums: number[], n: number): number[][] {
        if (n > 9) {
            const cnt = this.calcPairAB(nums);
            const r = [[0, cnt], [0, cnt]];
            return r;
        }

        const max = this.calcSetPairAB(nums, n + 1);
        if (n <= 7 && nums[n] > 0 && nums[n + 1] > 0 && nums[n + 2] > 0) {
            const numsCopy = [...nums];
            numsCopy[n] -= 1;
            numsCopy[n + 1] -= 1;
            numsCopy[n + 2] -= 1;
            const r = this.calcSetPairAB(numsCopy, n);
            r[0][0] += 1;
            r[1][0] += 1;
            if (r[0][0] * 2 + r[0][1] > max[0][0] * 2 + max[0][1]) {
                max[0] = r[0];
            }
            if (r[1][0] * 10 + r[1][1] > max[1][0] * 10 + max[1][1]) {
                max[1] = r[1];
            }
        }

        if (nums[n] >= 3) {
            const numsCopy = [...nums];
            numsCopy[n] -= 3;
            const r = this.calcSetPairAB(numsCopy, n);
            r[0][0] += 1;
            r[1][0] += 1;
            if (r[0][0] * 2 + r[0][1] > max[0][0] * 2 + max[0][1]) {
                max[0] = r[0];
            }
            if (r[1][0] * 10 + r[1][1] > max[1][0] * 10 + max[1][1]) {
                max[1] = r[1];
            }
        }

        return max;
    }

    public calcNormalShanten(): number {
        // ref: https://blog.kobalab.net/entry/20151217/1450357254

        const mp = this.tehai.filter((e) => e.typ == PaiType.SOUZU);
        const pp = this.tehai.filter((e) => e.typ == PaiType.PINZU);
        const sp = this.tehai.filter((e) => e.typ == PaiType.SOUZU);
        const zp = this.tehai.filter((e) => e.typ == PaiType.JIHAI);

        return 0;
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
