from decouple import config

if config('ENVIRONMENT', default='development') == 'development':
    from .dev import *
else:
    from .prod import *
