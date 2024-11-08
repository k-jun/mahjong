import { Pai } from "../pai/pai.ts";

export enum PaiSetType {
  MINSHUN = 1,
  MINKO = 2,
  MINKAN = 3,
  ANSHUN = 4,
  ANKO = 5,
  ANKAN = 6,
  KAKAN = 7,
}

export enum MachiType {
  INVALID = 0,
  RYANMEN = 1,
  KANCHAN = 2,
  PENCHAN = 3,
  SHANPON = 4,
  // using in agari.ts
  TANKIMC = 5,
}

export enum Player {
  JICHA = 0,
  SHIMOCHA = 1,
  TOIMEN = 2,
  KAMICHA = 3,
}

export class PaiSet {
  pais: Array<Pai>;
  type: PaiSetType;
  nakiIdx: number;
  fromWho: Player;

  constructor(
    { pais, type, nakiIdx = -1, fromWho = Player.JICHA }: {
      pais: Array<Pai>;
      type: PaiSetType;
      nakiIdx: number;
      fromWho: Player;
    },
  ) {
    this.pais = pais;
    this.type = type;
    this.fromWho = fromWho;
    this.nakiIdx = nakiIdx;
  }

  machi({ pai }: { pai: Pai }): MachiType {
    if (
      [
        PaiSetType.KAKAN,
        PaiSetType.MINKAN,
        PaiSetType.MINKO,
        PaiSetType.MINSHUN,
        PaiSetType.ANKAN,
      ].includes(this.type)
    ) {
      return MachiType.INVALID;
    }
    const idx = this.pais.findIndex((e) => e.fmt == pai.fmt);
    if (idx != -1 && this.type == PaiSetType.ANKO) {
      return MachiType.SHANPON;
    }
    switch (idx) {
      case 0:
        if (this.pais[1].num == 8 && this.pais[2].num == 9 && pai.num == 7) {
          return MachiType.PENCHAN;
        }
        return MachiType.RYANMEN;
      case 1:
        return MachiType.KANCHAN;
      case 2:
        if (pai.num == 3 && this.pais[0].num == 1 && this.pais[1].num == 2) {
          return MachiType.PENCHAN;
        }
        return MachiType.RYANMEN;
      default:
        return MachiType.INVALID;
    }
  }
  isOpen() {
    return ![
      PaiSetType.ANSHUN,
      PaiSetType.ANKAN,
      PaiSetType.ANKO,
    ].includes(this.type);
  }

  isClose() {
    return !this.isOpen();
  }

  isKotsu() {
    return [
      PaiSetType.ANKAN,
      PaiSetType.ANKO,
      PaiSetType.MINKAN,
      PaiSetType.MINKO,
      PaiSetType.KAKAN,
    ].includes(this.type);
  }

  isShuntsu() {
    return !this.isKotsu();
  }

  isKantsu() {
    return [PaiSetType.KAKAN, PaiSetType.MINKAN, PaiSetType.ANKAN].includes(
      this.type,
    );
  }
}
