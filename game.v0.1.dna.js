/*

    DNA Utils

*/

// Shuffle function for arrays
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Shuffle function for DNA color codes
function shuffleObjectValues(obj) {
    const values = shuffleArray(Object.values(obj));
    const keys = Object.keys(obj);
    const shuffledObj = {};
    keys.forEach((key, index) => {
        shuffledObj[key] = values[index];
    });
    return shuffledObj;
}

// DNA statics
const dnaColors = {
    0: "pink",
    10: "red",
    20: "orange",
    30: "yellow",
    40: "lightgreen",
    50: "green",
    60: "lightblue",
    70: "blue",
    80: "darkblue",
    90: "purple",
    100: "black"
};

const dnaRoles = shuffleArray([
    {
        type: "body",
        title: "color",
        values: ["red", "orange", "yellow", "lightgreen", "green", "blue", "purple"]
    },
    {
        type: "body",
        title: "edges",
        values: [3, 6, 8, 10, 12, 14, 16]
    },
    {
        type: "body",
        title: "move-style",
        values: ["float", "tail", "legs"]
    },
    {
        type: "body",
        title: "membrane",
    },
    {
        type: "body",
        title: "size",
        values: [1, 1.25, 1.5, 1.75, 2, 2.25, 2.5]
    },
    {
        type: "body",
        title: "spiky-ness"
    },
    {
        type: "body",
        title: "eyes",
        values: [1, 2, 3, 4, 5] // Number of eyes
    },
    {
        type: "system",
        title: "gravity resistance",
        values: ["low", "medium", "high"]
    },
    {
        type: "system",
        title: "energy-consumption",
        values: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
    },
    {
        type: "system",
        title: "aggression"
    },
]);

// DNA sequence (1D array)
function generateRandomDNASequence(presets = {}) {
    return dnaRoles.map(role => {
        let currentSet = 0;
        if (role.title in presets) {
            currentSet = presets[role.title]
        } else {
            if ("values" in role) {
                currentSet = Math.floor(Math.random() * role.values.length);
            } else {
                currentSet = Math.floor(Math.random() * 11) * 10;
            }
        }
        return {
            current: currentSet,
            colorCodes: shuffleObjectValues(dnaColors),
            role
        };
    });
}

function predictWinProbability(dnaSequence, winningDNASequences, losingDNASequences) {
    // Trait importance weights
    const weights = {
        edges: 0.2,                // Impacts shape (spiky vs smooth organisms)
        moveStyle: 0.175,           // Movement impacts combat behavior
        membrane: 0.1,             // Defensive trait
        size: 0.15,                // Affects durability and collision area
        spikiness: 0.15,           // Offensive capability in collisions
        eyes: 0.05,                // May influence perception (less significant for combat)
        gravityResistance: 0.1,    // Determines resistance to environmental effects
        energyConsumption: 0.2,    // Affects speed, power, and stamina tradeoffs
        aggression: 0.2           // Aggressiveness directly impacts strategy
    };

    // Helper function to encode categorical traits
    function encodeCategoricalTrait(value, categories) {
        return categories.indexOf(value);
    }

    // Helper function to extract traits from a DNA sequence
    function extractTraits(dna) {
        const traits = {
            edges: 0,
            moveStyle: -1,
            membrane: 0,
            size: 0,
            spikiness: 0,
            eyes: 0,
            gravityResistance: -1,
            energyConsumption: 0,
            aggression: 0
        };

        dna.forEach((gene) => {
            switch (gene.role.title) {
                case "edges":
                    traits.edges = gene.role.values[gene.current];
                    break;
                case "move-style":
                    traits.moveStyle = encodeCategoricalTrait(gene.role.values[gene.current], ["float", "tail", "legs"]);
                    break;
                case "membrane":
                    traits.membrane = gene.current / 100; // Normalize membrane to 0-1
                    break;
                case "size":
                    traits.size = gene.role.values[gene.current];
                    break;
                case "spiky-ness":
                    traits.spikiness = gene.current / 100; // Normalize spikiness to 0-1
                    break;
                case "eyes":
                    traits.eyes = gene.role.values[gene.current];
                    break;
                case "gravity resistance":
                    traits.gravityResistance = encodeCategoricalTrait(gene.role.values[gene.current], ["low", "medium", "high"]);
                    break;
                case "energy-consumption":
                    traits.energyConsumption = gene.role.values[gene.current] / 100; // Normalize to 0-1
                    break;
                case "aggression":
                    traits.aggression = gene.current / 100; // Normalize aggression to 0-1
                    break;
            }
        });

        return traits;
    }

    // Extract traits from the given DNA sequence
    const targetTraits = extractTraits(dnaSequence);

    // Function to calculate similarity score
    function calculateSimilarityScore(targetTraits, comparisonTraits) {
        let similarity = 0;
        Object.keys(weights).forEach((trait) => {
            if (trait === "moveStyle" || trait === "gravityResistance") {
                // For categorical traits, use direct match scoring
                similarity += weights[trait] * (targetTraits[trait] === comparisonTraits[trait] ? 1 : 0);
            } else {
                // For numerical traits, calculate weighted similarity
                similarity += weights[trait] * (1 - Math.abs(targetTraits[trait] - comparisonTraits[trait]));
            }
        });
        return similarity;
    }

    // Handle empty datasets
    if (winningDNASequences.length === 0 && losingDNASequences.length === 0) {
        return 50.0; // Neutral probability when no data is available
    } else if (winningDNASequences.length === 0) {
        return 0.0; // No evidence of similarity to winners
    } else if (losingDNASequences.length === 0) {
        return 100.0; // No evidence of similarity to losers
    }

    // Calculate average similarity scores for winning and losing DNA
    let totalWinningScore = 0;
    winningDNASequences.forEach((winningDNA) => {
        const winningTraits = extractTraits(winningDNA);
        totalWinningScore += calculateSimilarityScore(targetTraits, winningTraits);
    });
    const avgWinningScore = totalWinningScore / winningDNASequences.length;

    let totalLosingScore = 0;
    losingDNASequences.forEach((losingDNA) => {
        const losingTraits = extractTraits(losingDNA);
        totalLosingScore += calculateSimilarityScore(targetTraits, losingTraits);
    });
    const avgLosingScore = totalLosingScore / losingDNASequences.length;

    // Combine scores into a final probability
    const totalScore = avgWinningScore + avgLosingScore;
    const probability = avgWinningScore / totalScore;

    // Return a percentage
    return Math.min(Math.max(probability * 100, 0), 100).toFixed(2);
}

function generateFromPrediction(winningDnaSequences, losingDnaSequences) {
    const generated = {}
    let bestProb = 0;

    console.log("Generating...")

    const minProb = 50
    while (bestProb < minProb) {
        for (let i = 0; i < 10; i++) {
            const currentDnaGeneration = generateRandomDNASequence()
            const winningProbability = Math.round(
                predictWinProbability(
                    currentDnaGeneration,
                    winningDnaSequences,
                    losingDnaSequences
                )
            )
            generated[winningProbability] = currentDnaGeneration
        }
        const probsSorted = Object.keys(generated).sort((a, b) => { return parseInt(a) - parseInt(b); })
        bestProb = probsSorted.pop()
    }

    const bestDnaGeneration = generated[bestProb]

    console.log(`Generated sequence with ${bestProb}% probability of winning (${Object.keys(generated).length} total generations)`)
    return bestDnaGeneration
}

export { generateRandomDNASequence, generateFromPrediction }