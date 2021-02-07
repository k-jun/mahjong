package cha

import (
	"mahjong/model/attribute"
	"mahjong/model/hai"
	"mahjong/model/ho"
	"mahjong/model/huro"
	"mahjong/model/tehai"
	"mahjong/model/yama"

	"github.com/google/uuid"
)

type Cha interface {
	Tehai() tehai.Tehai
	Tumo() error
	TumoHai() *hai.Hai
	Dahai(outHai *hai.Hai) error
	SetYama(yama.Yama) error
	Haihai() error
	Chi(inHai *hai.Hai, outHais [2]*hai.Hai) error
	Pon(inHai *hai.Hai, outHais [2]*hai.Hai) error
	Kan(inHai *hai.Hai, outHais [3]*hai.Hai) error
	Kakan(inHai *hai.Hai) error
	CanRichi() []*hai.Hai
}

type chaImpl struct {
	id      uuid.UUID
	tumohai *hai.Hai
	ho      ho.Ho
	tehai   tehai.Tehai
	huro    huro.Huro
	yama    yama.Yama
}

func New(id uuid.UUID, ho ho.Ho, t tehai.Tehai, y yama.Yama, hu huro.Huro) Cha {
	return &chaImpl{
		id:    id,
		ho:    ho,
		tehai: t,
		yama:  y,
		huro:  hu,
	}
}

func (c *chaImpl) Id() uuid.UUID {
	return c.id
}

func (c *chaImpl) Tehai() tehai.Tehai {
	return c.tehai
}

func (c *chaImpl) TumoHai() *hai.Hai {
	return c.tumohai
}

func (c *chaImpl) Tumo() error {
	if c.tumohai != nil {
		return ChaAlreadyHaveTumohaiErr
	}

	tumohai, err := c.yama.Tumo()
	if err != nil {
		return err
	}

	c.tumohai = tumohai
	return nil
}

func (c *chaImpl) Dahai(outHai *hai.Hai) error {
	var err error
	if outHai != c.tumohai {
		outHai, err = c.tehai.Replace(c.tumohai, outHai)
		if err != nil {
			return err
		}
	}
	c.tumohai = nil

	return c.ho.Add(outHai)
}

func (c *chaImpl) SetYama(y yama.Yama) error {
	if c.yama != nil {
		return ChaAlreadyHaveYamaErr
	}
	c.yama = y
	return nil
}

func (c *chaImpl) Haihai() error {
	if c.tehai.Len() != 0 {
		return ChaAlreadyDidHaihaiErr
	}

	for i := 0; i < tehai.MaxHaisLen; i++ {
		tumoHai, err := c.yama.Tumo()
		if err != nil {
			return err
		}
		if err := c.tehai.Add(tumoHai); err != nil {
			return err
		}
	}

	if err := c.tehai.Sort(); err != nil {
		return err
	}
	return nil
}

func (c *chaImpl) Chi(inHai *hai.Hai, outHais [2]*hai.Hai) error {
	if inHai == c.tumohai {
		c.tumohai = nil
	}
	hais, err := c.tehai.Removes([]*hai.Hai{outHais[0], outHais[1]})
	if err != nil {
		return err
	}
	set := [3]*hai.Hai{inHai, hais[0], hais[1]}

	return c.huro.Chi(set)
}

func (c *chaImpl) Pon(inHai *hai.Hai, outHais [2]*hai.Hai) error {
	if inHai == c.tumohai {
		c.tumohai = nil
	}
	hais, err := c.tehai.Removes([]*hai.Hai{outHais[0], outHais[1]})
	if err != nil {
		return err
	}
	set := [3]*hai.Hai{inHai, hais[0], hais[1]}

	return c.huro.Pon(set)
}

func (c *chaImpl) Kan(inHai *hai.Hai, outHais [3]*hai.Hai) error {
	if inHai == c.tumohai {
		c.tumohai = nil
	}
	hais, err := c.tehai.Removes([]*hai.Hai{outHais[0], outHais[1]})
	if err != nil {
		return err
	}
	set := [4]*hai.Hai{inHai, hais[0], hais[1], hais[2]}

	return c.huro.MinKan(set)
}

