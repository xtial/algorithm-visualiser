class Algorithms {
    static async bubbleSort(array, updateFn) {
        const n = array.length;
        let steps = [];
        
        for (let i = 0; i < n - 1; i++) {
            for (let j = 0; j < n - i - 1; j++) {
                steps.push({
                    type: 'compare',
                    indices: [j, j + 1],
                    description: `Comparing elements at positions ${j} and ${j + 1}`
                });
                
                if (array[j] > array[j + 1]) {
                    // Swap elements
                    [array[j], array[j + 1]] = [array[j + 1], array[j]];
                    steps.push({
                        type: 'swap',
                        indices: [j, j + 1],
                        array: [...array],
                        description: `Swapping elements ${array[j]} and ${array[j + 1]}`
                    });
                }
                
                if (updateFn) {
                    await updateFn(steps[steps.length - 1]);
                }
            }
            
            steps.push({
                type: 'sorted',
                index: n - i - 1,
                description: `Element ${array[n - i - 1]} is now in its sorted position`
            });
        }
        
        return steps;
    }

    static async quickSort(array, updateFn, start = 0, end = array.length - 1) {
        if (start >= end) return;

        let steps = [];
        let pivot = array[end];
        let i = start - 1;

        steps.push({
            type: 'pivot',
            index: end,
            description: `Choosing pivot element: ${pivot}`
        });

        for (let j = start; j < end; j++) {
            steps.push({
                type: 'compare',
                indices: [j, end],
                description: `Comparing element ${array[j]} with pivot ${pivot}`
            });

            if (array[j] < pivot) {
                i++;
                [array[i], array[j]] = [array[j], array[i]];
                steps.push({
                    type: 'swap',
                    indices: [i, j],
                    array: [...array],
                    description: `Swapping elements ${array[i]} and ${array[j]}`
                });
            }

            if (updateFn) {
                await updateFn(steps[steps.length - 1]);
            }
        }

        [array[i + 1], array[end]] = [array[end], array[i + 1]];
        steps.push({
            type: 'swap',
            indices: [i + 1, end],
            array: [...array],
            description: `Placing pivot ${pivot} in its correct position`
        });

        if (updateFn) {
            await updateFn(steps[steps.length - 1]);
        }

        await this.quickSort(array, updateFn, start, i);
        await this.quickSort(array, updateFn, i + 2, end);

        return steps;
    }

    static async mergeSort(array, updateFn, start = 0, end = array.length - 1) {
        if (start >= end) return;

        const mid = Math.floor((start + end) / 2);
        await this.mergeSort(array, updateFn, start, mid);
        await this.mergeSort(array, updateFn, mid + 1, end);
        await this.merge(array, start, mid, end, updateFn);
    }

    static async merge(array, start, mid, end, updateFn) {
        const left = array.slice(start, mid + 1);
        const right = array.slice(mid + 1, end + 1);
        let i = 0, j = 0, k = start;
        let steps = [];

        while (i < left.length && j < right.length) {
            steps.push({
                type: 'compare',
                indices: [start + i, mid + 1 + j],
                description: `Comparing elements ${left[i]} and ${right[j]}`
            });

            if (left[i] <= right[j]) {
                array[k] = left[i];
                i++;
            } else {
                array[k] = right[j];
                j++;
            }

            steps.push({
                type: 'merge',
                index: k,
                array: [...array],
                description: `Placing ${array[k]} in position ${k}`
            });

            if (updateFn) {
                await updateFn(steps[steps.length - 1]);
            }
            k++;
        }

        while (i < left.length) {
            array[k] = left[i];
            steps.push({
                type: 'merge',
                index: k,
                array: [...array],
                description: `Placing remaining left element ${left[i]} in position ${k}`
            });
            if (updateFn) {
                await updateFn(steps[steps.length - 1]);
            }
            i++;
            k++;
        }

        while (j < right.length) {
            array[k] = right[j];
            steps.push({
                type: 'merge',
                index: k,
                array: [...array],
                description: `Placing remaining right element ${right[j]} in position ${k}`
            });
            if (updateFn) {
                await updateFn(steps[steps.length - 1]);
            }
            j++;
            k++;
        }

        return steps;
    }

    static async binarySearch(array, target, updateFn) {
        let steps = [];
        let left = 0;
        let right = array.length - 1;

        while (left <= right) {
            const mid = Math.floor((left + right) / 2);
            
            steps.push({
                type: 'compare',
                index: mid,
                description: `Checking middle element ${array[mid]} at position ${mid}`
            });

            if (updateFn) {
                await updateFn(steps[steps.length - 1]);
            }

            if (array[mid] === target) {
                steps.push({
                    type: 'found',
                    index: mid,
                    description: `Found target ${target} at position ${mid}`
                });
                return steps;
            }

            if (array[mid] < target) {
                left = mid + 1;
                steps.push({
                    type: 'range',
                    left: left,
                    right: right,
                    description: `Target is in right half, searching positions ${left} to ${right}`
                });
            } else {
                right = mid - 1;
                steps.push({
                    type: 'range',
                    left: left,
                    right: right,
                    description: `Target is in left half, searching positions ${left} to ${right}`
                });
            }

            if (updateFn) {
                await updateFn(steps[steps.length - 1]);
            }
        }

        steps.push({
            type: 'notFound',
            description: `Target ${target} not found in array`
        });
        return steps;
    }

    static async insertionSort(array, updateFn) {
        const n = array.length;
        let steps = [];

        for (let i = 1; i < n; i++) {
            let key = array[i];
            let j = i - 1;

            steps.push({
                type: 'compare',
                indices: [i],
                description: `Current element: ${key}`
            });

            while (j >= 0 && array[j] > key) {
                steps.push({
                    type: 'compare',
                    indices: [j, j + 1],
                    description: `Comparing ${array[j]} with ${key}`
                });

                array[j + 1] = array[j];
                steps.push({
                    type: 'swap',
                    indices: [j, j + 1],
                    array: [...array],
                    description: `Moving ${array[j]} one position ahead`
                });

                if (updateFn) {
                    await updateFn(steps[steps.length - 1]);
                }
                j--;
            }

            array[j + 1] = key;
            steps.push({
                type: 'sorted',
                index: j + 1,
                description: `Placed ${key} in its correct position`
            });

            if (updateFn) {
                await updateFn(steps[steps.length - 1]);
            }
        }

        return steps;
    }

    static async selectionSort(array, updateFn) {
        const n = array.length;
        let steps = [];

        for (let i = 0; i < n - 1; i++) {
            let minIdx = i;

            steps.push({
                type: 'compare',
                indices: [i],
                description: `Finding minimum element starting from position ${i}`
            });

            for (let j = i + 1; j < n; j++) {
                steps.push({
                    type: 'compare',
                    indices: [minIdx, j],
                    description: `Comparing ${array[minIdx]} with ${array[j]}`
                });

                if (array[j] < array[minIdx]) {
                    minIdx = j;
                }

                if (updateFn) {
                    await updateFn(steps[steps.length - 1]);
                }
            }

            if (minIdx !== i) {
                [array[i], array[minIdx]] = [array[minIdx], array[i]];
                steps.push({
                    type: 'swap',
                    indices: [i, minIdx],
                    array: [...array],
                    description: `Swapping ${array[i]} with ${array[minIdx]}`
                });
            }

            steps.push({
                type: 'sorted',
                index: i,
                description: `Element ${array[i]} is now in its sorted position`
            });

            if (updateFn) {
                await updateFn(steps[steps.length - 1]);
            }
        }

        return steps;
    }

    static async heapSort(array, updateFn) {
        const n = array.length;
        let steps = [];

        // Build max heap
        for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
            await this.heapify(array, n, i, steps, updateFn);
        }

        // Extract elements from heap one by one
        for (let i = n - 1; i > 0; i--) {
            steps.push({
                type: 'swap',
                indices: [0, i],
                array: [...array],
                description: `Swapping root ${array[0]} with last element ${array[i]}`
            });

            [array[0], array[i]] = [array[i], array[0]];

            if (updateFn) {
                await updateFn(steps[steps.length - 1]);
            }

            steps.push({
                type: 'sorted',
                index: i,
                description: `Element ${array[i]} is now in its sorted position`
            });

            await this.heapify(array, i, 0, steps, updateFn);
        }

        return steps;
    }

    static async heapify(array, n, i, steps, updateFn) {
        let largest = i;
        const left = 2 * i + 1;
        const right = 2 * i + 2;

        steps.push({
            type: 'compare',
            indices: [i, left],
            description: `Comparing root ${array[i]} with left child ${array[left]}`
        });

        if (left < n && array[left] > array[largest]) {
            largest = left;
        }

        if (right < n) {
            steps.push({
                type: 'compare',
                indices: [largest, right],
                description: `Comparing ${array[largest]} with right child ${array[right]}`
            });

            if (array[right] > array[largest]) {
                largest = right;
            }
        }

        if (largest !== i) {
            steps.push({
                type: 'swap',
                indices: [i, largest],
                array: [...array],
                description: `Swapping ${array[i]} with ${array[largest]}`
            });

            [array[i], array[largest]] = [array[largest], array[i]];

            if (updateFn) {
                await updateFn(steps[steps.length - 1]);
            }

            await this.heapify(array, n, largest, steps, updateFn);
        }
    }

    static async linearSearch(array, target, updateFn) {
        let steps = [];

        for (let i = 0; i < array.length; i++) {
            steps.push({
                type: 'compare',
                index: i,
                description: `Checking element ${array[i]} at position ${i}`
            });

            if (updateFn) {
                await updateFn(steps[steps.length - 1]);
            }

            if (array[i] === target) {
                steps.push({
                    type: 'found',
                    index: i,
                    description: `Found target ${target} at position ${i}`
                });
                return steps;
            }
        }

        steps.push({
            type: 'notFound',
            description: `Target ${target} not found in array`
        });
        return steps;
    }

    static async dijkstra(graph, startNode, callback) {
        const steps = [];
        const nodes = new Set(graph.map(edge => [edge.source, edge.target]).flat());
        const distances = new Map();
        const previous = new Map();
        const unvisited = new Set(nodes);

        // Initialize distances
        nodes.forEach(node => {
            distances.set(node, node === startNode ? 0 : Infinity);
            previous.set(node, null);
        });

        steps.push({
            type: 'init',
            node: startNode,
            description: `Initializing distances: Start node ${startNode} = 0, all others = ∞`
        });

        while (unvisited.size > 0) {
            // Find node with minimum distance
            let currentNode = Array.from(unvisited)
                .reduce((min, node) => distances.get(node) < distances.get(min) ? node : min);

            if (distances.get(currentNode) === Infinity) {
                steps.push({
                    type: 'unreachable',
                    description: `Remaining nodes are unreachable from start node`
                });
                break;
            }

            steps.push({
                type: 'visit',
                node: currentNode,
                distance: distances.get(currentNode),
                description: `Visiting node ${currentNode} (distance: ${distances.get(currentNode)})`
            });

            unvisited.delete(currentNode);

            // Get all edges from current node
            const edges = graph.filter(edge => 
                edge.source === currentNode || (!edge.directed && edge.target === currentNode)
            );
            
            for (const edge of edges) {
                const neighbor = edge.source === currentNode ? edge.target : edge.source;
                const distance = distances.get(currentNode) + edge.weight;
                
                steps.push({
                    type: 'edge',
                    source: currentNode,
                    target: neighbor,
                    description: `Checking edge ${currentNode} -> ${neighbor} with weight ${edge.weight}`
                });

                if (distance < distances.get(neighbor)) {
                    distances.set(neighbor, distance);
                    previous.set(neighbor, currentNode);
                    steps.push({
                        type: 'update',
                        node: neighbor,
                        distance: distance,
                        description: `Updated distance to node ${neighbor}: ${distance}`
                    });
                }
            }
        }

        return steps;
    }

    static async bfs(graph, callback) {
        const steps = [];
        const nodes = new Set(graph.map(edge => [edge.source, edge.target]).flat());
        const visited = new Set();
        const queue = [];
        const startNode = Array.from(nodes)[0];
        queue.push({ node: startNode, level: 0 });

        steps.push({
            type: 'init',
            node: startNode,
            description: `Starting BFS from node ${startNode}`
        });

        while (queue.length > 0) {
            const { node: currentNode, level } = queue.shift();
            
            if (visited.has(currentNode)) continue;
            
            steps.push({
                type: 'visit',
                node: currentNode,
                level: level,
                description: `Visiting node ${currentNode} at level ${level}`
            });

            visited.add(currentNode);

            // Get all neighbors (consider undirected edges)
            const neighbors = graph
                .filter(edge => edge.source === currentNode || (!edge.directed && edge.target === currentNode))
                .map(edge => edge.source === currentNode ? edge.target : edge.source)
                .filter(neighbor => !visited.has(neighbor));

            for (const neighbor of neighbors) {
                queue.push({ node: neighbor, level: level + 1 });
                steps.push({
                    type: 'edge',
                    source: currentNode,
                    target: neighbor,
                    description: `Adding node ${neighbor} to queue at level ${level + 1}`
                });
            }
        }

        return steps;
    }

    static async dfs(graph, callback) {
        const steps = [];
        const nodes = new Set(graph.map(edge => [edge.source, edge.target]).flat());
        const visited = new Set();
        let depth = 0;

        const dfsVisit = (node, currentDepth) => {
            visited.add(node);
            
            steps.push({
                type: 'visit',
                node: node,
                depth: currentDepth,
                description: `Visiting node ${node} at depth ${currentDepth}`
            });

            // Get all neighbors (consider undirected edges)
            const neighbors = graph
                .filter(edge => edge.source === node || (!edge.directed && edge.target === node))
                .map(edge => edge.source === node ? edge.target : edge.source)
                .filter(neighbor => !visited.has(neighbor));

            for (const neighbor of neighbors) {
                steps.push({
                    type: 'edge',
                    source: node,
                    target: neighbor,
                    description: `Exploring edge ${node} -> ${neighbor}`
                });

                dfsVisit(neighbor, currentDepth + 1);
                
                steps.push({
                    type: 'backtrack',
                    node: node,
                    description: `Backtracking to node ${node}`
                });
            }
        };

        dfsVisit(Array.from(nodes)[0], 0);
        return steps;
    }

    static async prim(graph, callback) {
        const steps = [];
        const nodes = new Set(graph.map(edge => [edge.source, edge.target]).flat());
        const visited = new Set();
        const mst = [];
        const startNode = Array.from(nodes)[0];
        visited.add(startNode);

        steps.push({
            type: 'init',
            node: startNode,
            description: `Starting Prim's algorithm from node ${startNode}`
        });

        while (visited.size < nodes.size) {
            let minEdge = null;
            let minWeight = Infinity;

            // Find minimum weight edge from visited to unvisited nodes
            for (const edge of graph) {
                const isSourceVisited = visited.has(edge.source);
                const isTargetVisited = visited.has(edge.target);
                
                if ((isSourceVisited && !isTargetVisited) || (!edge.directed && isTargetVisited && !isSourceVisited)) {
                    steps.push({
                        type: 'check',
                        source: edge.source,
                        target: edge.target,
                        description: `Checking edge ${edge.source} -> ${edge.target} with weight ${edge.weight}`
                    });

                    if (edge.weight < minWeight) {
                        minWeight = edge.weight;
                        minEdge = edge;
                    }
                }
            }

            if (minEdge) {
                const newNode = visited.has(minEdge.source) ? minEdge.target : minEdge.source;
                visited.add(newNode);
                mst.push(minEdge);

                steps.push({
                    type: 'edge',
                    source: minEdge.source,
                    target: minEdge.target,
                    description: `Adding edge ${minEdge.source} -> ${minEdge.target} to MST (weight: ${minEdge.weight})`
                });
            }
        }

        return steps;
    }

    static async kruskal(graph, callback) {
        const steps = [];
        const nodes = new Set(graph.map(edge => [edge.source, edge.target]).flat());
        const sortedEdges = [...graph].sort((a, b) => a.weight - b.weight);
        const parent = new Map();
        const mst = [];

        // Initialize disjoint set
        nodes.forEach(node => parent.set(node, node));

        steps.push({
            type: 'init',
            description: `Starting Kruskal's algorithm with ${nodes.size} nodes`
        });

        function find(node) {
            if (parent.get(node) !== node) {
                parent.set(node, find(parent.get(node)));
            }
            return parent.get(node);
        }

        function union(node1, node2) {
            const root1 = find(node1);
            const root2 = find(node2);
            if (root1 !== root2) {
                parent.set(root2, root1);
                return true;
            }
            return false;
        }

        for (const edge of sortedEdges) {
            steps.push({
                type: 'check',
                source: edge.source,
                target: edge.target,
                description: `Checking edge ${edge.source} -> ${edge.target} with weight ${edge.weight}`
            });

            if (union(edge.source, edge.target)) {
                mst.push(edge);
                steps.push({
                    type: 'edge',
                    source: edge.source,
                    target: edge.target,
                    description: `Adding edge ${edge.source} -> ${edge.target} to MST (weight: ${edge.weight})`
                });
            } else {
                steps.push({
                    type: 'skip',
                    source: edge.source,
                    target: edge.target,
                    description: `Skipping edge ${edge.source} -> ${edge.target} (would create cycle)`
                });
            }
        }

        return steps;
    }

    static async bstOperations(data, callback) {
        const steps = [];
        const tree = new BinarySearchTree();

        // Insert nodes
        for (const value of data) {
            steps.push({
                type: 'visit',
                node: value,
                description: `Inserting node ${value}`
            });

            if (callback) callback(steps[steps.length - 1]);

            tree.insert(value);
        }

        // Perform some operations
        const searchValue = data[Math.floor(Math.random() * data.length)];
        const searchSteps = tree.search(searchValue);
        steps.push(...searchSteps.map(node => ({
            type: 'visit',
            node: node,
            description: `Searching for value ${searchValue}`
        })));

        return steps;
    }

    static async avlOperations(data, callback) {
        const steps = [];
        const tree = new AVLTree();

        // Insert nodes
        for (const value of data) {
            steps.push({
                type: 'visit',
                node: value,
                description: `Inserting node ${value}`
            });

            if (callback) callback(steps[steps.length - 1]);

            const rotationSteps = tree.insert(value);
            steps.push(...rotationSteps.map(step => ({
                type: 'visit',
                node: step.node,
                description: step.description
            })));
        }

        return steps;
    }

    static getAlgorithmInfo(algorithm) {
        const info = {
            bubble: {
                name: 'Bubble Sort',
                description: 'Bubble Sort is a simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.',
                timeComplexity: 'O(n²)',
                spaceComplexity: 'O(1)'
            },
            quick: {
                name: 'Quick Sort',
                description: 'Quick Sort is a divide-and-conquer algorithm that works by selecting a pivot element and partitioning the array around it.',
                timeComplexity: 'O(n log n)',
                spaceComplexity: 'O(log n)'
            },
            merge: {
                name: 'Merge Sort',
                description: 'Merge Sort is a divide-and-conquer algorithm that divides the array into two halves, sorts them, and then merges the sorted halves.',
                timeComplexity: 'O(n log n)',
                spaceComplexity: 'O(n)'
            },
            binary: {
                name: 'Binary Search',
                description: 'Binary Search is a search algorithm that finds the position of a target value within a sorted array by repeatedly dividing the search interval in half.',
                timeComplexity: 'O(log n)',
                spaceComplexity: 'O(1)'
            },
            insertion: {
                name: 'Insertion Sort',
                description: 'Insertion Sort builds the final sorted array one item at a time by repeatedly inserting a new element into the sorted portion of the array.',
                timeComplexity: 'O(n²)',
                spaceComplexity: 'O(1)'
            },
            selection: {
                name: 'Selection Sort',
                description: 'Selection Sort divides the array into a sorted and an unsorted region, and repeatedly selects the smallest element from the unsorted region to add to the sorted region.',
                timeComplexity: 'O(n²)',
                spaceComplexity: 'O(1)'
            },
            heap: {
                name: 'Heap Sort',
                description: 'Heap Sort uses a binary heap data structure to sort elements by first building a max heap and then repeatedly extracting the maximum element.',
                timeComplexity: 'O(n log n)',
                spaceComplexity: 'O(1)'
            },
            linear: {
                name: 'Linear Search',
                description: 'Linear Search sequentially checks each element in the array until a match is found or the end of the array is reached.',
                timeComplexity: 'O(n)',
                spaceComplexity: 'O(1)'
            },
            inorder: {
                name: 'Inorder Traversal',
                description: 'Inorder traversal visits the left subtree, then the root, and finally the right subtree.',
                timeComplexity: 'O(n)',
                spaceComplexity: 'O(h) where h is the height of the tree'
            },
            preorder: {
                name: 'Preorder Traversal',
                description: 'Preorder traversal visits the root first, then the left subtree, and finally the right subtree.',
                timeComplexity: 'O(n)',
                spaceComplexity: 'O(h) where h is the height of the tree'
            },
            postorder: {
                name: 'Postorder Traversal',
                description: 'Postorder traversal visits the left subtree, then the right subtree, and finally the root.',
                timeComplexity: 'O(n)',
                spaceComplexity: 'O(h) where h is the height of the tree'
            },
            dijkstra: {
                description: "Dijkstra's algorithm finds the shortest path between nodes in a graph, which may represent, for example, road networks.",
                timeComplexity: "O((V + E) log V) with binary heap",
                spaceComplexity: "O(V)"
            },
            bfs: {
                description: "Breadth-First Search explores a graph level by level, visiting all neighbors of a node before moving to the next level.",
                timeComplexity: "O(V + E)",
                spaceComplexity: "O(V)"
            },
            dfs: {
                description: "Depth-First Search explores a graph by going as deep as possible along each branch before backtracking.",
                timeComplexity: "O(V + E)",
                spaceComplexity: "O(V)"
            },
            prim: {
                description: "Prim's algorithm finds a minimum spanning tree for a weighted undirected graph.",
                timeComplexity: "O(E log V) with binary heap",
                spaceComplexity: "O(V)"
            },
            kruskal: {
                description: "Kruskal's algorithm finds a minimum spanning forest of an undirected edge-weighted graph.",
                timeComplexity: "O(E log E)",
                spaceComplexity: "O(V)"
            },
            bst: {
                description: "Binary Search Tree operations including insertion, deletion, and search.",
                timeComplexity: "O(h) where h is height",
                spaceComplexity: "O(n)"
            },
            avl: {
                description: "AVL Tree is a self-balancing binary search tree where the heights of the two child subtrees of any node differ by at most one.",
                timeComplexity: "O(log n)",
                spaceComplexity: "O(n)"
            }
        };
        return info[algorithm] || null;
    }
}

