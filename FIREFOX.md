*This file is for Firefox Employees that are reviewing the extension's source code*

## Welcome

Hello, welcome to the source code of my extension. The extension is built with webpack so I must provide the source code for you. 

## Project Structure

* src: Typescript source files
* public: static files
* dist: contains the generated extension code.
* dist/js: Contains the generated javascript files


## Prerequisites

* node + npm (node version is *v14.15.4*, npm version is *v6.14.10*)

*Running ``npm install`` will install all the packages and their correct version. I built the original source code on the ``Windows`` operating system but it should be the same in any operating system.

## Building the extension code

To build the extension, run ``npm run build`` and it will build the extension code! Make sure to run ``npm run build`` and not ``npm run watch`` because ``npm run build`` will build it for production while ``npm run watch`` will build for development.
