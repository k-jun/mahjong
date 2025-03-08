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
  paiRest: Pai[];
  paiCall: Pai[];
  pais: Pai[];
  type: PaiSetType;
  fromWho: Player;

  constructor(
    { paiRest, paiCall = [], type, fromWho = Player.JICHA }: {
      paiRest: Pai[];
      paiCall?: Pai[];
      type: PaiSetType;
      fromWho?: Player;
    },
  ) {
    this.paiRest = paiRest;
    this.paiCall = paiCall;

    this.type = type;
    this.fromWho = fromWho;

    const all = [...this.paiRest, ...this.paiCall];
    all.sort((a, b) => a.id - b.id);
    this.pais = all;
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
  isOpen(): boolean {
    return ![
      PaiSetType.ANSHUN,
      PaiSetType.ANKAN,
      PaiSetType.ANKO,
    ].includes(this.type);
  }

  isClose(): boolean {
    return !this.isOpen();
  }

  isKotsu(): boolean {
    return [
      PaiSetType.ANKAN,
      PaiSetType.ANKO,
      PaiSetType.MINKAN,
      PaiSetType.MINKO,
      PaiSetType.KAKAN,
    ].includes(this.type);
  }

  isShuntsu(): boolean {
    return !this.isKotsu();
  }

  isKantsu(): boolean {
    return [PaiSetType.KAKAN, PaiSetType.MINKAN, PaiSetType.ANKAN].includes(
      this.type,
    );
  }
}
