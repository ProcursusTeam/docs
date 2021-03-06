# Building on iOS and macOS

## Install dependencies

### iOS

We only support using Procursus for building packages, so you need [one of these jailbreaks](../../../Installation/iOS.md). Once you have a Procursus-enabled jailbreak, run the following to get the dependencies.

```bash
sudo apt install clang dsymutil odcctools text-cmds autoconf automake autopoint bash bison cmake docbook-xml docbook-xsl fakeroot findutils flex gawk git gnupg groff gzip ldid libtool make ncurses-bin openssl patch pkg-config po4a python3 sed tar triehash wget xz-utils zstd
```

### macOS

You should follow the [installation guide](../../../Installation/macOS.md). Once that's done, you can use the same dependency list:

```bash
sudo apt install autoconf automake autopoint bash bison cmake docbook-xml docbook-xsl fakeroot findutils flex gawk git gnupg groff gzip ldid libtool make ncurses-bin openssl patch pkg-config po4a python3 sed tar triehash wget xz-utils zstd
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
