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

// BlockchainIterator holds a sequence of blocks. The BlockchainIterator
// is short lived. It will be created each time we want to iterate over
// blocks in a blockchain.
type BlockchainIterator struct {
	currentHash []byte
	db          *bolt.DB
}

// Iterator initializes an iterator that will iterate over the blockchain
// from newest to oldest.
func (blockchain *Blockchain) Iterator() *BlockchainIterator {
	blockchainIterator := &BlockchainIterator{blockchain.tip, blockchain.db}
	return blockchainIterator
}

// AddBlock appends a new block to the blockchain.
func (blockchain *Blockchain) AddBlock(data string) {

	// Look up last hash
	var lastHash []byte
	err := blockchain.db.View(func(tx *bolt.Tx) error {
		bucket := tx.Bucket([]byte(blocksBucket))
		lastHash = bucket.Get([]byte("l"))
		return nil
	})

	// Use the last hash to mine a new block
	newBlock := NewBlock(data, lastHash)

	// Update the database with last hash and tip
	err = blockchain.db.Update(func(tx *bolt.Tx) error {
		// Connect to the bucket in the database
		bucket := tx.Bucket([]byte(blocksBucket))
		err = bucket.Put(newBlock.Hash, newBlock.Serialize())

		// Update the last hash
		err = bucket.Put([]byte("l"), newBlock.Hash)

		// Update the newest hash (the tip)
		blockchain.tip = newBlock.Hash

		return nil
	})
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

// Next return the next block in the blockchain
func (iterator *BlockchainIterator) Next() *Block {
	var block *Block

	err := iterator.db.View(func(tx *bolt.Tx) error {
		bucket := tx.Bucket([]byte(blocksBucket))
		encodedBock := bucket.Get(iterator.currentHash)
		block = DeserializeBlock(encodedBock)

		return nil
	})

	iterator.currentHash = block.PrevBlockHash

	return block
}
