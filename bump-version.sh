#!/bin/sh
# 修改 index.html 或 .js 之後執行：更新版本號，手機上的網頁（含主畫面捷徑）會自動抓新版
cd "$(dirname "$0")"
v=$(date +%Y%m%d%H%M)
sed -i "s/const APP_VERSION = '[^']*';/const APP_VERSION = '$v';/" index.html
sed -i -E "s/(verbs|weekly|roman)\.js(\?v=[0-9]+)?\"/\1.js?v=$v\"/g" index.html
echo "$v" > version.txt
echo "version $v"
