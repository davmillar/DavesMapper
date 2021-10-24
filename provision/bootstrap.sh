#!/usr/bin/env bash
#
# Provisioning script. Intended to configure an Ubuntu 20 server with all
# necessary system-level dependencies. This script is written to be used
# in both development (Vagrant) and potentially in production against a
# standard Ubuntu cloud server or VPS.
#
# This script is also written to be idempotent (safe to re-run) to make for
# easier testing/tweaking.
#
# This script must be run as root. To use this script on a new
# production server:
#
#   1. SCP or clone this repo to `/var/www/daves_mapper` on the server.
#   2. SSH into the server: `ssh ubuntu@$YOUR_SERVER`
#   3. Move to the project dir: `cd /var/www/daves_mapper`
#   4. Switch to root: `sudo su -`
#   5. Run `provision/bootstrap.sh "$PWD" 'davesmapper.com' $USER`


# Config vars.

export MYSQL_PASS=$(date +%s|sha256sum|base64|head -c 32)
export MYSQL_DATABASE_NAME=daves_mapper
export PROJECT_NAME=daves-mapper
export PROJECT_ROOT="${1:-/var/www/$PROJECT_NAME}"
export PROJECT_DOMAIN="${2:-daves-mapper.test}"
export PROJECT_USER="${3:-vagrant}"
export PROJECT_GROUP="${4:-www-data}"

PHP_VERSION='7.4'
PHP_REQ_EXT=( 'cli' 'curl' 'fpm' 'gd' 'json' 'mysql' 'opcache' 'readline' 'xml' 'zip' )


# Users.
# Adding the login user to the web server's group makes editing files easier.
echo '## Setting up user groups for convenience.'

if ! id -g ${PROJECT_GROUP} &>/dev/null; then
  groupadd ${PROJECT_GROUP}
fi
if ! id -u ${PROJECT_GROUP} &>/dev/null; then
  useradd ${PROJECT_USER} -g ${PROJECT_GROUP}
fi
# Login user can manage files owned by Apache.
usermod -a -G ${PROJECT_USER} ${PROJECT_GROUP}
# Apache can manage files owned by user.
usermod -a -G ${PROJECT_USER} ${PROJECT_GROUP}


# Locales
echo '## Configuring locale and apt.'

export LANGUAGE=en_US.UTF-8
export TERM=xterm
export DEBIAN_FRONTEND=noninteractive

locale-gen en_US.UTF-8
dpkg --configure -a


# Low-level system dependencies.
echo '## Installing and configuring system dependencies.'

apt-get -qqq update
apt-get -yqq install \
  software-properties-common \
  build-essential \
  debconf-utils \
  zip \
  unzip \
  git \
  libsodium23 \
  mcrypt


# PHP and Apache.
echo '## Installing and configuring Apache and PHP.'

add-apt-repository -y ppa:ondrej/php
add-apt-repository -y ppa:ondrej/apache2
apt-get -qqq update

EXT_LIST=""
for EXT in "${PHP_REQ_EXT[@]}"; do
  EXT_LIST+=" php${PHP_VERSION}-${EXT}"
done
apt-get -yqq install \
  apache2 \
  libapache2-mod-fcgid \
  php$PHP_VERSION \
  $EXT_LIST

cat <<PHPINI > /etc/php/7.4/fpm/conf.d/99-logging.ini
error_log /var/log/php_error.log

PHPINI

if [ -f "/etc/php/$PHP_VERSION/fpm/pool.d/www.conf" ]; then
  rm /etc/php/$PHP_VERSION/fpm/pool.d/www.conf
fi
cat <<FPMCONF > /etc/php/$PHP_VERSION/fpm/pool.d/$PROJECT_NAME.conf
[$PROJECT_NAME]

user  = $PROJECT_USER
group = $PROJECT_GROUP

listen = /var/run/php/php$PHP_VERSION-fpm.sock;

listen.owner = www-data
listen.group = www-data
listen.mode  = 0660

