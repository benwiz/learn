package main

import (
	"bytes"
	"crypto/sha256"
	"fmt"
	"math"
	"math/big"
)

var (
	maxNonce = math.MaxInt64
)

// Difficulty. 24 is an arbitrary number, our goal is to have a target that takes less than 256 bits in memory.
// We check the resulting hash against the target. If it is smaller, we are good. If bigger, proof-of-work is not enough.
const targetBits = 16 // 24

// ProofOfWork represents a proof-of-work
type ProofOfWork struct {
	block  *Block
	target *big.Int
}

// NewProofOfWork creates a new ProofOfWork
func NewProofOfWork(b *Block) *ProofOfWork {
	target := big.NewInt(1)
	target.Lsh(target, uint(256-targetBits))

	proofOfWork := &ProofOfWork{b, target}

	return proofOfWork
}

// prepareData merges the block fields (hash, data, timestamp), with the target and none.
// `nonce` is a one-time-use addemdum to the data. We're using a counter.
func (proofOfWork *ProofOfWork) prepareData(nonce int) []byte {
	data := bytes.Join(
		[][]byte{
			proofOfWork.block.PrevBlockHash,
			proofOfWork.block.Data,
			IntToHex(proofOfWork.block.Timestamp),
			IntToHex(int64(targetBits)),
			IntToHex(int64(nonce)),
		},
		[]byte{},
	)

	return data
}

// Run performs the actual proof-of-work
func (proofOfWork *ProofOfWork) Run() (int, []byte) {
	var hashInt big.Int
	var hash [32]byte
	nonce := 0

	fmt.Printf("Mining the block containing \"%s\"\n", proofOfWork.block.Data)
	for nonce < maxNonce { // We use a check here to prevent a memory overflow, should never reach the end of this loop, though
		data := proofOfWork.prepareData(nonce)
		hash = sha256.Sum256(data)
		fmt.Printf("\r%x", hash)
		hashInt.SetBytes(hash[:])

		if hashInt.Cmp(proofOfWork.target) == -1 {
			break
		} else {
			nonce++
		}
	}
	fmt.Print("\n\n")

	return nonce, hash[:]
}

// Validate validates the block's proof-of-work
func (proofOfWork *ProofOfWork) Validate() bool {
	var hashInt big.Int

	data := proofOfWork.prepareData(proofOfWork.block.Nonce)
	hash := sha256.Sum256(data)
	hashInt.SetBytes(hash[:])

	isValid := hashInt.Cmp(proofOfWork.target) == -1

	return isValid
}
