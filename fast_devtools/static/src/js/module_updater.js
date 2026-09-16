/** @odoo-module **/
import { registry } from "@web/core/registry";
import { useService } from "@web/core/utils/hooks";
import { Component, useState, useRef, useExternalListener } from "@odoo/owl";
import { session } from "@web/session";

export class SystrayUpdater extends Component {
    setup() {
        this.orm = useService("orm");
        this.notification = useService("notification");
        this.rootRef = useRef("root");

        this.state = useState({
            isOpen: false,
        });

        // useExternalListener directly from OWL
        useExternalListener(window, "click", (ev) => {
            if (this.state.isOpen && this.rootRef.el && !this.rootRef.el.contains(ev.target)) {
                this.state.isOpen = false;
            }
        });
    }

    get isVisible() {
        return session.fast_devtools ? session.fast_devtools.enable_updater : false;
    }

    get availableProfiles() {
        return session.fast_devtools ? (session.fast_devtools.profiles || []) : [];
    }

    async onMainClick() {
        const profiles = this.availableProfiles;
        if (profiles.length === 1) {
            await this.onUpdateClick(profiles[0].id);
        } else {
            this.state.isOpen = !this.state.isOpen;
        }
    }

    async onUpdateClick(profileId) {
        this.state.isOpen = false;
        try {
            const result = await this.orm.call("updater.profile", "trigger_systray_update", [profileId]);
            if (result.status === "error") {
                this.notification.add(result.message, {
                    title: "Updater Error",
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