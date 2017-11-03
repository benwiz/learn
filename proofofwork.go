package main

import (
	"math/big"
	"bytes"
	// "crypto/sha256"
	// "fmt"
	"math"
	// "math/big"
)

var (
	maxNonce = math.MaxInt64
)

// Difficulty. 24 is an arbitrary number, our goal is to have a target that takes less than 256 bits in memory.
// We check the resulting hash against the target. If it is smaller, we are good. If bigger, proof-of-work is not enough.
const targetBits = 24

// ProofOfWork represents a proof-of-work
type ProofOfWork struct {
	block  *Block
	target *big.Int
}

// NewProofOfWork creates a new ProofOfWork
func ProofOfWork(b *Block) *ProofOfWork {
	target := big.NewInt(1)
	target.Lsh(target, uint(256-targetBits))

	proofOfWork := &ProofOfWork{b, target}

	return proofOfWork
}

// prepareData merges the block fields (hash, data, timestamp), with the target and none.
func (*proofOfWork ProofOfWork) prepareData(nonce int) []byte {
	data := bytes.Join(
		[][]byte {
			pow.block.PrevBlockHash,
			pow.block.Data,
			IntToHex(proofOfWork.block.Timestamp),
			IntToHex(int64(targetBits)),
			IntToHex(int64(nonce)),
		},
		[]byte{}
	)

	return data
}
