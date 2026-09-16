import logging
from odoo import models

_logger = logging.getLogger(__name__)

class IrHttp(models.AbstractModel):
    _inherit = 'ir.http'

    def session_info(self):
        result = super().session_info()
        get_param = self.env['ir.config_parameter'].sudo().get_param
        
        # Retrieve the comma-separated profile IDs from the system parameters
        param_profiles = get_param('fast_devtools.active_profile_ids', '')
        profile_list = []
        
        if param_profiles:
            profile_ids = [int(x) for x in param_profiles.split(',') if x]
            
            profiles = self.env['updater.profile'].sudo().search([
                ('id', 'in', profile_ids),
                ('active', '=', True)
            ])
            # Build a lightweight dictionary list for the frontend
            profile_list = [{'id': p.id, 'name': p.name} for p in profiles]
        
        # Inject settings and fetched profiles into the web session for OWL components
        result['fast_devtools'] = {
            'debug_1': get_param('fast_devtools.enable_debug_1', 'False') == 'True',
            'debug_assets': get_param('fast_devtools.enable_debug_assets', 'False') == 'True',
            'debug_tests': get_param('fast_devtools.enable_debug_tests', 'False') == 'True',
            'enable_updater': get_param('fast_devtools.enable_systray_updater', 'False') == 'True',
            'profiles': profile_list, 
        }
        
        return result