pm                      = dynamic
pm.max_children         = 5
pm.start_servers        = 2
pm.min_spare_servers    = 1
pm.max_spare_servers    = 3
pm.process_idle_timeout = 10s
pm.max_requests         = 500

chdir = /
FPMCONF

systemctl enable php$PHP_VERSION-fpm
systemctl restart php$PHP_VERSION-fpm

a2enconf php7.4-fpm
a2enmod \
  actions \
  alias \
  fcgid \
  proxy_fcgi \
  rewrite \
  setenvif

mkdir -p /var/log/apache2/${PROJECT_DOMAIN}
touch /var/log/apache2/${PROJECT_DOMAIN}/{access,error}.log
chown root:www-data /var/log/apache2/${PROJECT_DOMAIN}/{access,error}.log
chmod ug=rw,o=r /var/log/apache2/${PROJECT_DOMAIN}/{access,error}.log
if [ -f '/etc/apache2/sites-enabled/000-default.conf' ]; then
  rm /etc/apache2/sites-enabled/000-default.conf
fi
cat <<APACHECONF > "/etc/apache2/sites-available/${PROJECT_NAME}.conf"
<VirtualHost *:80>
  ServerAdmin admin@${PROJECT_DOMAIN}
  ServerName ${PROJECT_DOMAIN}
  DocumentRoot "${PROJECT_ROOT}"
  DirectoryIndex index.php

  <Directory "${PROJECT_ROOT}">
    Options Indexes FollowSymLinks MultiViews
    AllowOverride All
    Order allow,deny
    Allow from all
  </Directory>

  <FilesMatch \.php$>
    # For Apache version 2.4.10 and above, use SetHandler to run PHP as a fastCGI process server
    SetHandler "proxy:unix:/var/run/php/php$PHP_VERSION-fpm.sock|fcgi://localhost"
  </FilesMatch>

  ErrorLog \${APACHE_LOG_DIR}/${PROJECT_DOMAIN}/error.log
  CustomLog \${APACHE_LOG_DIR}/${PROJECT_DOMAIN}/access.log combined
</VirtualHost>

APACHECONF

a2ensite $PROJECT_NAME

apachectl configtest
systemctl enable apache2
systemctl restart apache2

# Install composer.

curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer


# MySQL.
echo '## Installing and configuring MySQL server.'

if [ ! -f '/home/$PROJECT_USER/.my.cnf' ]; then
  echo "mysql-server mysql-server/root_password password $MYSQL_PASS" | debconf-set-selections
  echo "mysql-server mysql-server/root_password_again password $MYSQL_PASS" | debconf-set-selections
fi

apt-get -yqq install mysql-server
mysqld --initialize
systemctl enable mysql
systemctl restart mysql

# Save local credentials for streamlined command-line usage.
# Example: `ssh ubuntu@your-server.com mysql` will work by reading
# the root credentials directly from the ~/.my.cnf file on the server.
# This SSH-styled approach also means you don't have to open 3306 to
# the world, nor do you need to allow external TCP connections to the
# MySQL service directly.
if [ ! -f '/home/$PROJECT_USER/.my.cnf' ]; then
	# This heredoc MUST be indented with TABS.
	cat <<-MYCNF > /home/$PROJECT_USER/.my.cnf
		[client]
		user=root
		password="$MYSQL_PASS"

		[mysql]
		user=root
		password="$MYSQL_PASS"

		[mysqldump]
		user=root
		password="$MYSQL_PASS"

		[mysqldiff]
		user=root
		password="$MYSQL_PASS"

		[mysqladmin]
		user=root
		password="$MYSQL_PASS"
	MYCNF
fi

if [ ! -f '/root/.my.cnf' ]; then
  ln -s /home/$PROJECT_USER/.my.cnf /root/.my.cnf
fi
chown $PROJECT_USER:$PROJECT_GROUP /home/$PROJECT_USER/.my.cnf
chmod u=r,go= /home/$PROJECT_USER/.my.cnf

mysql -e "CREATE DATABASE IF NOT EXISTS $MYSQL_DATABASE_NAME;"
