import { expect } from "jsr:@std/expect";
// @deno-types="npm:@types/jsdom"
import { JSDOM } from "npm:jsdom";
import { Mentsu, MentsuKind, NewAgaris, Pai } from "../src/main.ts";
import { parseNaki, parseYaku, parseYakuWithHan } from "./utils.ts";

Deno.test("tokutenkeisan", async () => {
  for await (const d of Deno.readDir("./test/fixtures/")) {
    for await (const f of Deno.readDir(`./test/fixtures/${d.name}`)) {
      const text = await Deno.readTextFile(
        `./test/fixtures/${d.name}/${f.name}`,
      );
      const dom = new JSDOM(text, { contentType: "text/xml" });

      const kazes = [
        new Pai(4 * 3 * 9), // 東
        new Pai(4 * 3 * 9 + 4), // 南
        new Pai(4 * 3 * 9 + 8), // 西
        new Pai(4 * 3 * 9 + 12), // 北
      ];
      let kyoku = 0;
      let oya = 0;
      let bakaze = kazes[0];
      let jikaze = kazes[0];
      const dfs = (n: Element) => {
        for (let i = 0; i < n.children.length; i++) {
          if (dfs(n.children[i])) break;
        }
        if (n.tagName == "GO") {
          const go = Number(n.attributes.getNamedItem("type")?.value);
          if (
            // 赤ドラ
            Boolean(go & (1 << 1)) ||
            // 喰いタン、後付け
            Boolean(go & (1 << 2)) ||
            // 四麻
            Boolean(go & (1 << 4))
          ) {
            return true;
          }
        }
        if (n.tagName == "INIT") {
          const attrs: { [key: string]: string } = {};
          for (let i = 0; i < n.attributes.length; i++) {
            const attr = n.attributes[i];
            attrs[attr.name] = attr.value;
          }
          kyoku = Number(attrs["seed"].split(",")[0]);
          oya = Number(attrs["oya"]);
          return false;
        }

        if (n.tagName != "AGARI") return false;
        const attrs: { [key: string]: string } = {};
        for (let i = 0; i < n.attributes.length; i++) {
          const attr = n.attributes[i];
          attrs[attr.name] = attr.value;
        }
        console.log(attrs);
        const pais = attrs["hai"].split(",").map((e: string) =>
          new Pai(Number(e))
        ) ?? [];
        console.log(pais.map((e) => e.val));
        const mentsus = parseNaki(attrs["m"]);
        const agariPai = new Pai(Number(attrs["machi"]));
        const yakus = parseYaku({ yaku: attrs["yaku"] ?? attrs["yakuman"] });
        const yakusWithHan = parseYakuWithHan({
          yaku: attrs["yaku"] ?? attrs["yakuman"],
        });
        const agaris = NewAgaris({ pais, mentsus, agariPai });
        const isTsumo = attrs["who"] == attrs["fromWho"];
        bakaze = kazes[Math.floor(kyoku / 4)];
        jikaze = kazes[(Number(attrs["who"]) - (kyoku % 4) + 4) % 4];
        const doras = attrs["doraHai"].split(",").map((e) =>
          new Pai(Number(e)).next()
        );

        let uraDoras: Array<Pai> = [];
        if (attrs["doraHaiUra"]) {
          uraDoras = attrs["doraHaiUra"].split(",").map((e) =>
            new Pai(Number(e)).next()
          );
        }

        let mp = { tokuten: 0 };
        for (const agari of agaris) {
          let p = agari.tokutenkeisan({
            isTsumo,
            isIppatsu: yakus.some((e) => e == "一発"),
            isRiichi: yakus.some((e) => e == "立直"),
            isHaitei: yakus.some((e) => e == "海底摸月"),
            isHoutei: yakus.some((e) => e == "河底撈魚"),
            isOya: oya == Number(attrs["who"]),
            bakazePai: bakaze,
            jikazePai: jikaze,
            doraPai: doras,
            uraDoraPai: uraDoras,
          });
          if (p.tokuten > mp.tokuten) {
            mp = p;
          }
        }

        const exp = {
          fu: Number(attrs["ten"].split(",")[0]),
          tokuten: Number(attrs["ten"].split(",")[1]),
          han: attrs["yaku"].split(",").reduce(
            (a, e, i) => a = i % 2 == 1 ? a + Number(e) : a,
            0,
          ),
          yakus: yakusWithHan.filter((e) => e.val != 0).sort((a, b) =>
            a.str > b.str ? 1 : -1
          ),
        };
        expect(mp).toEqual(exp);
      };
      dfs(dom.window.document.documentElement);
      break;
    }
  }
});
