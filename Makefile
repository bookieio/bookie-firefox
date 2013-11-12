WD:=$(shell pwd)

SDKURL = https://ftp.mozilla.org/pub/mozilla.org/labs/jetpack/jetpack-sdk-latest.zip

.PHONY: all
all: sdk

.PHONY: clean
clean: clean_sdk


sdk: sdk/bin/activate
sdk/bin/activate:
	wget $(SDKURL) -O /tmp/sdk.zip
	unzip /tmp/sdk.zip -d $(WD)/sdk
	cd sdk/addon-* && mv * ../ && cd ../ && rm -r addon-*

.PHONY: clean_sdk
clean_sdk:
	rm -rf sdk/

.PHONY: test
test: sdk
	cd src && cfx test && cd ../

.PHONY: run
run: sdk
	cd src && cfx run && cd ../

.PHONY: build
build: sdk
	cd src && cfx xpi && mv bookie.xpi ../ && cd ../

.PHONY: upload
upload: build
	s3cp.py --bucket files.bmark.us --public bookie.xpi
