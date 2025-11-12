@echo off
git describe --tags>%TEMP%/version
set /P REACT_APP_RELEASE_NAME=<%TEMP%/version
set /P REACT_APP_RELEASE_TAG=<%TEMP%/version
set REACT_APP_RELEASE_NAME
set REACT_APP_RELEASE_TAG
set GENERATE_SOURCEMAP
react-app-rewired %*