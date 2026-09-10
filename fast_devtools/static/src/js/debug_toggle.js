/** @odoo-module **/
import { registry } from "@web/core/registry";
import { Component } from "@odoo/owl";
import { session } from "@web/session";

export class SystrayDebugToggle extends Component {
    get isVisible() {
        return session.fast_devtools ? session.fast_devtools.enable_debug : false;
    }

    get isDebugActive() {
        return window.location.search.includes('debug=1');
    }

    toggleDebug() {
        const url = new URL(window.location.href);
        if (this.isDebugActive) {
            url.searchParams.delete('debug');
        } else {
            url.searchParams.set('debug', '1');
        }
        window.location.href = url.toString();
    }
}
SystrayDebugToggle.template = "fast_devtools.SystrayDebug";

registry.category("systray").add("fast_devtools.debug", { Component: SystrayDebugToggle }, { sequence: 101 });