class BinarySearchTree {
    constructor() {
        this.root = null;
    }

    insert(value) {
        if (!this.root) {
            this.root = { value, left: null, right: null };
            return;
        }

        let current = this.root;
        while (true) {
            if (value < current.value) {
                if (!current.left) {
                    current.left = { value, left: null, right: null };
                    break;
                }
                current = current.left;
            } else {
                if (!current.right) {
                    current.right = { value, left: null, right: null };
                    break;
                }
                current = current.right;
            }
        }
    }

    search(value) {
        const steps = [];
        let current = this.root;

        while (current) {
            steps.push(current.value);
            if (value === current.value) {
                break;
            }
            current = value < current.value ? current.left : current.right;
        }

        return steps;
    }

    async inorderTraversal(callback) {
        const steps = [];
        
        const inorder = async (node) => {
            if (!node) return;
            
            await inorder(node.left);
            
            steps.push({
                type: 'visit',
                node: node.value,
                description: `Visiting node ${node.value} (inorder)`
            });
            if (callback) await callback(steps[steps.length - 1]);
            
            await inorder(node.right);
        };
        
        await inorder(this.root);
        return steps;
    }

    async preorderTraversal(callback) {
        const steps = [];
        
        const preorder = async (node) => {
            if (!node) return;
            
            steps.push({
                type: 'visit',
                node: node.value,
                description: `Visiting node ${node.value} (preorder)`
            });
            if (callback) await callback(steps[steps.length - 1]);
            
            await preorder(node.left);
            await preorder(node.right);
        };
        
        await preorder(this.root);
        return steps;
    }

