project_name = "mapper"

Vagrant.configure("2") do |config|
  config.vm.box = "hashicorp/precise32"
  config.vm.synced_folder ".", "/vagrant"
  config.vm.provision :shell, path: ".vagrant/bootstrap.sh"
  config.vm.network :forwarded_port, host: 4069, guest: 80
  config.vm.provider "virtualbox" do |v|
    v.name = "Dave's Mapper Vagrant"
    v.gui = false 
  end
end
