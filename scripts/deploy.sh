#!/bin/bash

cd /var/www/jaygordo.com/sites/all/modules/custom/codewarrior/react-app
git reset --hard HEAD
git pull
yarn install
yarn build
