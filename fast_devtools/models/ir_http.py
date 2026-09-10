import logging
from odoo import models

_logger = logging.getLogger(__name__)

class IrHttp(models.AbstractModel):
    _inherit = 'ir.http'

    def session_info(self):
        _logger.info("Executing custom session_info for fast_devtools...")
        
        result = super().session_info()
        get_param = self.env['ir.config_parameter'].sudo().get_param
        
        debug_param = get_param('fast_devtools.enable_systray_debug', 'False')
        updater_param = get_param('fast_devtools.enable_systray_updater', 'False')
        
        _logger.info("fast_devtools parameters fetched - Debug: %s, Updater: %s", debug_param, updater_param)
        
        # Inject settings into the web session for OWL components
        result['fast_devtools'] = {
            'enable_debug': debug_param == 'True',
            'enable_updater': updater_param == 'True',
        }
        
        return result