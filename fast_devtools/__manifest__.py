{
    'name': 'Fast DevTools',
    'version': '18.0.1.0.0',
    'summary': 'Developer tools for Systray: Debug toggle and Module Updater',
    'category': 'Technical Tools',
    'depends': ['base', 'web'],
    'author': 'Daniel Venegas',
    'maintainer': 'Daniel Venegas',
    'data': [
        'security/ir.model.access.csv',
        
        'views/updater_profile_views.xml',
        'views/res_config_settings_views.xml',

    ],
    'assets': {
        'web.assets_backend': [
            'fast_devtools/static/src/js/debug_toggle.js',
            'fast_devtools/static/src/js/module_updater.js',
            'fast_devtools/static/src/xml/systray_templates.xml',
        ],
    },
    'images': ['static/description/banner.png'],
    'installable': True,
    'application': False,
    'license': 'LGPL-3',
}
