package main

import (
	"fmt"
	"strconv"
)

func main() {
	blockchain := NewBlockchain()

	blockchain.AddBlock("Send 1 BTC to Data Dave")
	blockchain.AddBlock("Send 2 BTC to Marg")

	for _, block := range blockchain.blocks {
		fmt.Printf("Prev. hash: %x\n", block.PrevBlockHash)
		fmt.Printf("Data: %s\n", block.Data)
		fmt.Printf("Hash: %x\n", block.Hash)
		fmt.Println()

		ProofOfWork := NewProofOfWork(block)
		fmt.Printf("ProofOfWork: %s\n", strconv.FormatBool(ProofOfWork.Validate()))
		fmt.Println()
	}
}
