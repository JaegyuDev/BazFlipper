# vars
$outputDir = "./build/"
$iconPath = "./assets/icons"
$appName = "BazFlipper"
$buildVersion = "0.2.0"

# cleanup old builds
if (Test-Path "./build" -PathType Container) {
    Remove-Item -LiteralPath $outputDir -Force -Recurse
}


# build
electron-packager . $appName --platform=win32 --arch=x64 --build-version=$buildVersion --out=$outputDir --icon=$iconPath/icon.ico
electron-packager . $appName --platform=linux --arch=x64 --out=$outputDir --icon=$iconPath/icon.png 
