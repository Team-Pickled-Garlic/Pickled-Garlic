# Pickled-Garlic

This project is a web application designed to create iCalendar files. The user creates events they want to include on their calendar before an iCalendar.ics file is generated and made available to download. These files can then be imported into calendar services such as Google Calendar.  

## Project Dependencies 
1. PHP 7.4
1. [Twig](https://twig.symfony.com/)
1. [Bootstrap 4](https://getbootstrap.com/)
1. [Popper.js](https://popper.js.org)
1. [jQuery](https://jquery.com/)
1. [DataTables](https://datatables.net/)
1. [Window Date Picker](https://github.com/cevadtokatli/window-date-picker)
1. [Moment.js](https://momentjs.com)

## Setting up a Local Project Deployment
This documentation will cover how to setup a local deployment on Windows 10 using Windows Subsystem for Linux (Ubuntu).

1. Install Windows Subsystem for Linux (WSL). Install the Ubuntu version.  
    WSL is only supported on Windows 10. You can view the install instructions on Microsoft's website at [https://docs.microsoft.com/en-us/windows/wsl/install-win10](https://docs.microsoft.com/en-us/windows/wsl/install-win10).

1. Clone this Project's Git Repository  
    Open up a shell such as Git Bash and change into the desired directory to place this repo  
    For example, I placed mine in `C:\Users\user\Documents\git-repos`
    ```shell
    cd /c/Users/user/Documents/git-repos
    git clone https://github.com/Team-Pickled-Garlic/Pickled-Garlic.git
    ``` 

1. Install Apache Webserver  
    This step is done within Ubuntu
    ```shell
    apt-add-repository ppa:ondrej/apache2
    apt-get update
    apt-get install -y apache2
    ```  

1. Apache Configuration  
    This step is done within Ubuntu
    ```shell
    vim /etc/apache2/sites-enabled/000-default.conf # Or preferred editor in lieu of vim
    ```

    Edit the config so that it contains the contents below, then exit the editor  
    Comments are removed for ease of content viewing  

    ```shell
    <VirtualHost *:80>
        ServerName localhost

        ServerAdmin webmaster@localhost
        DocumentRoot /var/www/devroot/public
        FallbackResource /index.php

        ErrorLog ${APACHE_LOG_DIR}/error.log
        CustomLog ${APACHE_LOG_DIR}/access.log combined
    </VirtualHost>
    ```

    Setup a symbolic link from `/var/www/devroot` to where you cloned the repo  
    Below is an example of what I would do if my repo is located at `C:\Users\user\Documents\git-repos\Pickled-Garlic`
    ```shell
    ln -s /mnt/c/Users/user/Documents/git-repos/Pickled-Garlic /var/www/devroot
    ```

1. Install PHP 7.4  
    This step is done within Ubuntu
    ```shell
    apt-add-repository ppa:ondrej/php
    apt-get update
    apt-get install -y php7.4 php7.4-fpm php7.4-zip libapache2-mod-php7.4
    ```  

1. Install Composer  
    This step is done within Ubuntu
    ```shell
    curl -sS https://getcomposer.org/installer | php
    mv composer.phar /usr/local/bin/composer
    composer -V # this should give an output if Composer has been installed correctly
    ```  

1. Install Dependencies using Composer  
    This step is done within Ubuntu
    ```shell
    cd /var/www/devroot
    composer install
    composer update
    ```

1. Create a cache folder for Twig template cache  
    This step is done within Ubuntu
    ```shell
    mkdir /var/www/devroot/public/cache
    chown www-data /var/www/devroot/public/cache
    ```

1. Start/Restart Apache Webserver  
    This step is done within Ubuntu
    ```shell
    service apache2 restart
    ```

1. Open your web browser of choice, type `localhost` in the URL bar then hit [Enter]. The app should then be open and running from the browser