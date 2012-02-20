WD:=$(shell pwd)

SDKURL = https://ftp.mozilla.org/pub/mozilla.org/labs/jetpack/jetpack-sdk-latest.zip

.PHONY: install_sdk
install_sdk: clean_sdk
	wget $(SDKURL) -O /tmp/sdk.zip
	unzip /tmp/sdk.zip -d $(WD)/sdk
	cd sdk/addon-* && mv * ../ && cd ../ && rm -r addon-*

.PHONE: clean_sdk
clean_sdk:
	rm -rf sdk/*
