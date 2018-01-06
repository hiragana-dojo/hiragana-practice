rm index.html
cp src/index.html index.html

curl -X POST -s --data-urlencode 'input@src/style.css' https://cssminifier.com/raw > src/style.min.css
curl -X POST -s --data-urlencode 'input@src/code.js' https://javascript-minifier.com/raw > src/code.min.js

sed -i -e "s/\/\*%CSS%\*\//$(sed 's:/:\\/:g' src/style.min.css)/" index.html
sed -i -e "s/\/\*%JS%\*\//$(sed 's:/:\\/:g' src/code.min.js)/" index.html