func (c *chaImpl) Kakan(inHai *hai.Hai) error {
	if inHai == c.tumohai {
		c.tumohai = nil
	}
	return c.huro.Kakan(inHai)
}

func (c *chaImpl) CanRichi() []*hai.Hai {
	outHais := []*hai.Hai{}
	if len(c.huro.GetChi()) != 0 || len(c.huro.GetPon()) != 0 || len(c.huro.GetMinKan()) != 0 {
		return outHais
	}

	hais := c.tehai.Hais()
	hais = append(hais, c.tumohai)

	for _, eh := range hais {
		hs := append([]*hai.Hai{}, hais...)
		hs = removeHai(hs, eh)

		if isRichi(hs) && !haiContain(hs, eh) {
			outHais = append(outHais, eh)
		}
	}
	// TODO make uniq

	return outHais
}

func haiContain(a []*hai.Hai, h *hai.Hai) bool {
	for _, hi := range a {
		if h == hi {
			return true
		}
	}
	return false

}

func isRichi(hais []*hai.Hai) bool {
	cnt := map[*hai.Hai]int{}
	for _, h := range hais {
		cnt[h] += 1
	}

	for k, v := range cnt {
		hais := append([]*hai.Hai{}, hais...)
		if v < 2 {
			// 単騎
			for {
				anko := findAnko(hais)
				syuntu := findSyuntu(hais)
				if len(anko) != 0 {
					hais = removeHais(hais, anko)
				}
				if len(syuntu) != 0 {
					hais = removeHais(hais, syuntu)
				}

				if len(syuntu) == 0 && len(anko) == 0 {
					break
				}
			}
			if len(hais) == 1 {
				return true
			}
		} else {
			// 両面, 嵌張, 双碰
			hais = removeHais(hais, []*hai.Hai{k, k})
			for {
				anko := findAnko(hais)
				syuntu := findSyuntu(hais)
				if len(anko) != 0 {
					hais = removeHais(hais, anko)
				}
				if len(syuntu) != 0 {
					hais = removeHais(hais, syuntu)
				}

				if len(syuntu) == 0 && len(anko) == 0 {
					break
				}
			}
			if len(hais) == 2 && isMati([2]*hai.Hai{hais[0], hais[1]}) {
				return true
			}
		}
	}

	return false
}

func isMati(hais [2]*hai.Hai) bool {
	if hais[0] == hais[1] {
		return true
	}
	num1 := hai.HaitoI(hais[0])
	num2 := hai.HaitoI(hais[1])
	if num1 == 0 || num2 == 0 {
		return false
	}
	if num2 > num1 {
		return num2-num1 <= 2
	} else {
		return num1-num2 <= 2
	}
}

func removeHais(hais []*hai.Hai, outHais []*hai.Hai) []*hai.Hai {
	for _, hai := range outHais {
		hais = removeHai(hais, hai)
	}
	return hais
}

func removeHai(hais []*hai.Hai, hai *hai.Hai) []*hai.Hai {
	for i, h := range hais {
		if h == hai {
			hais = append(hais[:i], hais[i+1:]...)
			return hais
		}
	}
	panic(ChaHaiNotFoundErr)
}

func findSyuntu(hais []*hai.Hai) []*hai.Hai {
	for _, h := range hais {
		if h.HasAttribute(&attribute.Zihai) {
			continue
		}
		suit := hai.HaitoSuits(h)
		num := hai.HaitoI(h)
		// find left pair
		if num <= 7 && hasHai(hais, suit[num+1]) && hasHai(hais, suit[num+2]) {
			// removeHais(hais, []*hai.Hai{h, suit[num+1], suit[num+2]})
			return []*hai.Hai{h, suit[num+1], suit[num+2]}
		}
	}
	return []*hai.Hai{}
}

func findAnko(hais []*hai.Hai) []*hai.Hai {
	cnt := map[*hai.Hai]int{}
	for _, h := range hais {
		cnt[h] += 1
		if cnt[h] >= 3 {
			return []*hai.Hai{h, h, h}
		}
	}
	return []*hai.Hai{}
}

func hasHai(hais []*hai.Hai, hai *hai.Hai) bool {
	for _, h := range hais {
		if h == hai {
			return true
		}
	}
	return false
}