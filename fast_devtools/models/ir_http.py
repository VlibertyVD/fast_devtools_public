import logging
from odoo import models

_logger = logging.getLogger(__name__)

class IrHttp(models.AbstractModel):
    _inherit = 'ir.http'

    def session_info(self):
        result = super().session_info()
        get_param = self.env['ir.config_parameter'].sudo().get_param
        
        # Inject settings into the web session for OWL components
        result['fast_devtools'] = {
            'debug_1': get_param('fast_devtools.enable_debug_1', 'False') == 'True',
            'debug_assets': get_param('fast_devtools.enable_debug_assets', 'False') == 'True',
            'debug_tests': get_param('fast_devtools.enable_debug_tests', 'False') == 'True',
            'enable_updater': get_param('fast_devtools.enable_systray_updater', 'False') == 'True',
        }
        
        return result