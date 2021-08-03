# Building on FreeBSD

## System preparation

Mount `/proc`

```sh
sudo mount -t linprocfs none /proc
```

Add mount entry to `/etc/fstab`

```sh
sudo sh -c 'echo "none /proc linprocfs rw" >> /etc/fstab
```

## Install dependencies

Install dependencies with `pkg`.

```sh
sudo pkg install autoconf automake bash cmake coreutils docbook-xsl dpkg fakeroot findutils gettext git gmake gnugrep gnupg gsed gtar libtool libplist ncurses openssl patch perl5 pkgconf po4a python39 wget zstd
```

You'll also need to install `triehash`

```sh
wget -O triehash https://raw.githubusercontent.com/julian-klode/triehash/main/triehash.pl
gsed -i 's|#!/usr/bin/perl -w|#!/usr/bin/env perl -w|g' triehash
sudo install -m755 triehash /usr/local/bin
```

## Install toolchain

### Automatic install

[This script](https://gist.github.com/asdfugil/8d629aa1d9f5080a4c6c868b47600879) will setup your SDKs, cctools-port with your iOS toolchain, and other dependencies needed.

To run the script

```sh
wget -qO- https://gist.githubusercontent.com/asdfugil/8d629aa1d9f5080a4c6c868b47600879/raw/d845a136b5e1d447d8bd5a042199f8a309d684ab/procursus-toolchain-fbsd.sh | bash
```

Then, add the following to your shell's startup file (such as ~/.profile)

```sh
export PATH=${HOME}/.local/bin:${PATH}
export GNUBINDIR=${HOME}/.local/libexec/gnubin
```

### Manual install

If you want to install the toolchain manually for whatever reason, begin with exporting the location where you want to install the toolchain.

```bash
export PREFIX=${HOME}/.local
# or
# export PREFIX=/usr/local
```

Then, create a directory of GNU binaries

```bash
COREUTILS='basename cat chgrp chmod chown chroot cksum comm cp csplit cut date dd df dir dircolors dirname du echo env expand expr factor false fmt fold groups head hostid hostname id install join kill link ln logname ls md5sum mkdir mkfifo mknod mv nice nl nohup od paste pathchk pinky pr printenv printf ptx pwd readlink rm rmdir seq sha1sum shred sleep sort split stat stty su sum sync tac tail tee test touch tr true tsort tty uname unexpand uniq unlink uptime users vdir wc who whoami yes'
OTHER_GNU_BINS='make tar sed patch find'
export GNUBINDIR="${PREFIX}/libexec/gnubin"
mkdir -p "${GNUBINDIR}"
for util in $COREUTILS $OTHER_GNU_BINS; do
        ln -sfn /usr/local/bin/g$util "${GNUBINDIR}/${util}" 
done
ln -sfn /usr/local/bin/grep "${GNUBINDIR}/grep"
```

Temporarily add it to PATH

```bash
export PATH="${GNUBINDIR}":"${PATH}"
```

#### Install libtapi

```bash
export TAPI_VERSION=1100.0.11
wget -O /tmp/libtapi.tar.gz https://github.com/tpoechtrager/apple-libtapi/archive/refs/heads/${TAPI_VERSION}.tar.gz
tar -xf /tmp/libtapi.tar.gz
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

  make -j$(sysctl -n hw.ncpu) clangBasic libtapi
  make -j$(sysctl -n hw.ncpu) install-libtapi install-tapi-headers
popd
```

#### Installing cctools

```bash
git clone https://github.com/tpoechtrager/cctools-port.git
cd cctools-port/cctools
# Build for arm64
./configure \
  --prefix=${PREFIX} \
  --with-libtapi=${PREFIX} \
  --target=aarch64-apple-darwin
make -j$(sysctl -n hw.ncpu)
make install
make clean

# Build for x86_64
./configure \
  --prefix=${PREFIX} \
  --with-libtapi=${PREFIX} \
  --target=x86_64-apple-darwin
make -j$(sysctl -n hw.ncpu)
make install
make clean
cd ../..
```

#### Installing the clang wrapper

```bash
wget -P /tmp https://github.com/ProcursusTeam/Procursus/raw/main/build_tools/wrapper.c

mkdir -p ${PREFIX}/bin

cc -O2 -Wall -Wextra -Wno-address -Wno-incompatible-pointer-types -pedantic \
  /tmp/wrapper.c \
  -o ${PREFIX}/bin/aarch64-apple-darwin

ln -f ${PREFIX}/bin/aarch64-apple-darwin ${PREFIX}/bin/x86_64-apple-darwin

rm /tmp/wrapper.c
```

#### Installing ldid

```bash
git clone git://git.saurik.com/ldid.git
cd ldid
git submodule update --init
c++ -O3 -g0 -c -std=c++11 -I/usr/local/include -o ldid.o ldid.cpp
c++ -O3 -g0 -L/usr/local/lib -o ldid ldid.o -x c lookup2.c -lcrypto -lplist-2.0
install -m755 ./ldid ${PREFIX}/bin/ldid
cd ..
```

#### Get the SDKs

```bash
mkdir -p ~/cctools/{SDK,MacOSX-SDKs,iOS-SDKs}
git clone --depth=1 https://github.com/xybp888/iOS-SDKs ~/cctools/iOS-SDKs
# Theae SDKs already includes C++ headers and symbols for Private Frameworks, so you can use them as-is.
# You might want to use a newer SDK here
ln -s ~/cctools/iOS-SDKs/iPhoneOS14.5.sdk ~/cctools/SDK/iPhoneOS.sdk
# You also need macOS SDKs
git clone --depth=1 https://github.com/phracker/MacOSX-SDKs ~/cctools/MacOSX-SDKs
ln -s ~/cctools/MacOSX-SDKs/MacOSX11.3.sdk ~/cctools/SDK/MacOSX.sdk 
cd ~/cctools/SDK
wget -P /tmp https://cdn.discordapp.com/attachments/672628720497852459/871756626066018354/AppleTVOS.sdk.zst https://cdn.discordapp.com/attachments/672628720497852459/871756640754470933/WatchOS.sdk.zst
zstd -d /tmp/{AppleTVOS,WatchOS}.sdk.zst
rm /tmp/{AppleTVOS,WatchOS}.sdk.zst
cd ../..
```

## Building Procursus

Clone the Procursus repository

```sh
git clone --recursive https://github.com/ProcursusTeam/Procursus.git
```

Next, you should remove `${GNUBINDIR}` from your PATH because many things in FreeBSD do not expect GNU binaries

The easiest way is to restart your shell.

Then, add this to ~/.profile or the equivalent for your shell.

```bash
# Add our toolchain to the path.
export PATH=${PREFIX}/bin:${PATH}
# This tells the Procursus makefile where to find the GNU binaries
export GNUBINDIR="${PREFIX}/libexec/gnubin"
```

After that, run the above commands in your current shell or restart your shell.

Then, try to build bash

```bash
cd Procursus
gmake bash-package
```

If the build is successful, congrats! You should now be able to compile packages from Procursus. Take note that because you're not using macOS, it's likely that some packages (particularly those that need Go, Python, and/or NodeJS) will fail to compile. You will need a macOS enabled computer to compile those.

In addition, there are a few things that you might find useful.

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
