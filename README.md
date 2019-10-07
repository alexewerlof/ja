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
URL > LOCAL_FILE_PATH
```

Commit all your changes before running `ja` because it'll overwrite the local files.
Then run `ja`. It'll fetch the files from those URLs and rewrites the local file path.

# License

MIT

_Made in Sweden 🇸🇪 by [@alexewerlof](https://mobile.twitter.com/alexewerlof)_