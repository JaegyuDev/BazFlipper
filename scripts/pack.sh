#!/bin/bash

# build vars
outputDir="./build/"
iconPath="./assets/icons"
appName="BazFlipper"
buildVersion="0.2.0"

if [ -d "/path/to/directory" ]; then
    rm -rf $outputDir
else

# build
electron-packager . "$appName" --build-version="$buildVersion" --platform=win32 \
    --arch=x64 --out="$outputDir" --icon="$iconPath/icon.ico"

electron-packager . "$appName" --build-version="$buildVersion" --platform=linux \
    --arch=x64 --out="$outputDir" --icon="$iconPath/icon.png"
