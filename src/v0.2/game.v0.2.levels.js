/*

    Levels

*/

import * as Food from "./game.v0.2.food"
import * as Organisms from "./game.v0.2.organisms"
import { newDnaNodeFromImport } from "./game.v0.2.dna"
import { cloneObject } from "./game.v0.2.utils"
import { stageEdges3D } from "./game.v0.2.3d"

import importedEnemyDNA from "./preset_dna/default_enemies/1.json"

const foodRingRadius = 50
const foodRingNumOfItems = 6

class Level {
    constructor(presetSeed = null) {
        // Features
        this.plants = []
        this.food = []
        this.temperature = 0

        // Player (defined centrally)
        this.playerOrganism = null

        // Enemy values (to be initialised)
        this.enemyDna = null
        this.enemyOrganism = null

        this.init()
    }
    init() {
        // Enemy
        this.enemyDna = newDnaNodeFromImport(importedEnemyDNA)
        this.enemyOrganism = Organisms.addOrganism(
            cloneObject(this.enemyDna),
            {
                x: 0,
                y: stageEdges3D.top.right.y * 0.75
            }
        )

        // Initialise appearance
        this.enemyOrganism.mesh.rotation.z = Math.atan2(
            this.enemyOrganism.combatStartPos.x,
            -this.enemyOrganism.combatStartPos.y
        )

        // Selected food types
        const foodTypesInLevel = [
            Food.FOOD_SEQ_TYPE_B,
            Food.FOOD_SEQ_TYPE_E
        ]

        // Rings of food around organisms
        foodTypesInLevel.forEach((foodTypeId, fI) => {
            // One ring per food type
            const ringRadius = foodRingRadius * (fI + 1)
            for (let rI = 0; rI < foodRingNumOfItems; rI++) {
                const foodStartPos = {
                    x: Math.cos(
                        rI * (Math.PI / (foodRingNumOfItems / 2))
                    ) * ringRadius,
                    y: Math.sin(
                        rI * (Math.PI / (foodRingNumOfItems / 2))
                    ) * ringRadius
                }
                const foodItem = Food.createFood(
                    foodStartPos, foodTypeId
                )
                foodItem.velocity.x = Food.foodVelocity * Math.sign(foodStartPos.x)
                foodItem.velocity.y = Food.foodVelocity * Math.sign(foodStartPos.y)

                this.food.push(foodItem)
            }
        })
    }
}

export { Level }