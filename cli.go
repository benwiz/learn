package main

import (
	"flag"
	"fmt"
	"log"
	"os"
	"strconv"
)

// CLI responsible for processing command line arguments
type CLI struct{}

// createBlockchain creates a new blockchain noting the address of the genesis block's miner
func (cli *CLI) createBlockchain(address string) {
	bc := CreateBlockchain(address)
	bc.db.Close()
	fmt.Println("Done creating blockchain!")
}

// getBalance prints the balance of the given address
func (cli *CLI) getBalance(address string) {
	bc := NewBlockchain(address)
	defer db.db.Close() // remember, `defer` means "run after the function ends"

	balance := 0
	UTXOs := bc.FindUTXO(address)

	for _, out := range UTXOs {
		balance += out.Value
	}
	fmt.Printf("Balance of '%s': %d\n", address, balance)
}

// printUsage prints how to use the cli
func (cli *CLI) printUsage() {
	fmt.Println("Usage:")
	fmt.Println("  getbalance -address ADDRESS\t\tGet balance of ADDRESS")
	fmt.Println("  createblockchain -address ADDRESS\t\tCreate a blockchain and send genesis block reward to ADDRESS")
	fmt.Println("  printchain\t\tPrint all the blocks of the blockchain")
	fmt.Println("  send -from FROM -to TO -amount AMOUNT\t\tSend AMOUNT of coins from FROM address to TO")
}

// validateArgs checks that at least two arguments were given
func (cli *CLI) validateArgs() {
	if len(os.Args) < 2 {
		cli.printUsage()
		os.Exit(1)
	}
}

// printChain prints the details of each block in the blockchain from newest to oldest
func (cli *CLI) printChain() {
	// NOTE: In the tutorial's code, this line was marked with `// TODO: Fix this`
	bc := NewBlockchain("")
	defer bc.db.Close()

	blockchainIterator := bc.Iterator()
	for {
		block := blockchainIterator.Next()

		fmt.Printf("Prev. hash: %x\n", block.PrevBlockHash)
		fmt.Printf("Hash: %x\n", block.Hash)
		proofOfWork := NewProofOfWork(block)
		fmt.Printf("PoW: %s\n", strconv.FormatBool(proofOfWork.Validate()))
		fmt.Println()

		if len(block.PrevBlockHash) == 0 {
			break
		}
	}
}

// Run parses command line arguments and processes the commands
func (cli *CLI) Run() {
	cli.validateArgs()

	// Create the cli commands
	getBalanceCmd := flag.NewFlagSet("getbalance", flag.ExitOnError)
	createBlockchainCmd := flag.NewFlagSet("createblockchain", flag.ExitOnError)
	sendCmd := flag.NewFlagSet("send", flag.ExitOnError)
	printChainCmd := flag.NewFlagSet("printchain", flag.ExitOnError)

	// Get the addresses of the commands
	getBalanceAddress := getBalanceCmd.String("address", "", "The address for which to get the balance.")
	createBlockchainAddress := createBlockchainCmd.String("address", "", "The address to which the genesis block reward should be sent.")
	sendFrom := sendCmd.String("from", "", "Source wallet address.")
	sendTo := sendCmd.String("to", "", "Destination wallet address.")
	sendAmount := sendCmd.Int("amount", 0, "Amount to send.")

	// Trigger the commands
	switch os.Args[1] {
	case "getbalance":
		err := getBalanceCmd.Parse(os.Args[2:])
		if err != nil {
			log.Panic(err)
		}
	case "createblockchain":
		err := createBlockchainCmd.Parse(os.Args[2:])
		if err != nil {
			log.Panic(err)
		}
	case "printchain":
		err := printChainCmd.Parse(os.Args[2:])
		if err != nil {
			log.Panic(err)
		}
	case "send":
		err := sendCmd.Parse(os.Args[2:])
		if err != nil {
			log.Panic(err)
		}
	default:
		cli.printUsage()
		os.Exit(1)
	}

	if getBalanceCmd.Parsed() {
		if *getBalanceAddress == "" {
			getBalanceAddress.Usage()
			os.Exit(1)
		}
		cli.getBalance(*getBalanceAddress)
	}

	if createBlockchainCmd.Parsed() {
		if *createBlockchainAddress == "" {
			createBlockchainAddress.Usage()
			os.Exit(1)
		}
		cli.createBlockchain(*createBlockchainAddress)
	}

	if printChainCmd.Parsed() {
		cli.printChain()
	}

	if sendCmd.Parsed() {
		if *sendFrom == "" || *sendTo == "" || *sendAmount <= 0 {
			sendCmd.Usage()
			os.Exit()
		}
		cli.send(*sendFrom, *sendTo, *sendAmount)
	}
}
