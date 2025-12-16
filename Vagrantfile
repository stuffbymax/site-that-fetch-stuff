# -*- mode: ruby -*-
# vi: set ft=ruby :
Vagrant.configure("2") do |config|
config.vm.box = "ubuntu/jammy64"
config.vm.network "forwarded_port", guest: 80, host: 8080
config.vm.network "forwarded_port", guest: 5173, host: 5173
config.vm.synced_folder "./shared/", "/shared" #, disabled: true
config.vm.provision "shell",privileged: false, inline: <<-SHELL
    
    curl -sL https://deb.nodesource.com/setup_22.x -o /tmp/nodesource_setup.sh
    sudo bash /tmp/nodesource_setup.sh
    sudo apt update
    sudo apt install -y apache2 git vim htop nodejs zip unzip lynx
    npm create vite@latest vite-test-app -- --template react
    cd ./vite-test-app
    npm install
    
    
    sudo tee /usr/local/bin/npm1 > /dev/null <<EOF
    npm run dev -- --host
    
     
EOF
    sudo chmod +x /usr/local/bin/npm1
    
    echo -e "\e[34myou dont have to type\e[0m \e[4;32m npm run dev -- --host \e[0m \e[4;32mjust npm1\e[0m"


SHELL
end
