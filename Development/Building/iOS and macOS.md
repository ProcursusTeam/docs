# Building on iOS and macOS

## Install dependencies

We only support using Procursus for building packages, so you need [one of these jailbreaks](../../../Installation/iOS.md) (iOS) or follow the [installation guide](../../../Installation/macOS.md) (macOS). Once you have a Procursus-enabled jailbreak or a Mac with Procursus installed, run the following to get the dependencies.

```bash
sudo apt install autoconf automake autopoint bash bison cmake docbook-xml docbook-xsl fakeroot findutils flex gawk git gnupg groff gzip ldid libtool make ncurses-bin openssl patch pkg-config po4a python3 sed tar triehash wget xz-utils zstd
```

Additionally on iOS, you will need three more dependencies:

```bash
sudo apt install clang dsymutil odcctools
```

## Clone

```bash
git clone https://github.com/ProcursusTeam/Procursus.git
```

## Build

```bash
make bash
make bash-package
```
