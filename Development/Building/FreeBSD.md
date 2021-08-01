# Building on FreeBSD

<!-- Building on FreeBSD, much like Linux support, is made possible with [cctools-port](https://github.com/tpoechtrager/cctools-port). To setup Procursus on FreeBSD -->

## Install dependencies

```sh
sudo pkg autoconf automake bash cmake coreutils docbook-xsl dpkg fakeroot findutils gettext git gmake gnugrep gnupg gsed gtar libtool ncurses openssl patch perl5 pkgconf po4a python39 wget zstd
```

You'll also need to install `triehash`

```sh
wget -O triehash https://raw.githubusercontent.com/julian-klode/triehash/main/triehash.pl
gsed -i 's|#!/usr/bin/perl -w|#!/usr/bin/env perl -w|g' triehash
sudo mv triehash /usr/local/bin
```

## Install toolchain

### Automatic install

[This script](https://gist.github.com/asdfugil/71cdfca5aa1bc0d59de06518cd1c530c) will setup your SDKs, cctools-port with your iOS toolchain, and other dependencies needed.

To run the script

```sh
bash procursus-utils-fbsd.sh
```

It's recommended that you add this script to your shells' config file, so that it's sourced on every login.

```sh
echo "source procursus-utils-fbsd.sh" > ~/.profile
```

Then, reload your shell or reload your shells' config file.

```sh
. procursus-utils-fbsd.sh
```

## Manual install

If you want to install the toolchain manually for whatever reason,

Export the location where you want to install the toolchain.

```bash
export PREFIX=${HOME}/.local
# or
# export PREFIX=/usr/local
```

Then, create a directory of GNU binaries

```bash
mkdir -p ${GNUBINDIR}
COREUTILS='basename cat chgrp chmod chown chroot cksum comm cp csplit cut date dd df dir dircolors dirname du echo env expand expr factor false fmt fold groups head hostid hostname id install join kill link ln logname ls md5sum mkdir mkfifo mknod mv nice nl nohup od paste pathchk pinky pr printenv printf ptx pwd readlink rm rmdir seq sha1sum shred sleep sort split stat stty su sum sync tac tail tee test touch tr true tsort tty uname unexpand uniq unlink uptime users vdir wc who whoami yes'
OTHER_GNU_BINS='make tar sed patch find'
export GNUBINDIR="${PREFIX}/libexec/gnubin"
for util in $COREUTILS $OTHER_GNU_BINS; do
        ln -sfn /usr/local/bin/g$util "${GNUBINDIR}/${util}" 
done
ln -sfn /usr/local/bin/grep "${GNUBINDIR}/grep"
```

Temporarily add it to PATH

```bash
export PATH="${GNUBINDIR}"
```

### Install libtapi

```bash
export TAPI_VERSION=1100.0.11
wget -O libtapi.tar.gz https://github.com/tpoechtrager/apple-libtapi/archive/refs/heads/${TAPI_VERSION}.tar.gz
tar -xf ${TAPI_VERSION}.tar.gz
mkdir -p apple-libtapi-${TAPI_VERSION}/build
pushd apple-libtapi-${TAPI_VERSION}/build
  TAPI_INCLUDE_FIX="-I $PWD/../src/llvm/projects/clang/include "
  TAPI_INCLUDE_FIX+="-I $PWD/projects/clang/include "

  cmake ../src/llvm \
    -DCMAKE_CXX_FLAGS="${TAPI_INCLUDE_FIX}" \
    -DCMAKE_BUILD_TYPE=Release \
    -DCMAKE_INSTALL_PREFIX=${PREFIX} \
    -DTAPI_FULL_VERSION="${TAPI_VERSION}" \
    -DLLVM_ENABLE_PROJECTS="libtapi" \
    -DTAPI_INCLUDE_TESTS=OFF \
    -DLLVM_INCLUDE_TESTS=OFF

  make -j$(nproc) clangBasic libtapi
  make -j$(nproc) install-libtapi install-tapi-headers
popd
```

### Installing cctools

```bash
git clone https://github.com/tpoechtrager/cctools-port.git
cd cctools-port/cctools
# Build for arm64
./configure \
  --prefix=${PREFIX} \
  --with-libtapi=${PREFIX} \
  --target=aarch64-apple-darwin
make -j$(nproc)
make install
make clean

# Build for x86_64
./configure \
  --prefix=${PREFIX} \
  --with-libtapi=${PREFIX} \
  --target=x86_64-apple-darwin
make -j$(nproc)
make install
make clean
```

### Installing the clang wrapper

```bash
wget -P /tmp https://github.com/ProcursusTeam/Procursus/raw/main/build_tools/wrapper.c

mkdir -p ${PREFIX}/bin

cc -O2 -Wall -Wextra -Wno-address -Wno-incompatible-pointer-types -pedantic \
  /tmp/wrapper.c \
  -o ${PREFIX}/bin/aarch64-apple-darwin

ln -f ${PREFIX}/bin/aarch64-apple-darwin ${PREFIX}/bin/x86_64-apple-darwin

rm /tmp/wrapper.c
```

### Installing ldid

```bash
git clone git://git.saurik.com/ldid.git
cd ldid
git submodule update --init
c++ -O3 -g0 -c -std=c++11 -o ldid.o ldid.cpp
c++ -O3 -g0 -o ldid ldid.o -x c lookup2.c -lxml2 -lcrypto -lplist-2.0
mv -f ./ldid ${PREFIX}/bin/ldid
chmod +x ${PREFIX}/bin/ldid
```

### Get the SDKs

```bash
mkdir -p ~/cctools/{SDK,MacOSX-SDKs,iOS-SDKs}
git clone https://github.com/xybp888/iOS-SDKs ~/cctools/iOS-SDKs
# Theae SDKs already includes C++ headers and symbols for Private Frameworks, so you can use them as-is.
# You might want to use a newer SDK here
ln -s ~/cctools/iOS-SDKs/iPhoneOS14.5.sdk ~/cctools/SDK/iPhoneOS.sdk
# You also need macOS SDKs
git clone https://github.com/phracker/MacOSX-SDKs ~/cctools/MacOSX-SDKs
ln -s ~/cctools/MacOSX-SDKs/MacOSX11.3.sdk ~/cctools/SDK/MacOSX.sdk 
```

# Building Procursus

Clone the Procursus repository

```sh
git clone --recursive https://github.com/ProcursusTeam/Procursus.git
```

Next, you should remove `${GNUBINDIR}` from your PATH because many things in FreeBSD do not expect GNU binaries

The easiest way is to restart your shell.

```bash
# Add our toolchain to the path.
# You should add this to your `.bash_profile` or the equivalent that your shell uses.
export PATH=${PREFIX}/bin:${PATH}
# This tells the Procursus makefile where to find the GNU binaries
export GNUBINDIR="${PREFIX}/libexec/gnubin"
```

You might want to restart your shell again to make sure everything went right.

Then, try to build bash

```bash
    cd Prpcursus
    gmake bash-package
```

Then... well technically you are done. However, there are a few things that might find useful.

## Extras

### Building Go Packages

Currently unsupported.

### Building Rust Packages

If you want to build Rust packages, you'll need to install rustup and install the following targets

Installing rustup

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# iOS arm64
rustup target add aarch64-apple-ios

# macOS arm64
rustup target add aarch64-apple-darwin

# macOS x86_64
rustup target add x86_64-apple-darwin

# Tell rust to use our toolchain
cat <<EOF >>${HOME}/.cargo/config
[target.x86_64-apple-darwin]
linker = "x86_64-apple-darwin-clang"
ar = "x86_64-apple-darwin-ar"

                                                                                        [target.aarch64-apple-darwin]
linker = "aarch64-apple-darwin-clang"
ar = "aarch64-apple-darwin-ar"

[target.aarch64-apple-ios]
linker = "aarch64-apple-darwin-clang"
ar = "aarch64-apple-darwin-ar"

[build]
rustflags = ["-C", "link-args=-shared"]
EOF
```
