WD:=$(shell pwd)

SDKURL = https://ftp.mozilla.org/pub/mozilla.org/labs/jetpack/jetpack-sdk-latest.zip
BOOKIELIB = http://files.bmark.us/bookie_static.tar.gz

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
