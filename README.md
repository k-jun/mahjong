# Mahjong

Mahjong は麻雀の得点計算ライブラリです。
和了時における翻数計算、符計算、及び得点計算を行います。シャンテン数の計算もサポートしています。
[天鳳](https://tenhou.net/4/) での牌譜 X 件での検証を実施しています。
このため、Mahjong は天鳳と同じ様に計算されることが保証されています。
なお、対応しているのは四麻赤アリアリルール(4人麻雀、赤ドラ有り、喰い断有り、後付け有り)のみです。

## Install

```bash
npx jsr add @k-jun/mahjong
```

## Example

```ts
const tokuten = new Tokuten({
  options: {
    isOya: true,
    isTsumo: true,
  },
  paiBakaze: new Pai("z1"),
  paiJikaze: new Pai("z1"),
  paiDora: [new Pai("z2")],
  paiDoraUra: [new Pai("z2")],
  paiRest: [
    new Pai("m1"),
    new Pai("m1"),
    new Pai("m2"),
    new Pai("m2"),
    new Pai("m2"),
    new Pai("m3"),
    new Pai("m3"),
    new Pai("m3"),
    new Pai("z6"),
    new Pai("z6"),
  ],
  paiLast: new Pai("m1"),
  paiSets: [
    new PaiSet(
      {
        pais: [
          new Pai("m4"),
          new Pai("m4"),
          new Pai("m4"),
        ],
        nakiIdx: 1,
        type: PaiSetType.MINKO,
        fromWho: Player.SHIMOCHA,
      },
    ),
  ],
});
console.log(tokuten.count());
```

```bash
{
  han: 6,
  fu: 50,
  pointSum: 18000,
  pointPrt: 0,
  pointCdn: 6000,
  yakus: [
    Yaku { str: "対々和", val: 2, yakuman: false },
    Yaku { str: "三暗刻", val: 2, yakuman: false },
    Yaku { str: "混一色", val: 2, yakuman: false },
    Yaku { str: "裏ドラ", val: 0, yakuman: false }
  ]
}
```

## Test

```bash
deno test -A
```

## Release

```bash
deno publish
```

