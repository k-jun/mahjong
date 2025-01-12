# scilla

## setup

<https://tenhou.net/sc/raw/> より年単位でログをダウンロード。`*.log.gz` と
`*.html.gz` の2種類の拡張子が存在する。解凍後内容を見てみると、HTML の方は ID
が記載されているが、Log
の方は簡略的なログのみである。おそらく、公式大会、鳳凰卓などある程度選出したログのみがダウンロード可能になっているものと思われる。以下のコマンドで
XML
をダウンロードする。ちなみに、年単位となると相当時間がかかる。数時間レベルは覚悟しておいたほうが良い。

```bash
unzip ~/Downloads/scraw2023.zip
cd ~/playground/2023
rm *.log.gz
gunzip *.html.gz

for i in `ls *.html`; do
echo $i
while read head; do
URL=`echo $head | grep -oE 'http[^"]*' | sed -e 's/?log=/log\/?/g'`
ID=`echo $URL | sed -e 's$http://tenhou.net/0/log/?$$'`
curl -s $URL > $ID.xml
done < $i
done
```

## test

```bash
deno test --allow-env --allow-read
```
