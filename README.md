#Real-time earth wallpaper

Built on Electron.io and can be "compiled" for:
* Linux
* Mac
* Windows

Get's images from Himawari 8 satellite web-site.

#npm install

build:

``

//mac

electron-packager . EarthBg --platform=darwin --arch=x64 --version=0.36.7 --symlinks --overwrite --icon=assets/ui/img/icon.icns --app-bundle-id=com.hortopan.earthBg --app-version="1.0.0" --app-category-type=public.app-category.photography

//windows

electron-packager . EarthBg --platform=win32 --arch=x64 --version=0.36.7 --symlinks --overwrite --icon=assets/ui/img/icon.png --app-bundle-id=com.hortopan.earthBg. --out=/Users/hortopan/Desktop/BB --app-version="1.0.0"

``
