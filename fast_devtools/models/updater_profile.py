from odoo import models, fields, api

class UpdaterProfile(models.Model):
    _name = 'updater.profile'
    _description = 'Module Updater Profile'

    name = fields.Char(string="Profile Name", required=True)
    active = fields.Boolean(default=True)
    module_line_ids = fields.One2many('updater.profile.line', 'profile_id', string="Modules to Update",  ondelete='cascade', required=True)

    @api.model
    def trigger_systray_update(self):
        # Fetch the ID saved globally in the system parameters
        profile_id_str = self.env['ir.config_parameter'].sudo().get_param('fast_devtools.active_profile_id')
        
        if not profile_id_str:
            return {'status': 'error', 'message': 'No profile assigned in General Settings.'}
        
        # Convert the saved string to integer and fetch the profile
        profile = self.browse(int(profile_id_str))
        
        if not profile.exists():
            return {'status': 'error', 'message': 'The assigned profile no longer exists.'}
        
        modules = profile.module_line_ids.mapped('module_id')
        modules.button_immediate_upgrade()
        return {'status': 'success'}

class UpdaterProfileLine(models.Model):
    _name = 'updater.profile.line'
    _description = 'Module Line'
    _order = 'sequence'

    sequence = fields.Integer(string='Sequence', default=10)
    profile_id = fields.Many2one('updater.profile', ondelete='cascade')
    module_id = fields.Many2one('ir.module.module', string="Module", required=True, domain=[('state', '=', 'installed')],  ondelete='cascade')