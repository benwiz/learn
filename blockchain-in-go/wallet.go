package main

import (
	"crypto/ecdsa"
	"golang.org/x/crypto/ripemd160"
)

const version = byte(0x00)
const walletFile = "wallet.dat"
const addressChecksumLen = 4

// Wallet stores private and public keys
type Wallet struct {
	PrivateKey ecdsa.PrivateKey
	PublicKey  []byte


// Wallets stores a collection of wallet structs
type Wallets struct {
	Wallets map[string]*Wallet
}

// NewWallet creates and returns a new wallet
func NewWallet() *Wallet {
	private, public := newKeyPair()
	wallet := Wallet{
		PrivateKey: private,
		PublicKey: public,
	}

	return &wallet
}


// newKeyPair generates a new private and public key using a random seed
func newKeyPair() (ecdsa.PrivateKey, []byte) {
	curve := elliptic.P256()
	private, err := ecdsa.GenerateKey(curve, rand.Reader)
	pubKey := append(private.PublicKey.X.Bytes(), private.PublicKey.Y.Bytes()...)

	return *private, pubKey
}

// GetAddress returns the wallets address (version + hashed public key)
func (wallet Wallet) GetAddress() []byte {
	// 1. Take the public key and hash it twice with RIPEMD160(SHA256(PubKey)) hashing algorithms.
	pubKeyHash := HashPubKey(wallet.PublicKey)

	// 2. Prepend the version of the address generation algorithm to the hash.
	versionedPayload := append([]byte{version}, pubKeyHash...)

	// 3. Calculate the checksum by hashing the result of step 2 with SHA256(SHA256(payload)) . The checksum is the first four bytes of the resulted hash. 4. Append the checksum to the version+PubKeyHash combination.
	checksum := checksum(versionedPayload)

	// 4. Append the checksum to the version+PubKeyHash combination.
	fullPayload := append(versionedPayload, checksum...)

	// 5. Encode the version+PubKeyHash+checksum combination with Base58.
	address := Base58Encode(fullPayload)

	return address
}

// HashPubKey hashes the public key twice using RIPEMD160 and SHA256 algorithms.
func HashPubKey(pubKey []byte) []byte {
	// First, create a SHA256 hash
	publicSHA256 := sha256.Sum256(pubKey)

	// Second, create a RIPEMD160 hash of the first hash
	RIPEMD160Hasher := ripemd160.New()
	_, err := RIPEMD160Hasher.Write(publicSHA256[:])
	publicRIPEMD160 := RIPEMD160Hasher.Sum(nil)

	return publicRIPEMD160
}

// checksum takes a SHA256 hash and takes the first `addressChecksumLen` (4) bytes
func checksum(payload []byte) []byte {
	firstSHA := sha256.Sum256(payload)
	secondSHA := sha256.Sum256(firstSHA[:])

	return secondSHA[:addressChecksumLen]
}
