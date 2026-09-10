/** @odoo-module **/
import { registry } from "@web/core/registry";
import { useService } from "@web/core/utils/hooks";
import { Component } from "@odoo/owl";
import { session } from "@web/session";

export class SystrayUpdater extends Component {
    setup() {
        this.orm = useService("orm");
    }

    get isVisible() {
        // Returns false if fast_devtools is not in session yet
        return session.fast_devtools ? session.fast_devtools.enable_updater : false;
    }

    async onUpdateClick() {
        try {
            const result = await this.orm.call("updater.profile", "trigger_systray_update", []);
            if (result.status === 'error') {
                alert(result.message);
                return;
            }
            window.location.reload();
        } catch (error) {
            console.error("Error updating modules:", error);
            setTimeout(() => window.location.reload(), 5000);
        }
    }
}
SystrayUpdater.template = "fast_devtools.SystrayUpdater";

registry.category("systray").add("fast_devtools.updater", { Component: SystrayUpdater }, { sequence: 100 });