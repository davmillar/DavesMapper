# Dave's Mapper


This is the code behind [Dave's Mapper](https://davesmapper.com). It's based on the Morph Mapper by Rob Lang, but vastly larger in scope and ambition.


## Development

This project includes a Vagrantfile to bundle all necessary dependencies. Locally you will need:

* git v2.0+
* [Vagrant](https://www.vagrantup.com/downloads)
  * [Virtualbox](https://www.virtualbox.org/wiki/Downloads)

The included `provision/boostrap.sh` script defines all other system-level dependencies including PHP, Apache and MySQL.

### Setup

1. Clone the repo.
2. Run `vagrant up` to download, provision and launch the development box.
  * This will take some time during the first execution as the base VM image needs to be downloaded from the internet.
3. This local folder is mapped into the VM's `/app` folder. Changes to files in the project will be updated inside the VM nearly instantaneously.
4. Visit http://localhost:4069
5. When you are done, run `vagrant halt` to halt the configured VM. (Subsequent `vagrant up` commands will boot this already-provisioned VM.)

Database credentials will be automatically configured in `cgi-bin/db_start.php` to work with Vagrant. This file is gitignore'd to prevent it from being committed back to the repo with sensitive credentials.

### Building Assets

The source files for CSS, Javascript and images mostly live in `assets-src/`.

After editing these files, you must compile them into the published files hosted in `assets/` using `./build.sh`.

The associated vagrant VM provides all of the necessary depedencies to build assets.

```shell
$ vagrant ssh -c build.sh
$ git add assets/*
$ git commit -m 'Build fresh assets.'
```

## License


		Dave's Mapper
		Copyright © 2010-2018  David Millar

		This program is free software: you can redistribute it and/or modify
		it under the terms of the GNU General Public License as published by
		the Free Software Foundation, either version 3 of the License, or
		(at your option) any later version.

		This program is distributed in the hope that it will be useful,
		but WITHOUT ANY WARRANTY; without even the implied warranty of
		MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
		GNU General Public License for more details.

		You should have received a copy of the GNU General Public License
		along with this program.  If not, see http://www.gnu.org/licenses/.

## Contact


I can be reached at dave@davegoesthedistance.com or dave@davesmapper.com
