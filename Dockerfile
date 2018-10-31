FROM php:5.6-apache
RUN apt-get update && apt-get install -y \
        libcurl3-dev \
        libfreetype6-dev \
        libjpeg-dev \
        libpng-dev \
        libmcrypt-dev \
    && docker-php-ext-install curl \
    && docker-php-ext-install mcrypt \
    && docker-php-ext-install mysql \
    && docker-php-ext-configure gd --with-freetype-dir=/usr/include/ --with-jpeg-dir=/usr/include/ \
    && docker-php-ext-install gd
