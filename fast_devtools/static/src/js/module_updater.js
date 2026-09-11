/** @odoo-module **/
import { registry } from "@web/core/registry";
import { useService } from "@web/core/utils/hooks";
import { Component } from "@odoo/owl";
import { session } from "@web/session";

export class SystrayUpdater extends Component {
    setup() {
        this.orm = useService("orm");
        this.notification = useService("notification");
    }

    get isVisible() {
        return session.fast_devtools ? session.fast_devtools.enable_updater : false;
    }

    async onUpdateClick() {
        try {
            const result = await this.orm.call("updater.profile", "trigger_systray_update", []);
            
            if (result.status === 'error') {
                this.notification.add(result.message, {
                    title: "Updater",
                    type: "danger",
                    sticky: false,
                });
                return;
            }
            
            window.location.reload();
            
        } catch (error) {
            if (error && error.name === "RPC_ERROR") {
                // Devolvemos el error al framework de Odoo para que muestre la ventana nativa gigante del Traceback
                return Promise.reject(error);
            }
            
            // Si no es un RPC_ERROR, significa que el servidor simplemente cortó la conexión 
            // porque se está reiniciando de forma exitosa (comportamiento normal).
            setTimeout(() => window.location.reload(), 5000);
        }
    }
}
SystrayUpdater.template = "fast_devtools.SystrayUpdater";

registry.category("systray").add("fast_devtools.updater", { Component: SystrayUpdater }, { sequence: 100 });