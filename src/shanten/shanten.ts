import { Pai, PaiType } from "../pai/pai.ts";

export class Shanten {
    private tehai: Pai[];

    constructor(tehai: Pai[]) {
        this.tehai = tehai;
    }

    calcPairAB(nums: number[]) {
        let cnt = 0;
        let pnt = 0;
        for (let n = 0; n < nums.length; n++) {
            cnt += nums[n];
            if (n < 7 && nums[n + 1] == 0 && nums[n + 2] == 0) {
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

    calcAllAB(pais: Pai[]): number {
        const mp = pais.filter((e) => e.typ == PaiType.MANZU);
        const pp = pais.filter((e) => e.typ == PaiType.PINZU);
        const sp = pais.filter((e) => e.typ == PaiType.SOUZU);
        const zp = pais.filter((e) => e.typ == PaiType.JIHAI);

        const ma = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        const pa = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        const sa = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        const items: [Pai[], number[]][] = [[mp, ma], [pp, pa], [sp, sa]];
        for (const [p, a] of items) {
            for (const pi of p) {
                a[pi.num - 1] += 1;
            }
        }

        const mr = this.calcSetPairAB(ma, 0);
        const pr = this.calcSetPairAB(pa, 0);
        const sr = this.calcSetPairAB(sa, 0);

        const zr = [0, 0];
        const zm = new Map<string, number>();
        for (const pi of zp) {
            zm.set(pi.val, (zm.get(pi.val) || 0) + 1);
        }
        for (const v of zm.keys()) {
            if ((zm.get(v) || 0) >= 3) {
                zr[0] += 1;
            }
            if ((zm.get(v) || 0) == 2) {
                zr[1] += 1;
            }
        }

        let min = 8;

        for (const m of mr) {
            for (const p of pr) {
                for (const s of sr) {
                    const set = m[0] + p[0] + s[0] + zr[0];
                    let pair = m[1] + p[1] + s[1] + zr[1];

                    if (set + pair >= 4) {
                        pair = 4 - set;
                    }
                    const minkamo = 8 - (set * 2) - pair;
                    if (minkamo < min) {
                        min = minkamo;
                    }
                }
            }
        }

        return min;
    }

    public calcNormalShanten(): number {
        // ref: https://blog.kobalab.net/entry/20151217/1450357254
        const nums = new Map<string, number>();
        let min = this.calcAllAB(this.tehai);
        for (const pi of this.tehai) {
            nums.set(pi.val, (nums.get(pi.val) || 0) + 1);
        }

        for (const v of nums.keys()) {
            if ((nums.get(v) || 0) >= 2) {
                const paisCopy = [...this.tehai];
                paisCopy.splice(paisCopy.findIndex((e) => e.val == v), 1);
                paisCopy.splice(paisCopy.findIndex((e) => e.val == v), 1);
                const r = this.calcAllAB(paisCopy) - 1;
                if (r < min) {
                    min = r;
                }
            }
        }
        return min;
    }

    public calcChiitoiShanten(): number {
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
        const normal = this.calcNormalShanten();
        const chiitoi = this.calcChiitoiShanten();
        const kokushi = this.calcKokushiShanten();

        return Math.min(normal, chiitoi, kokushi);
    }
}
