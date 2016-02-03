<VirtualHost *:80>
	ServerName www.vogella.com
	ServerAdmin test@test.com
	ServerAlias vogella.de www.vogella.de vogella.com www.vogella.org vogella.org

	DocumentRoot /var/www/vhosts/vogella.com/documentroot
	<Directory /var/www/vhosts/vogella.com/documentroot>
		Options -Indexes
		AllowOverride all
		Order allow,deny
		allow from all
	</Directory>

	ErrorLog ${APACHE_LOG_DIR}/error.log


	# Possible values include: debug, info, notice, warn, error, crit,
	# alert, emerg.
	LogLevel warn

	CustomLog ${APACHE_LOG_DIR}/access.log combined
        CustomLog ${APACHE_LOG_DIR}/www.vogella.com-access.log combined


</VirtualHost>
