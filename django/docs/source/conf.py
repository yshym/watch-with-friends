import os
import sys
import django


sys.path.insert(0, os.path.abspath('../..'))
sys.setrecursionlimit(1500)

os.environ['DJANGO_SETTINGS_MODULE'] = 'config.settings'
django.setup()


# -- Project information -----------------------------------------------------

project = 'watch-with-friends'
copyright = ''
author = ''


# -- General configuration ---------------------------------------------------

extensions = [
    'sphinx.ext.autodoc',
]


templates_path = ['_templates']


exclude_patterns = []


# -- Options for HTML output -------------------------------------------------

html_theme = 'alabaster'


html_static_path = ['_static']