    async postorderTraversal(callback) {
        const steps = [];
        
        const postorder = async (node) => {
            if (!node) return;
            
            await postorder(node.left);
            await postorder(node.right);
            
            steps.push({
                type: 'visit',
                node: node.value,
                description: `Visiting node ${node.value} (postorder)`
            });
            if (callback) await callback(steps[steps.length - 1]);
        };
        
        await postorder(this.root);
        return steps;
    }
}

class AVLTree {
    constructor() {
        this.root = null;
    }

    getHeight(node) {
        return node ? node.height : 0;
    }

    getBalance(node) {
        return node ? this.getHeight(node.left) - this.getHeight(node.right) : 0;
    }

    rightRotate(y) {
        const x = y.left;
        const T2 = x.right;

        x.right = y;
        y.left = T2;

        y.height = Math.max(this.getHeight(y.left), this.getHeight(y.right)) + 1;
        x.height = Math.max(this.getHeight(x.left), this.getHeight(x.right)) + 1;

        return x;
    }

    leftRotate(x) {
        const y = x.right;
        const T2 = y.left;

        y.left = x;
        x.right = T2;

        x.height = Math.max(this.getHeight(x.left), this.getHeight(x.right)) + 1;
        y.height = Math.max(this.getHeight(y.left), this.getHeight(y.right)) + 1;

        return y;
    }

