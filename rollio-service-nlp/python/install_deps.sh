#!/bin/bash

rm -rf ./python_modules
pip install --progress-bar off --no-color --upgrade pip
pip install --progress-bar off --no-color --upgrade --find-links="./local_packages" --target=./python_modules/ -r requirements.txt
# TODO: add the 'en_core_web_lg' file to local_packages