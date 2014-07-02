# django-softmachine

[![Build Status](https://travis-ci.org/victorette/django-softmachine.svg?branch=master)](https://travis-ci.org/victorette/django-softmachine)
[![Coverage Status](https://coveralls.io/repos/victorette/ProtoExt/badge.png?branch=master)](https://coveralls.io/r/victorette/ProtoExt?branch=master)

CeRTAE [ProtoExt](http://www.certae.org/index.php?id=88) proposes an approach based on DATARUN method. This approach consists in achieving the interfaces of an application by the contruction of views from a standard data model. In other words, you can prototype and export a new application model. 
The system architecture is a Web MVC variant, this means that we use the basic concepts of Model, View and Controller adapted to a Web App.

>[GPL License](docs/LICENSE.md)

>Suggested IDE : [Aptana Studio 3](http://aptana.com/)


## Table of contents

* [Get Started](#get-started)
  * [Software requirements](#software-requirements)
  * [Install using pip](#install-using-pip)
  * [Deploying as Django app](#deploying-as-django-app)
    * [Production requirements](#production-requirements)
    * [Installation](#installation)
* [Security remarks](#security-remarks)
* [Reusing SoftMachine in customized projects](#reusing-softmachine-in-customized-projects)
  * [Generating an application](#generating-an-application)
  * [Setup a new project](#setup-a-new-project)


## Get Started
SoftMachine can be installed and used in two ways:

 1. Using `pip` to install a standalone Python package you can reuse in new projects
 2. Deploying as a Django application

### Software requirements:

* Ext JS 4.2.1
* Python 2.7
* Django 1.6.1
* graphviz ([OPTION] For export database diagram)
* south ([OPTION] For export database migration)

### <i class="icon-download"></i> Install using pip
SoftMachine is best installed via PyPI. To install the latest version, run:
```
pip install django-softmachine
```
or Install from github source:
```
pip install git+git://github.com/certae/ProtoExt.git
```
Edit your **settings.py** file and add `protoLib` and `prototypeur` to your `INSTALLED_APPS` section:
```python
INSTALLED_APPS = (
    ...
    'protobase',
    'protoLib',
    'prototype',
    'myapp',
)
```
Also edit your **urls.py** and add the following url patterns:
```python
urlpatterns = patterns('',
    # ... omited code
    url(r'^', include('protoLib.urls')),
    url(r'^protoDiagram/', include('dbDesigner.urls')),
)
```
>See [<i class="icon-share"></i> Setup a new project](#setup-a-new-project) section for a detailed description.

### <i class="icon-folder-open"></i> Deploying as Django app

#### Production requirements:

* Python-mysqldb  / PyGreSQL / ...  ( DbServerConector )
* Apache
* Mod_wsgi


#### Installation
Those steps are based on a Ubuntu server, but it is applicable to others Linux distributions.

Hands-on: start by checking Python version in a server terminal, usually Ubuntu comes with Python 2.7. The next step is Django installation, in a terminal type:
```script
sudo apt-get install python-setuptools python-dev build-essential
sudo easy_install pip
sudo pip install Django==1.6.1
```

To verify that Django can be seen by Python, type python from your shell. Then at the Python prompt, try to import Django
```python
>>> import django
>>> print django.get_version()
```

Install South by the command:
```
sudo pip install south
```

If you are going to use MySQL, you must install the python driver:
```
sudo apt-get install python-mysqldb
```

We assume that Apache web server is already installed, if not:
```
sudo apt-get install apache2
```

And for an easy deploy install:
```
sudo apt-get install libapache2-mod-wsgi
```

Now we are going to configure the web server:
```
sudo vi /etc/apache2/sites-available/default
```

Inside the tag `<VirtualHost *:80>`
insert those lines:
>`Alias /static/admin/ /usr/local/lib/python2.7/dist-packages/django/contrib/admin/static/admin/`
`WSGIScriptAlias / /var/www/prototypeur/ProtoExt/src/softmachine/prototypeur.wsgi`

We are almost there, go to the home folder:
`cd /var/www/`
create a new prototypeur directory
`mkdir prototypeur`
and extract the ProtoExt-master.zip (downloaded from https://github.com/victorette/ProtoExt) code inside the prototypeur folder, rename the new folder to ProtoExt.
Go to the new folder and make sure that `settings.py` is following the security remarks mentioned below. The App won't work is this file is configured improperly.

Download Ext JS from [Sencha.com](http://www.sencha.com/products/extjs/download/), extract it in `/var/www/prototypeur/ProtoExt/static` and rename the extracted folder to **extjs**.
Synchronize the database: 
`python src/manage.py syncdb`

Make sure that all steps were executed and restart the web server:
`sudo /etc/init.d/apache2 restart`

Open chrome or firefox :

If running from aptana : `http://127.0.0.1:8000/protoExt`

If using Apache : `http://<server_ip>/protoExt`

## Security remarks
In order to achieve the security requirements, the `settings.py` should be modified before deploying the Django project.

`SECRET_KEY`
Instead of hardcoding the secret key in the settings module, we are going to load it from a file:
```python
with open('/etc/secret_key.txt') as f:
    SECRET_KEY = f.read().strip()
```

This file will be generated by CeRTAE upon request.

`DEBUG`
Never enable debug in production so set it to False (`DEBUG = False`)

Split configuration is used to avoid sending sensitive data to GitHub. This configuration is based on DEBUG variable. If debug is enabled the System is going to load “settings_development.py” otherwise it will import “settings_production.py”.
```python
if DEBUG :
    from softmachine.settings_development import *
    with open( PPATH + '/src/softmachine/secret_key.txt') as f:
        SECRET_KEY = f.read().strip()
else :
    from softmachine.settings_production import *
    with open('/etc/secret_key.txt') as f:
        SECRET_KEY = f.read().strip()
```
Those files contain information about DATABASES, ALLOWED_HOSTS, TEMPLATE_LOADERS, TEMPLATE_CONTEXT_PROCESSORS, TEMPLATE_DIRS, INSTALLED_APPS and EMAIL configurations.

## Reusing SoftMachine in customized projects

If we run the project as a simple Django application we're able to create a relational database model graphically (like [DBDesigner](http://www.fabforce.net/dbdesigner4/)) or via forms. More details in the [docs](http://certae.github.io/ProtoExt/) *French only.

Once that we've defined our model, entities, attributes and relationships it's possible to create and customize a functional **prototype** (CRUD) based on entities.

### Generating an application
When the prototype is finished we can export the model to generate a new application. The output is a `models.py` file containing the basics for a new Django app.

### Setup a new project
Create a new Django project, if you don't know how, take a look on this [Tutorial](https://docs.djangoproject.com/en/1.6/intro/tutorial01/).
Your new project should looks like:
```
mysite/
    manage.py
    mysite/
        __init__.py
        settings.py
        urls.py
        wsgi.py
    myapp/
        __init__.py
        models.py
        tests.py
        views.py
```
At this point you should have modified those files **settings.py** and **urls.py** as mentioned in [Install using pip](#install-using-pip) section.

### Extend a template
```html
<!DOCTYPE html>
<html lang="fr">
	<head>
		<meta charset="utf-8">
		{% block sitetitle %}
		<!-- put site title here. i.e.: <title>Proto Certae</title> -->
		{% endblock %}

		{% block meta %}
		<meta name="author" content="CeRTAE U.Laval">
		{% endblock %}
		
		{% block extjs %}
		<!-- you can replace the extjs implementation-->
		{% endblock %}
		
		{% block defaultstylesheets %}
		<!-- You can replace all application stylesheets, 
		if you want to use the default put something here -->
		{% endblock %}
		{% block extrastylesheets %}{% endblock %}
		
		{% block configproperties %}
		<script type="text/javascript" src="{{ STATIC_URL }}js/globals/configProperties.js"></script>
		{% endblock %}

		
		{% block extjsloader %}{% endblock %}
		{% block javascript %}{% endblock %}
	</head>
	<body></body>
</html>
```

```html
{% extends "protoDebug.html" %}

{% block sitetitle %}
<title>RAI Certae</title>
{% endblock %}

{% block meta %}
<meta name="description" content="">
<meta name="author" content="CeRTAE U.Laval">
{% endblock %}
		
{% block extrastylesheets %}
<link rel="stylesheet" type="text/css" href="{{ STATIC_URL }}css/rai.css">
{% endblock %}
{% block configproperties %}
<script type="text/javascript" src="{{ STATIC_URL }}js/config/configProperties.js"></script>
{% endblock %}

{% block extjsloader %}
<script type="text/javascript">
// Place to use Ext.Loader methods
</script>
{% endblock %}

{% block javascript %}
<script type="text/javascript" src="{{ STATIC_URL }}js/rai/app.js"></script>
{% endblock %}
```


### Add a new ExtJS app

### Customizing models

### Production
Copy ...Python/2.7/lib/python/site-packages/protobase/static to your local static folder...