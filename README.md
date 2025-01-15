# Scilla

Scilla は麻雀の得点計算ライブラリです。
和了時における翻数計算、符計算、及び得点計算を行います。シャンテン数の計算もサポートしています。
[天鳳](https://tenhou.net/4/) での牌譜 X 件での検証を実施しています。
このため、Sciila は天鳳と同じ様に計算されることが保証されています。
なお、対応しているのは四麻赤アリアリルール(4人麻雀、赤ドラ有り、喰い断有り、後付け有り)のみです。

## Install

```bash
npx jsr add @k-jun/mahjong
```

## Test

```bash
deno test --allow-env --allow-read
```
