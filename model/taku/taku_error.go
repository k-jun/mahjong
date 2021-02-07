package taku

import "errors"

var (
	TakuMaxNOUErr          = errors.New("reach to the max number of users in the table")
	TakuIndexOutOfRangeErr = errors.New("the index is out of range")
	TakuChaNotFoundErr     = errors.New("the cha not found in the taku")
)