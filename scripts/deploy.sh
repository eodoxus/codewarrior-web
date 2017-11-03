#!/bin/bash
source .env.local

echo "Pushing to git..."
git push
yarn build
echo "Creating tarball..."
tar cf deploy.tgz -C $REACT_APP_BUILD_DESTINATION .
echo "Deploying to remote..."
scp deploy.tgz $REACT_APP_DEPLOY_USER@$REACT_APP_REMOTE_HOST:$REACT_APP_SERVER_PATH
ssh $REACT_APP_DEPLOY_USER@$REACT_APP_REMOTE_HOST "\
  cd $REACT_APP_SERVER_PATH \
  && tar -xf deploy.tgz \
  && rm -f deploy.tgz \
  && cp index.html ./page-codewarrior.tpl.php"
rm -f deploy.tgz
echo "Clearing cache..."
curl -Is http://$REACT_APP_REMOTE_HOST/clearcache | head -1
