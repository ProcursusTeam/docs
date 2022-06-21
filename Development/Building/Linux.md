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
sudo apt install -y build-essential clang llvm make coreutils findutils sed tar patch bash openssl gnupg libtool automake bison flex groff fakeroot dpkg zstd libncurses6 wget cmake docbook-xsl python3 git pkg-config autopoint po4a unzip triehash meson ninja-build curl llvm-dev uuid-dev
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

#### Installing libtapi

```bash
export TAPI_VERSION=1100.0.11
wget -O libtapi.tar.gz https://github.com/tpoechtrager/apple-libtapi/archive/refs/heads/${TAPI_VERSION}.tar.gz
tar xf libtapi.tar.gz
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

### Installing xar

```bash
git clone https://github.com/tpoechtrager/xar.git
pushd xar/xar
  ./configure --prefix=${PREFIX}
  make -j$(nproc)
  make -j$(nproc) install
popd
```

### Installing libdispatch

```
export SWIFT_VERSION=5.5
wget -O libdispatch.tar.gz https://github.com/apple/swift-corelibs-libdispatch/archive/refs/tags/swift-${SWIFT_VERSION}-RELEASE.tar.gz
mkdir swift-corelibs-libdispatch-swift-${SWIFT_VERSION}-RELEASE/build
pushd swift-corelibs-libdispatch-swift-${SWIFT_VERSION}-RELEASE/build
  cmake \
    -DCMAKE_INSTALL_PREFIX=${PREFIX} \
    ..
  make -j$(nproc)
  make install -j$(nproc)
```

### Installing cctools

```bash
# Building cctools
git clone https://github.com/tpoechtrager/cctools-port.git
cd cctools-port/cctools
sed -i 's/add_execute_list_with_prefix("ranlib");/add_execute_list_with_prefix("cctools-ranlib");/' ar/ar.c
./configure \
  --prefix=${PREFIX} \
  --with-llvm-config=$(command -v llvm-config) \
  --enable-lto-support \
  --enable-xar-support \
  --enable-tapi-support \
  --program-prefix=cctools- \
  CFLAGS="-I${PREFIX}/include" \
  LDFLAGS="-L${PREFIX}/lib"
make -j$(nproc)
make -j$(nproc) install

```

### Installing the clang wrapper

```bash
wget -P /tmp https://github.com/ProcursusTeam/Procursus/raw/main/build_tools/wrapper.c

mkdir -p ${PREFIX}/bin

cc -O3 -Wall -Wextra -Wno-address -Wno-incompatible-pointer-types -pedantic \
  /tmp/wrapper.c \
  -o ${PREFIX}/bin/clang-wrapper

ln -s ${PREFIX}/bin/clang-wrapper ${PREFIX}/bin/x86_64-apple-darwin-clang
ln -s ${PREFIX}/bin/clang-wrapper ${PREFIX}/bin/aarch64-apple-darwin-clang
ln -s ${PREFIX}/bin/clang-wrapper ${PREFIX}/bin/x86_64-apple-darwin-clang++
ln -s ${PREFIX}/bin/clang-wrapper ${PREFIX}/bin/aarch64-apple-darwin-clang++

rm /tmp/wrapper.c
```

### Installing symbolic links for cctools

```bash
export CCTOOLS_TOOLS='segedit dyldinfo strings vtool strip ld nm redo_prebinding machocheck mtoc inout as unwinddump makerelocs ar size ctf_insert codesign_allocate otool pagestuff cmpdylib lipo ranlib mtor ObjectDump checksyms libtool seg_addr_table install_name_tool bitcode_strip seg_hack nmedit check_dylib'
for tool in ${CCTOOLS_TOOLS}; do
  for arch in x86_64 aarch64; do
    ln -s ${PREFIX}/bin/cctools-${tool} ${PREFIX}/bin/${arch}-apple-darwin-${tool}
  done
done
```

### Installing ldid

```bash
export LDID_VERSION=2.1.5-procursus2
wget -O ldid-${LDID_VERSION}.tar.gz https://github.com/ProcursusTeam/ldid/archive/refs/tags/v2.1.5-${LDID_VERSION}.tar.gz
tar -xf ldid-${LDID_VERSION}.tar.gz
cd ldid-${LDID_VERSION}
make -j$(nproc) ldid
make -j$(nproc) install
```

## Building Procursus

<!-- LTO seems to be broken on Linux...
# Enable link-time optimization
export MEMO_FORCE_LTO=1
export MEMO_ALT_LTO_LIB=/usr/lib/libLTO.so
-->

```bash
# Add our toolchain to the path.
# You can add this to your `.bash_profile` or the equivalent that your shell uses.
export PATH=${PREFIX}/bin:${PATH}
git clone https://github.com/ProcursusTeam/Procursus.git
cd Procursus
make MEMO_TARGET=iphoneos-arm64 bash-package
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
