WD:=$(shell pwd)

SDKURL = https://ftp.mozilla.org/pub/mozilla.org/labs/jetpack/jetpack-sdk-latest.zip
BOOKIELIB = http://files.bmark.us/bookie_static.tar.gz

.PHONY: all
all: sdk bookie

.PHONY: clean
clean: clean_sdk clean_bookie


sdk: sdk/bin/activate
sdk/bin/activate:
	wget $(SDKURL) -O /tmp/sdk.zip
	unzip /tmp/sdk.zip -d $(WD)/sdk
	cd sdk/addon-* && mv * ../ && cd ../ && rm -r addon-*

.PHONY: clean_sdk
clean_sdk:
	rm -rf sdk/*

bookie: src/lib/bookie
src/lib/bookie:
	wget $(BOOKIELIB) -O /tmp/bookie_static.tar.gz
	if [ ! -d $(WD)/src/lib/bookie ]; then \
		mkdir $(WD)/src/lib/bookie; \
	fi
	tar -zxf /tmp/bookie_static.tar.gz -C src/lib/bookie

.PHONY: clean_bookie
clean_bookie:
	rm -rf src/lib/bookie
