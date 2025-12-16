# how to run it

## to start vagrant machine type
```
vagrant up
```

## then ssh into it by
```
vagrant ssh
```
### after you ssh to vagrant box move any zip folder in shared to home folder

```bash
mv fetchdifferentapi.zip ~
```
## and unzip it by

```bash
unzip fetchdifferentapi.zip
cd fetchdifferentapi
```

## then remove node modules by
```nash
sudo rm -r node_modules 
```
## and then jsut install the modules
```bash
npm install
```
## to run it

```bash
npm1
```
> or you could type it manualy

```bash
npm run dev -- --host
```


## if you not sure about vagrant you can download my doc 

### windows
```ps1
curl -o vagrant-tutorial.html "https://raw.githubusercontent.com/stuffbymax/cloud/refs/heads/main/vagrant-tutorial.htm?token=GHSAT0AAAAAADFYIFXVSM6DKHCNR3VYKJHU2JIRTJA"
```
---

### Linux/mac/bsd
```sh
wget "https://raw.githubusercontent.com/stuffbymax/cloud/refs/heads/main/vagrant-tutorial.htm?token=GHSAT0AAAAAADFYIFXVSM6DKHCNR3VYKJHU2JIRTJA"
```
