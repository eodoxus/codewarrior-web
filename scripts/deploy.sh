#!/bin/bash
source .env.local

echo "Pushing to git..."
git push
yarn build
echo "Creating tarball..."
tar cf public.tgz -C $REACT_APP_BUILD_DESTINATION .
echo "Deploying to remote..."
scp public.tgz www-data@jaygordo.com:$REACT_APP_SERVER_PATH
ssh www-data@jaygordo.com "\
  cd $REACT_APP_SERVER_PATH \
  && rm -rf public \
  && tar -xf public.tgz \
  && rm -f public.tgz \
  && cp index.html ./page-codewarrior.tpl.php"
rm -f public.tgz
echo "Clearing cache..."
curl -Is http://jaygordo.com/clearcache | head -1
