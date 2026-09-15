from odoo import models, fields, api

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

    updater_profile_ids = fields.Many2many(
        'updater.profile',
        string="Available Systray Profiles"
    )

    def set_values(self):
        super().set_values()
        ids_str = ','.join(map(str, self.updater_profile_ids.ids))
        self.env['ir.config_parameter'].sudo().set_param('fast_devtools.active_profile_ids', ids_str)

    @api.model
    def get_values(self):
        res = super().get_values()
        param = self.env['ir.config_parameter'].sudo().get_param('fast_devtools.active_profile_ids')
        
        if param:
            profile_ids = [int(x) for x in param.split(',') if x.isdigit()]
            
            existing_profiles = self.env['updater.profile'].sudo().browse(profile_ids).exists()
            
            # Update the field ONLY with valid, existing IDs
            res.update(updater_profile_ids=[(6, 0, existing_profiles.ids)])
            
        return res