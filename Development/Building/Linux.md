# Building on Linux

## Installing dependencies

### Arch Linux

```bash
sudo pacman -S base-devel clang llvm make coreutils findutils sed tar patch bash openssl gnupg libtool automake bison flex groff fakeroot dpkg zstd ncurses wget cmake docbook-xsl python git pkg-config gettext po4a unzip triehash meson ninja curl
```

You'll also need to install [triehash](https://aur.archlinux.org/packages/triehash/) from AUR.

```bash
yay -S triehash
```

### Debian (Bullseye or later)

```bash
sudo apt update
sudo apt install -y build-essential clang llvm make coreutils findutils sed tar patch bash openssl gnupg libtool automake bison flex groff fakeroot dpkg zstd libncurses6 wget cmake docbook-xsl python3 git pkg-config autopoint po4a unzip triehash meson ninja-build curl
```

## Installing the toolchain

You can also use this script to install the toolchain.

```bash
# Uncomment and change to preferred location.
# Defaults to ${HOME}/.local
# export PREFIX=/usr/local
wget https://gist.github.com/.../install-toolchain.sh
bash install-toolchain.sh
```

### Installing the toolchain from source

Export the location where you want to install the toolchain.

```bash
export PREFIX=${HOME}/.local
# or
# export PREFIX=/usr/local
```

#### Install libtapi

```bash
export TAPI_VERSION=1100.0.11
wget -O libtapi.tar.gz https://github.com/tpoechtrager/apple-libtapi/archive/refs/heads/${TAPI_VERSION}.tar.gz
tar xf ${TAPI_VERSION}.tar.gz
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
git clone https://github.com/ProcursusTeam/ldid.git
cd ldid
make -j$(nproc)
make -j$(nproc) install
cd ..
```

## Building Procursus

```bash
# Add our toolchain to the path.
# You can add this to your `.bash_profile` or the equivalent that your shell uses.
export PATH=${PREFIX}/bin:${PATH}
git clone https://github.com/ProcursusTeam/Procursus.git
cd Procursus
make bash-package
```

## Extras

### Building Go Packages

Currently unsupported.

### Building Rust Packages

If you want to build Rust packages, you'll need to install rustup and install the following targets

Installing rustup

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# iOS
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
