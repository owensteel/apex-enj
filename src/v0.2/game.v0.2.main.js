/*

    Main

    Central setup and execution of the game.

*/

import * as DNA from "./game.v0.2.dna";
import * as OrganismBuilderUI from "./game.v0.2.builder.ui";
import * as Organisms from "./game.v0.2.organisms"
import * as Combat from "./game.v0.2.combat"
import * as Levels from "./game.v0.2.levels"
import { cloneObject } from "./game.v0.2.utils";

// Init (temporary) combat toggle button
// TODO: remove, debugging only

const combatToggleButton = document.createElement("button");
combatToggleButton.innerHTML = "Toggle combat series"

// Init all

function init() {
    // Means builder UI is unhidden as default

    OrganismBuilderUI.toggleVisibility()

    // Init player

    const playerOrganism = Organisms.addOrganism(
        cloneObject(
            DNA.demoDnaSequence,
            /* shallow: */ false
            // Must not be shallow or demoDNA
            // will be a reference that may
            // get corrupted
        )
    )
    playerOrganism.isPlayer = true
    // TODO: remove, debugging only
    window.pO = playerOrganism

    // Init level

    const currentLevel = new Levels.Level()
    currentLevel.playerOrganism = playerOrganism
    // TODO: remove, debugging only
    window.cL = currentLevel

    // Init DNA renderer

    OrganismBuilderUI.init(playerOrganism)

    // Init combat button

    combatToggleButton.addEventListener("click", () => {
        Combat.toggleCombatSeries(currentLevel)
    })
    document.body.appendChild(combatToggleButton)

    // Export DNA button (temp)

    const dnaExportButton = document.createElement("button");
    dnaExportButton.onclick = () => {
        const dnaExported = playerOrganism.exportDNA()

        const txtArea = document.createElement("textarea")
        txtArea.innerHTML = dnaExported
        document.body.appendChild(txtArea)
    }
    dnaExportButton.innerHTML = "Export player DNA"
    document.body.appendChild(dnaExportButton)
}

export { init }