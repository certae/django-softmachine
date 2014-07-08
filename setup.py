# -*- coding: utf-8 -*-
import os
from setuptools import setup
from setuptools import find_packages

README = open(os.path.join(os.path.dirname(__file__), 'PYPI.rst')).read()

# allow setup.py to be run from any path
os.chdir(os.path.normpath(os.path.join(os.path.abspath(__file__), os.pardir)))

setup(
    name='django-softmachine',
    version='1.0.6',
    packages=find_packages('src',exclude=['alltests', 'softmachine', 'alltests.*']),
    package_dir = {'':'src'},
    include_package_data=True,
    license='GPL License, see docs/LICENCE.md',
    description='CeRTAE SoftMachine est une application web qui consiste à réaliser'+ \
    ' les interfaces d’une application par la construction de vues à partir d’un modèle de données normalisée.',
    long_description=README,
    url='https://github.com/certae/django-softmachine',
    author='Certae - Dario Gomez Tafur',
    author_email='dariogomeztw@gmail.com',
    classifiers=[
        'Environment :: Web Environment',
        'Framework :: Django',
        'Intended Audience :: Developers',
        'License :: OSI Approved :: GNU General Public License (GPL)',
        'Operating System :: OS Independent',
        'Programming Language :: Python',
        'Programming Language :: Python :: 2.7',
        'Topic :: Internet :: WWW/HTTP',
        'Topic :: Internet :: WWW/HTTP :: Dynamic Content',
    ],
    install_requires=[
        "Django >= 1.5",
    ],
)