# Building on FreeBSD

Building on FreeBSD, much like Linux support, is made possible with [cctools-port](https://github.com/tpoechtrager/cctools-port). To setup Procursus on FreeBSD

## Install dependencies

You can install dependencies with ``pkg``

```
sudo pkg autoconf automake bash cmake coreutils docbook-xsl dpkg fakeroot findutils gettext git gmake gnugrep gnupg gsed gtar libtool ncurses openssl patch perl5 pkgconf po4a python39 wget zstd
```

You'll also need to install ``triehash``

```
wget -O triehash https://raw.githubusercontent.com/julian-klode/triehash/main/triehash.pl
gsed -i 's@#!/usr/bin/perl -w@#!/usr/bin/env perl -w@g' triehash
sudo mv triehash /usr/local/bin
```

## Installing the toolchain

[This script](https://gist.github.com/asdfugil/71cdfca5aa1bc0d59de06518cd1c530c) will setup your SDKs, cctools-port with your iOS toolchain, and other dependencies needed.

To run the script

```
bash procursus-utils-fbsd.sh
```

It's recommended that you add this script to your shells' config file, so that it's sourced on every environment on login.

```
echo "source procursus-utils-fbsd.sh" > .profile
```

Then, reload your shell or reload your shells' config file.

```
source procursus-utils-fbsd.sh
```

## Building Procursus

Now, you just need to grab Procursus itself...

```
git clone --recursive https://github.com/ProcursusTeam/Procursus.git
```

To check whether you did everything correctly, attempt to build ``bash``. Checkout the ["Build options"](https://github.com/ProcursusTeam/Procursus/wiki/Build-options) page to see what valid options can be passed

```
make bash [OPTIONS]
```

If the build is successful, congrats! You should now be able to compile packages from Procursus. Take note that because you're not using macOS, it's likely that some packages (particularly those that need Go, Python, and/or NodeJS) will fail to compile. You will need a macOS enabled computer to compile those.
