# Introduction

This is a very simple CLI utility to fetch files from Github into the current folder/repository.

Think about it as `curl` for Github.

* Lightweight
* Supports private repos and Github Enterprise
* Secure
* Descriptive error messages

### Use case

In our organization we have multiple js repos but some files need to be manually synced between them like: `.eslintrc`, `commit-message-validator.js`, etc.
We could use github submodules or any of the other fancy mechanisms, but copy/paste have been the king.
This little CLI allows us to set a source repo and copy the files in any other repository. It's not perfect, but it does the job.
Feedback is welcome.

> Bugs reproduce by copy/paste and take shelter in human errors. So if you have to copy/paste, at least automate it.

## Install

```
$ npm i -g ja
```

## Usage

Create a `.ja` file in the root of your project in this format: 

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
* Currently you need to specify each file explicitly. It's not possible to fetch a whole directory.
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

# Token

If you are trying to access Github Enterprize or a private repository, you need a token to access the API.
`ja` gets this token from the environment variable.

### Generating the token

This is a one-time process:

1. Click on your github profile and go to **Settings > Developer settings > Personal access tokens**
2. Click **Generate new token**
3. Give your token a name and for the scope, only choose **public_repo** (that's all that is needed)
4. Press the **Generate token** button and _make sure to copy your token to a safe place because it's the last time you see it (don't worry you can always go there and make a new one)_ 

### Passing the token

`ja` expects the token in an environment variable named after the host name of the source URL.
For example the token for accessing `github.com` can be stored in `GITHUB_COM_TOKEN` environment variable.
If your Github Enterprise is hosted under `github.companyname.io`, the env var is `GITHUB_COMPANYNAME_IO_TOKEN`.

There are many ways to pass an environment variable to an application:

* You can put it in an `.env` file next to your `.ja` file (the easiest option)
* You can put it in your `~/.bashrc` (Linux) or `~/.bash_profile` (Mac)
* You can pass it directly when running `ja` like this: `GITHUB_COM_TOKEN=328948kksjkafhdskjf ja`

The first method is easier because you do it once and then can run `ja` without any extra hassle.

# How does it work?

When you run `ja`, it'll look for its config file (`.ja`) in the same directory.
If it doesn't find it, it'll complain. If it finds it, it tries to parse and validate it.
For every URL it finds, it tries to figure out the "raw" address for it.
For example a URL that points to:

```
https://github.com/userpixel/ja/blob/master/README.md
```

Will be fetched from:

```
https://raw.githubusercontent.com/userpixel/ja/master/README.md
```

Then it fetches all those files and keeps them in memory.
If there was no problem fetching all those files, it goes ahead and writes them.
If you already have those files, it'll rewrite them but you can easily see the difference using `git diff`.
If the overwritten file has exactly the same content, git doesn't consider them to be changed.

# License

MIT

_Made in Sweden 🇸🇪 by [@alexewerlof](https://mobile.twitter.com/alexewerlof)_