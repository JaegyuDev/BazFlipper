#!/bin/bash

# build vars
outputDir="./build/"
iconPath="./assets/icons"
appName="BazFlipper"

# cleanup - might use taskfiles for these things instead
rm -rf $outputDir

# build
electron-packager . "$appName" --platform=win32 --arch=x64 --out="$outputDir" --icon="$iconPath/icon.ico"
electron-packager . "$appName" --platform=linux --arch=x64 --out="$outputDir" --icon="$iconPath/icon.png"
