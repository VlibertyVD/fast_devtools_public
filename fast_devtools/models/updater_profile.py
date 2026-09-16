from odoo import models, fields, api
from odoo.exceptions import ValidationError

class UpdaterProfile(models.Model):
    _name = 'updater.profile'
    _description = 'Module Updater Profile'

    name = fields.Char(string="Profile Name", required=True)
    active = fields.Boolean(default=True)
    module_line_ids = fields.One2many('updater.profile.line', 'profile_id', string="Modules to Update",  required=True)

    @api.constrains('module_line_ids')
    def _check_module_lines(self):
        for profile in self:
            if not profile.module_line_ids:
                raise ValidationError("You cannot create an empty profile. You must add at least one module.")

    @api.model
    def trigger_systray_update(self, profile_id):
        profile = self.browse(int(profile_id))
        
        if not profile.exists():
            return {'status': 'error', 'message': 'The selected profile no longer exists.'}
        
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