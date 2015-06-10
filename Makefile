PATH  := node_modules/.bin:$(PATH)
SHELL := /bin/bash

.PHONY: build clean test

build: build/merus.js build/merus.min.js

clean:
	rm -rf build

build/merus.js: lib
	mkdir -p $(dir $@)
	browserify $< -o $@ -s Merus

build/merus.min.js: build/merus.js
	uglifyjs $< > $@

test:
	mocha
