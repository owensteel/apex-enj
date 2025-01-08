/*

    DNA

*/

const demoDnaSequence = {
    role: "root",
    offshoots: [
        {
            role: "appendage",
            offshoots: []
        },
        {
            role: "appendage",
            offshoots: [
                {
                    role: "appendage",
                    offshoots: []
                }
            ]
        },
        {
            role: "appendage",
            offshoots: [
                {
                    role: "appendage",
                    offshoots: []
                },
                {
                    role: "appendage",
                    offshoots: []
                },
                {
                    role: "appendage",
                    offshoots: []
                }
            ],
            detach: true
        }
    ]
}

function createNode(parentNode = null) {
    const node = {
        role: null,
        offshoots: []
    }

    // TODO
    node.role = "appendage"

    if (node.role == "color") {
        if (parentNode && parentNode.offshoots.some(obj => obj.role === "color")) {
            // Cannot be defined twice
            alert("This node already has a color defined.")
            return createNode(parentNode)
        }
        node.value = prompt("Node value?")
    }

    if (node.role == null) {
        // Invalid input
        return false
    }

    parentNode.offshoots.push(node)

    return node
}

export { createNode, demoDnaSequence }