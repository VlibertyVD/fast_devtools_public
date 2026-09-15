/** @odoo-module **/
import { registry } from "@web/core/registry";
import { useService } from "@web/core/utils/hooks";
import { Component, useState, onWillStart } from "@odoo/owl"; // Importamos useState y onWillStart
import { session } from "@web/session";

export class SystrayUpdater extends Component {
    setup() {
        this.orm = useService("orm");
        this.notification = useService("notification");
        
        this.state = useState({
            isOpen: false,
            profiles: [],
        });

        onWillStart(async () => {
            if (this.isVisible) {
                this.state.profiles = await this.orm.searchRead(
                    "updater.profile",
                    [["active", "=", true]],
                    ["id", "name"]
                );
            }
        });
    }

    get isVisible() {
        return session.fast_devtools ? session.fast_devtools.enable_updater : false;
    }

    toggleDropdown() {
        this.state.isOpen = !this.state.isOpen;
    }

    // Now we receive the ID coming from the template.
    async onUpdateClick(profileId) {
        this.state.isOpen = false; 
        
        try {
            const result = await this.orm.call("updater.profile", "trigger_systray_update", [profileId]);
            
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
                return Promise.reject(error);
            }
            setTimeout(() => window.location.reload(), 5000);
        }
    }
}
SystrayUpdater.template = "fast_devtools.SystrayUpdater";

registry.category("systray").add("fast_devtools.updater", { Component: SystrayUpdater }, { sequence: 100 });