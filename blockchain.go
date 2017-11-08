package main

import (
	"github.com/boltdb/bolt"
)

const dbFile = "blockchain.db"
const blocksBucket = "blocks"

// Blockchain holds a sequence of blocks
type Blockchain struct {
	tip []byte
	db  *bolt.DB
}

// AddBlock appends a new block to the blockchain
func (bc *Blockchain) AddBlock(data string) {
	prevBlock := bc.blocks[len(bc.blocks)-1]
	newBlock := NewBlock(data, prevBlock.Hash)
	bc.blocks = append(bc.blocks, newBlock)
}

// NewBlockchain creates a new blockchain with a genesis block
func NewBlockchain() *Blockchain {
	var tip []byte

	// Open the BoltDB file
	db, err := bolt.Open(dbFile, 0600, nil)
	err = db.Update(func(tx *bolt.Tx) error {
		bucket := tx.Bucket([]byte(blocksBucket))

		if bucket == nil {
			genesis := NewGenesisBlock()
			bucket, err := tx.CreateBucket([]byte(blocksBucket))
			err = bucket.Put(genesis.Hash, genesis.Serialize())
			err = bucket.Put([]byte("l"), genesis.Hash)
			tip = genesis.Hash
		} else {
			tip = bucket.Get([]byte("l"))
		}

		return nil
	})

	blockchain := Blockchain{tip, db}

	return &blockchain
}
