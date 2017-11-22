# blockchain-in-go

Learn more about blockchains while gaining experience learning Go. Following a tutorial on [jeiwan.cc](https://jeiwan.cc/posts/building-blockchain-in-go-part-4/).

Currently at the line `Let’s check that everything is correct so far` where we try to build and test. It is not building becuase cli.go (and maybe more) is not completely up to date yet.

## To Do

- Pt. 5
- Pt. 6
- Pt. 7

- Find a boltDB browser and look at the database itself

## Questions

- What does Go's `make` do?
- The block_chain_ is starting to seem more like a block_tree_. Is this a correct view?
- What are the differences between `blockchain.NewBlockchain()` and `blockchain.CreateBlockchain()`? Actually, why do we have a special `CreateBlockchain` when `NewBlockchain` seems sufficient?
- What's the value in boltDB? (this is a separate question from blockchains stuff)

## Notes

### Lesson 5

Let’s now review the full lifecycle of a transaction:

1. In the beginning, there’s the genesis block that contains a coinbase transaction. There are no real inputs in coinbase transactions, so signing is not necessary. The output of the coinbase transaction contains a hashed public key (RIPEMD16(SHA256(PubKey)) algorithms are used).
2. When one sends coins, a transaction is created. Inputs of the transaction will reference outputs from previous transaction(s). Every input will store a public key (not hashed) and a signature of the whole transaction.
3. Other nodes in the Bitcoin network that receive the transaction will verify it. Besides other things, they will check that: the hash of the public key in an input matches the hash of the referenced output (this ensures that the sender spends only coins belonging to them); the signature is correct (this ensures that the transaction is created by the real owner of the coins).
4. When a miner node is ready to mine a new block, it’ll put the transaction in a block and start mining it.
5. When the blocked is mined, every other node in the network receives a message saying the block is mined and adds the block to the blockchain.
6. After a block is added to the blockchain, the transaction is completed, its outputs can be referenced in new transactions.