    insert(value) {
        const steps = [];

        const insertRec = (node) => {
            if (!node) {
                return {
                    value,
                    left: null,
                    right: null,
                    height: 1
                };
            }

            steps.push({
                type: 'compare',
                node: node.value,
                description: `Comparing ${value} with ${node.value}`
            });

            if (value < node.value) {
                node.left = insertRec(node.left);
            } else if (value > node.value) {
                node.right = insertRec(node.right);
            } else {
                return node;
            }

            node.height = Math.max(this.getHeight(node.left), this.getHeight(node.right)) + 1;
            const balance = this.getBalance(node);

            // Left Left Case
            if (balance > 1 && value < node.left.value) {
                steps.push({
                    type: 'rotate',
                    node: node.value,
                    description: `Performing right rotation at ${node.value}`
                });
                return this.rightRotate(node);
            }

            // Right Right Case
            if (balance < -1 && value > node.right.value) {
                steps.push({
                    type: 'rotate',
                    node: node.value,
                    description: `Performing left rotation at ${node.value}`
                });
                return this.leftRotate(node);
            }

            // Left Right Case
            if (balance > 1 && value > node.left.value) {
                steps.push({
                    type: 'rotate',
                    node: node.left.value,
                    description: `Performing left rotation at ${node.left.value}`
                });
                node.left = this.leftRotate(node.left);
                steps.push({
                    type: 'rotate',
                    node: node.value,
                    description: `Performing right rotation at ${node.value}`
                });
                return this.rightRotate(node);
            }

            // Right Left Case
            if (balance < -1 && value < node.right.value) {
                steps.push({
                    type: 'rotate',
                    node: node.right.value,
                    description: `Performing right rotation at ${node.right.value}`
                });
                node.right = this.rightRotate(node.right);
                steps.push({
                    type: 'rotate',
                    node: node.value,
                    description: `Performing left rotation at ${node.value}`
                });
                return this.leftRotate(node);
            }

            return node;
        };

        this.root = insertRec(this.root);
        return steps;
    }

    search(value) {
        const steps = [];
        let current = this.root;

        while (current) {
            steps.push({
                type: 'visit',
                node: current.value,
                description: `Visiting node ${current.value}`
            });

            if (value === current.value) {
                steps.push({
                    type: 'found',
                    node: current.value,
                    description: `Found value ${value}`
                });
                break;
            }

            current = value < current.value ? current.left : current.right;
        }

        if (!current) {
            steps.push({
                type: 'notFound',
                description: `Value ${value} not found in tree`
            });
        }

        return steps;
    }
} 