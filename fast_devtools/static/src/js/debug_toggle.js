/** @odoo-module **/
import { registry } from "@web/core/registry";
import { Component, useState } from "@odoo/owl";
import { session } from "@web/session";

export class SystrayDebugToggle extends Component {
    setup() {
        // State to control the dropdown visibility
        this.state = useState({ isOpen: false });
    }

    // Returns an array of enabled debug modes based on General Settings
    get activeModes() {
        const config = session.fast_devtools || {};
        const modes = [];
        if (config.debug_1) modes.push({ id: '1', label: 'Normal Debug', val: '1' });
        if (config.debug_assets) modes.push({ id: 'assets', label: 'Assets Debug', val: 'assets' });
        if (config.debug_tests) modes.push({ id: 'tests', label: 'Tests Debug', val: 'assets,tests' });
        return modes;
    }

    // Checks if we need to show a dropdown (more than 1 option enabled)
    get isMultiple() {
        return this.activeModes.length > 1;
    }

    // Gets the current debug value from the URL
    get currentDebug() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('debug');
    }

    // Handles the click on the main Systray button
    toggleAction() {
        if (this.isMultiple) {
            // Toggle dropdown
            this.state.isOpen = !this.state.isOpen;
        } else {
            // Directly toggle the only available mode
            const modes = this.activeModes;
            if (modes.length === 1) {
                this.setDebug(modes[0].val);
            }
        }
    }

    // Applies or removes the debug parameter and reloads
    setDebug(modeVal) {
        const url = new URL(window.location.href);
        const current = url.searchParams.get('debug');
        
        if (current === modeVal) {
            // Disable if it's already active
            url.searchParams.delete('debug');
        } else {
            // Enable the selected mode
            url.searchParams.set('debug', modeVal);
        }
        window.location.href = url.toString();
    }
}
SystrayDebugToggle.template = "fast_devtools.SystrayDebug";

registry.category("systray").add("fast_devtools.debug", { Component: SystrayDebugToggle }, { sequence: 101 });