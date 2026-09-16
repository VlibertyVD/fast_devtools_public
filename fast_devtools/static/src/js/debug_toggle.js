/** @odoo-module **/
import { registry } from "@web/core/registry";
import { Component, useState, useRef, useExternalListener } from "@odoo/owl";
import { session } from "@web/session";

export class SystrayDebugToggle extends Component {
    setup() {
        this.rootRef = useRef("root");
        this.state = useState({ isOpen: false });

        // Close dropdown when clicking anywhere outside this component
        useExternalListener(window, "click", (ev) => {
            if (this.state.isOpen && this.rootRef.el && !this.rootRef.el.contains(ev.target)) {
                this.state.isOpen = false;
            }
        });
    }

    get activeModes() {
        const config = session.fast_devtools || {};
        const modes = [];
        if (config.debug_1) modes.push({ id: '1', label: 'Normal Debug', val: '1' });
        if (config.debug_assets) modes.push({ id: 'assets', label: 'Assets Debug', val: 'assets' });
        if (config.debug_tests) modes.push({ id: 'tests', label: 'Tests Debug', val: 'assets,tests' });
        return modes;
    }

    get isMultiple() {
        return this.activeModes.length > 1;
    }

    get currentDebug() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('debug');
    }

    toggleAction() {
        if (this.isMultiple) {
            this.state.isOpen = !this.state.isOpen;
        } else {
            const modes = this.activeModes;
            if (modes.length === 1) {
                this.setDebug(modes[0].val);
            }
        }
    }

    setDebug(modeVal) {
        this.state.isOpen = false;
        const url = new URL(window.location.href);
        const current = url.searchParams.get('debug');
        
        if (current === modeVal) {
            url.searchParams.delete('debug');
        } else {
            url.searchParams.set('debug', modeVal);
        }
        window.location.href = url.toString();
    }
}
SystrayDebugToggle.template = "fast_devtools.SystrayDebug";

registry.category("systray").add("fast_devtools.debug", { Component: SystrayDebugToggle }, { sequence: 101 });