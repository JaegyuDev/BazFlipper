# Define variables
$outputDir = "./build/"
$iconPath = "./assets/icons"
$appName = "BazFlipper"

# Package for Windows
electron-packager . $appName --platform=win32 --arch=x64 --out=$outputDir --icon=$iconPath/icon.ico

# Package for Linux
electron-packager . $appName --platform=linux --arch=x64 --out=$outputDir --icon=$iconPath/icon.png
