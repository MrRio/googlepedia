#!/bin/bash

APP_NAME=googlepedia    # short-name, jar and xpi files name.
BUILT_FOR=fx         # Application that the extension is built for, e.g. 'fx' for firefox
VERSION=0.5.6        # Application version number

rm *.xpi
zip -vr $APP_NAME-$VERSION-$BUILT_FOR.xpi * -x@exclude.lst