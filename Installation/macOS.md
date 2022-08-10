# Installing on macOS

```zsh
curl -LO https://cameronkatri.com/zstd
Intel: curl -L https://apt.procurs.us/bootstrap_darwin-amd64.tar.zst -o bootstrap.tar.zst
M1: curl -LO https://cdn.discordapp.com/attachments/763074782220517467/819588605999317022/bootstrap.tar.zst
chmod +x zstd
./zstd -d bootstrap.tar.zst
sudo tar -xpkf bootstrap.tar -C /
printf 'export PATH="/opt/procursus/bin:/opt/procursus/sbin:/opt/procursus/games:$PATH"\nexport CPATH="$CPATH:/opt/procursus/include"\nexport LIBRARY_PATH="$LIBRARY_PATH:/opt/procursus/lib"\n' | sudo tee -a /etc/zshenv /etc/profile
export PATH="/opt/procursus/bin:/opt/procursus/sbin:/opt/procursus/games:$PATH"
export CPATH="$CPATH:/opt/procursus/include"
export LIBRARY_PATH="$LIBRARY_PATH:/opt/procursus/lib"
sudo apt update
sudo apt full-upgrade
```
