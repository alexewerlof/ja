# Introduction

This is a very simple but useful CLI utility to fetch files from github into the current folder.

_Currently it is in beta_

## Install

```
$ npm i -g ja
```

## Usage

Create a `.jarc` file in the root of your project in this format: 

```
# Comments
URL1 > LOCAL_FILE_PATH_1
URL2 > LOCAL_FILE_PATH_2
```

Example:

```
# This is just a test
https://github.com/userpixel/micromustache/blob/master/.gitignore > .gitignore

https://github.com/userpixel/pk/blob/master/package.json > packages/package.json
```

* Each line simply contains a URL and a local file name.
* The local file name can contain a path.
* The local file name path is relative to the current directory where the `.ja` file is located.
* For security reasons no absolute path is allowed.
* For security reasons the local file name *cannot* point to any directory that is the parent of the directory where the `.ja` file is located.
* Empty lines and lines beginning with `#` will be ignored.

**Commit all your changes before running `ja` because it'll overwrite the local files.**

Then simply run

```
$ ja
```

It'll first fetch all the files from those URLs and then rewrites them to local file paths.

* If the fetch step fails, it will not write any files.
* If the local folder doesn't exist it creates it.
* If the file doesn't exist it creates it.
* If the file already exists, it rewrites it. Any file permission will not be changed.
* It writes in utf-8 format
* It won't do anything if it cannot find a `.ja` file in the local directory.

# License

MIT

_Made in Sweden 🇸🇪 by [@alexewerlof](https://mobile.twitter.com/alexewerlof)_