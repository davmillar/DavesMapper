conf = {
  PROJECT_NAME: 'daves-mapper',
  PROJECT_ROOT: '/var/www/daves-mapper',
  PROJECT_PORT: 4069,
}

Vagrant.require_version '>= 2.0.0'

Vagrant.configure('2') do |config|
  config.vm.box = 'bento/ubuntu-20.04'

  config.vm.network :forwarded_port,
    host: conf[:PROJECT_PORT],
    guest: 80
  config.vm.network :forwarded_port,
    host: 3307,
    guest: 3306,
    auto_correct: true

  config.vm.synced_folder '.', conf[:PROJECT_ROOT]

  config.vm.provider 'virtualbox' do |v|
    v.name = "Dave's Mapper Vagrant"
    v.gui = false
  end

  config.vm.provision :shell,
    name: 'bootstrap',
    path: 'provision/bootstrap.sh',
    args: [
      conf[:PROJECT_ROOT],
      "#{conf[:PROJECT_NAME]}.test",
      'vagrant'
    ]

  config.vm.provision :shell,
    name: 'vagrant specific',
    privileged: false,
    inline: <<~VAGRANTONLYSCRIPT
      cd #{conf[:PROJECT_ROOT]}

      echo '## Creating a limited vagrant-only DB user.'
      cat <<SQL | mysql
        CREATE USER IF NOT EXISTS 'vagrant'@'%' IDENTIFIED BY 'vagrant';
        GRANT ALL ON daves_mapper.* TO 'vagrant'@'%';
        FLUSH PRIVILEGES;
      SQL

      if [ ! -f cgi-bin/db_start.php ]; then
        echo '## Copying db_start.php into place.'
        cp cgi-bin/db_start.php.example cgi-bin/db_start.php
      fi

      TABLE_COUNT=$(mysql --batch --skip-column-names -e 'SELECT count(*) FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = "daves_mapper";')
      if [ $TABLE_COUNT -eq 0 ]; then
        echo '## Importing MySQL schema.'
        mysql daves_mapper < provision/schema.sql
        echo '## Importing scrubbed artist data.'
        mysql daves_mapper < provision/artists.sql
        echo '## Importing randomized dump containing 100 tiles.'
        mysql daves_mapper < provision/tiles.sql
      fi

      echo '## Setting convenience login dir.'
      if grep -vq 'cd #{conf[:PROJECT_ROOT]}' ~/.profile; then
        echo 'cd #{conf[:PROJECT_ROOT]}' >> ~/.profile
      fi

    VAGRANTONLYSCRIPT

  # TODO: Define a safety trigger to export MySQL data before destroying the VM.

  config.vm.post_up_message = "VM is up! Visit http://localhost:#{conf[:PROJECT_PORT]}"
end
