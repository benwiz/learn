package main

import (
	"bytes"
	"crypto/sha256"
	"strconv"
	"time"
)

// Block stores block headers
type Block struct {
	Timestamp     int64
	Data          []byte
	PrevBlockHash []byte
	Hash          []byte
}

// SetHash creates a sha256 hash based on the previous block's hash, the data, and the timestamp.
func (b *Block) SetHash() {
	timestamp := []byte(strconv.FormatInt(b.Timestamp, 10))
	headers := bytes.Join([][]byte{b.PrevBlockHash, b.Data, timestamp}, []byte{})
	hash := sha256.Sum256(headers)

	b.Hash = hash[:]
}

// NewBlock creates a new block
func NewBlock(data string, prevBlockHash []byte) *Block {
	block := &Block{time.Now().Unix(), []byte(data), prevBlockHash, []byte{}}
	block.SetHash()
	return block
}

// NewGenesisBlock creates a new genesis (starting) block which has an emmpty prevBlockHash
func NewGenesisBlock() *Block {
	return NewBlock("Genesis Block", []byte{})
}
