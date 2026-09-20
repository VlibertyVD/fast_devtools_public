from odoo import models, fields

class UpdaterProfileLine(models.Model):
    _name = 'updater.profile.line'
    _description = 'Module Line'
    _order = 'sequence'

    sequence = fields.Integer(string='Sequence', default=10)
    profile_id = fields.Many2one('updater.profile', ondelete='cascade')
    module_id = fields.Many2one('ir.module.module', string="Module", required=True, domain=[('state', '=', 'installed')],  ondelete='cascade')