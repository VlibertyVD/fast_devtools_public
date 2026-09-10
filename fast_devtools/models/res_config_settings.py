from odoo import models, fields

class ResConfigSettings(models.TransientModel):
    _inherit = 'res.config.settings'

    enable_systray_debug = fields.Boolean(
        string="Enable Debug Button",
        config_parameter='fast_devtools.enable_systray_debug'
    )
    enable_systray_updater = fields.Boolean(
        string="Enable Updater Button",
        config_parameter='fast_devtools.enable_systray_updater'
    )
    # By using config_parameter, the value is global for the entire database
    updater_profile_id = fields.Many2one(
        'updater.profile',
        string="Profile to Execute",
        config_parameter='fast_devtools.active_profile_id'
    )