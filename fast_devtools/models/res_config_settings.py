from odoo import models, fields

class ResConfigSettings(models.TransientModel):
    _inherit = 'res.config.settings'

    # --- Debugger Settings ---
    enable_debug_1 = fields.Boolean(
        string="Normal Debug",
        config_parameter='fast_devtools.enable_debug_1'
    )
    enable_debug_assets = fields.Boolean(
        string="Assets Debug",
        config_parameter='fast_devtools.enable_debug_assets'
    )
    enable_debug_tests = fields.Boolean(
        string="Tests Debug",
        config_parameter='fast_devtools.enable_debug_tests'
    )

    # --- Updater Settings ---
    enable_systray_updater = fields.Boolean(
        string="Enable Updater Button",
        config_parameter='fast_devtools.enable_systray_updater'
    )
    updater_profile_id = fields.Many2one(
        'updater.profile',
        string="Profile to Execute",
        config_parameter='fast_devtools.active_profile_id'
    )