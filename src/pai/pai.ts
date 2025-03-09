import { pais } from "../constant/constant.ts";

export enum PaiType {
  MANZU = "m",
  PINZU = "p",
  SOUZU = "s",
  JIHAI = "z",
}

export class Pai {
  id: number;
  val: string;

  constructor(val: number | string) {
    if (typeof val == "string") {
      this.id = pais.indexOf(val);
      this.val = val;
      return;
    }
    this.id = val;
    this.val = pais[val];
  }

  get typ(): PaiType {
    switch (this.val[0]) {
      case "m":
        return PaiType.MANZU;
      case "p":
        return PaiType.PINZU;
      case "s":
        return PaiType.SOUZU;
      default:
        return PaiType.JIHAI;
    }
  }
  get num(): number {
    if (this.typ == PaiType.JIHAI) {
      return 0;
    }
    if (this.val[1] == "r") {
      return 5;
    }
    return Number(this.val[1]);
  }

  get fmt(): string {
    if (this.val[1] == "r") {
      return this.typ + "5";
    }
    return this.val;
  }

  get dsp(): string {
    if (this.typ != PaiType.JIHAI) {
      return this.val;
    }
    const mapper = new Map<string, string>([
      ["z1", "東"],
      ["z2", "南"],
      ["z3", "西"],
      ["z4", "北"],
      ["z5", "白"],
      ["z6", "發"],
      ["z7", "中"],
    ]);
    return mapper.get(this.val) ?? "";
  }
  next(): Pai {
    if (this.num == 9) {
      return new Pai((this.id - (this.id % 4)) - 4 * 8);
    }
    if (this.val == "z4") {
      return new Pai((this.id - (this.id % 4)) - 4 * 3);
    }
    if (this.val == "z7") {
      return new Pai((this.id - (this.id % 4)) - 4 * 2);
    }
    return new Pai((this.id - (this.id % 4)) + 4);
  }

  isJihai(): boolean {
    return this.typ == PaiType.JIHAI ? true : false;
  }
  isSuhai(): boolean {
    return !this.isJihai();
  }
  isYaochuHai(): boolean {
    if (this.isJihai()) {
      return true;
    }
    if (this.num == 9 || this.num == 1) {
      return true;
    }
    return false;
  }
  isChunchanHai(): boolean {
    return !this.isYaochuHai();
  }
  isSangenHai(): boolean {
    if (["z5", "z6", "z7"].includes(this.val)) {
      return true;
    }
    return false;
  }
  isAka(): boolean {
    return this.val == "mr" || this.val == "pr" || this.val == "sr";
  }
}
