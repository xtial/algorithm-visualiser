class Visualizer {
    constructor(container) {
        this.container = container;
        this.array = [];
        this.bars = [];
        this.speed = 50;
        this.isRunning = false;
        this.isPaused = false;
        this.currentStep = 0;
        this.steps = [];
        this.treeMode = false;
        this.graphMode = false;
        this.graphData = null;
        this.treeData = null;
    }

    initialize(size = 50) {
        this.array = Array.from({length: size}, () => Math.floor(Math.random() * 100) + 1);
        this.treeMode = false;
        this.graphMode = false;
        this.graphData = null;
        this.treeData = null;
        this.steps = [];
        this.currentStep = 0;
        this.isRunning = false;
        this.isPaused = false;
        this.createBars();
        return this.array;
    }

    setCustomData(data) {
        this.array = [...data];
        this.treeMode = false;
        this.graphMode = false;
        this.steps = [];
        this.currentStep = 0;
        this.isRunning = false;
        this.isPaused = false;
        this.createBars();
    }

    setGraphData(data) {
        if (!data) {
            console.error('No graph data provided');
            return;
        }

        try {
            // Parse graph data if it's in string format
            this.graphData = Array.isArray(data) ? data : 
                data.split('\n')
                    .filter(line => line.trim()) // Remove empty lines
                    .map(line => {
                        const [source, target, weight] = line.split(',').map(x => x.trim());
                        if (!source || !target || !weight) {
                            throw new Error('Invalid graph data format. Expected: source,target,weight');
                        }
                        return { 
                            source, 
                            target, 
                            weight: parseInt(weight),
                            directed: false // Default to undirected graphs
                        };
                    });

            if (this.graphData.length === 0) {
                throw new Error('Graph data is empty');
            }

            this.graphMode = true;
            this.treeMode = false;
            this.steps = [];
            this.currentStep = 0;
            this.isRunning = false;
            this.isPaused = false;
            this.createGraphVisualization();
        } catch (error) {
            console.error('Error parsing graph data:', error);
            // Set default graph data
            const defaultData = [
                { source: '0', target: '1', weight: 4, directed: false },
                { source: '1', target: '2', weight: 3, directed: false },
                { source: '2', target: '0', weight: 5, directed: false }
            ];
            this.graphData = defaultData;
            this.graphMode = true;
            this.treeMode = false;
            this.createGraphVisualization();
        }
    }

    setTreeData(data) {
        this.treeData = data;
        this.treeMode = true;
        this.graphMode = false;
        this.steps = [];
        this.currentStep = 0;
        this.isRunning = false;
        this.isPaused = false;
        this.createTreeVisualization(data);
    }

    createGraphVisualization() {
        this.container.innerHTML = '';
        if (!this.graphData) return;

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');
        svg.setAttribute('viewBox', '0 0 800 600');
        
        // Parse graph data if it's in string format
        const graphEdges = Array.isArray(this.graphData) ? this.graphData : 
            this.graphData.split('\n').map(line => {
                const [source, target, weight] = line.split(',').map(x => x.trim());
                return { 
                    source, 
                    target, 
                    weight: parseInt(weight),
                    directed: false // Default to undirected graphs
                };
            });

        // Create graph layout
        const nodes = new Set(graphEdges.map(edge => [edge.source, edge.target]).flat());
        const nodeArray = Array.from(nodes);
        const radius = 25;
        const centerX = 400;
        const centerY = 300;
        const graphRadius = Math.min(centerX, centerY) - radius * 2;

        // Position nodes in a circle
        const nodePositions = new Map();
        nodeArray.forEach((node, index) => {
            const angle = (index * 2 * Math.PI) / nodeArray.length;
            const x = centerX + graphRadius * Math.cos(angle);
            const y = centerY + graphRadius * Math.sin(angle);
            nodePositions.set(node, { x, y });
        });

        // Draw edges first (so they're behind nodes)
        graphEdges.forEach(edge => {
            const sourcePos = nodePositions.get(edge.source);
            const targetPos = nodePositions.get(edge.target);
            
            // Calculate edge path
            const dx = targetPos.x - sourcePos.x;
            const dy = targetPos.y - sourcePos.y;
            const angle = Math.atan2(dy, dx);
            
            // Adjust start and end points to account for node radius
            const startX = sourcePos.x + radius * Math.cos(angle);
            const startY = sourcePos.y + radius * Math.sin(angle);
            const endX = targetPos.x - radius * Math.cos(angle);
            const endY = targetPos.y - radius * Math.sin(angle);
            
            // Create edge line
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', startX);
            line.setAttribute('y1', startY);
            line.setAttribute('x2', endX);
            line.setAttribute('y2', endY);
            line.setAttribute('class', 'graph-edge');
            line.setAttribute('data-source', edge.source);
            line.setAttribute('data-target', edge.target);
            line.setAttribute('data-weight', edge.weight);
            
            // Add weight label
            const midX = (startX + endX) / 2;
            const midY = (startY + endY) / 2;
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', midX);
            text.setAttribute('y', midY);
            text.setAttribute('class', 'graph-edge-weight');
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('dominant-baseline', 'middle');
            text.textContent = edge.weight;
            
            svg.appendChild(line);
            svg.appendChild(text);
        });

        // Draw nodes on top of edges
        nodeArray.forEach(node => {
            const pos = nodePositions.get(node);
            
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', pos.x);
            circle.setAttribute('cy', pos.y);
            circle.setAttribute('r', radius);
            circle.setAttribute('class', 'graph-node');
            circle.setAttribute('data-node', node);
            
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', pos.x);
            text.setAttribute('y', pos.y);
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('dominant-baseline', 'middle');
            text.setAttribute('class', 'graph-node-text');
            text.textContent = node;
            
            svg.appendChild(circle);
            svg.appendChild(text);
        });

        this.container.appendChild(svg);
    }

    createBars() {
        this.container.innerHTML = '';
        const maxValue = Math.max(...this.array);
        const barWidth = (this.container.clientWidth / this.array.length) - 2;

        this.bars = this.array.map((value, index) => {
            const bar = document.createElement('div');
            bar.className = 'array-bar';
            bar.style.width = `${barWidth}px`;
            bar.style.height = `${(value / maxValue) * (this.container.clientHeight - 20)}px`;
            bar.style.left = `${index * (barWidth + 2)}px`;
            
            const label = document.createElement('div');
            label.className = 'value-label';
            label.textContent = value;
            bar.appendChild(label);
            
            this.container.appendChild(bar);
            return bar;
        });
    }

    createTreeVisualization(data) {
        this.container.innerHTML = '';
        this.treeMode = true;

        // Create BST from data
        const bst = new BinarySearchTree();
        data.forEach(value => bst.insert(value));

        const createNode = (node) => {
            if (!node) return null;

            const div = document.createElement('div');
            div.className = 'tree-node';
            
            const content = document.createElement('div');
            content.className = 'tree-node-content';
            content.textContent = node.value;
            content.dataset.value = node.value;
            
            div.appendChild(content);

            if (node.left || node.right) {
                const childrenContainer = document.createElement('div');
                childrenContainer.className = 'tree-node-children';
                
                const leftChild = createNode(node.left);
                const rightChild = createNode(node.right);
                
                if (leftChild) childrenContainer.appendChild(leftChild);
                if (rightChild) childrenContainer.appendChild(rightChild);
                
                div.appendChild(childrenContainer);
            }

            return div;
        };

        const treeRoot = createNode(bst.root);
        if (treeRoot) {
            this.container.appendChild(treeRoot);
        }
    }

    async updateVisualization(step) {
        if (this.isPaused) {
            return new Promise(resolve => {
                this.resumeResolve = resolve;
            });
        }

        // Adjust delay based on algorithm type and speed
        let delay = 1000 - (this.speed * 9);
        if (this.graphMode) {
            // Faster updates for graph algorithms to prevent freezing
            delay = Math.max(50, delay / 2);
        }

        await new Promise(resolve => setTimeout(resolve, delay));

        // Reset previous states before updating
        if (this.graphMode) {
            const svg = this.container.querySelector('svg');
            if (svg) {
                svg.querySelectorAll('.graph-node').forEach(node => {
                    node.classList.remove('visited', 'current', 'active');
                });
                svg.querySelectorAll('.graph-edge').forEach(edge => {
                    edge.classList.remove('active', 'highlight');
                });
            }
        }

        if (this.graphMode) {
            this.updateGraphVisualization(step);
        } else if (this.treeMode) {
            this.updateTreeVisualization(step);
        } else {
            this.updateArrayVisualization(step);
        }

        this.updateDescription(step.description);
    }

    updateArrayVisualization(step) {
        // Reset all bars to default state
        this.bars.forEach(bar => {
            bar.className = 'array-bar';
            bar.classList.add('transition-all', 'duration-300');
        });

        if (step.type === 'compare') {
            if (step.indices) {
                step.indices.forEach(index => {
                    this.bars[index].classList.add('comparing');
                });
            } else if (step.index !== undefined) {
                this.bars[step.index].classList.add('comparing');
            }
        } else if (step.type === 'swap' || step.type === 'merge') {
            const maxValue = Math.max(...step.array);
            step.array.forEach((value, index) => {
                this.bars[index].style.height = `${(value / maxValue) * (this.container.clientHeight - 20)}px`;
                this.bars[index].querySelector('.value-label').textContent = value;
            });
            
            if (step.indices) {
                step.indices.forEach(index => {
                    this.bars[index].classList.add('current');
                });
            }
        } else if (step.type === 'sorted') {
            this.bars[step.index].classList.add('sorted');
        }
    }

    updateTreeVisualization(step) {
        const nodes = this.container.querySelectorAll('.tree-node-content');
        nodes.forEach(node => {
            node.classList.remove('comparing', 'current', 'visited');
        });

        if (step.type === 'visit') {
            const node = Array.from(nodes).find(n => n.dataset.value === step.node.toString());
            if (node) {
                node.classList.add('current');
            }
        } else if (step.type === 'compare') {
            const node = Array.from(nodes).find(n => n.dataset.value === step.value.toString());
            if (node) {
                node.classList.add('comparing');
            }
        }
    }

    updateGraphVisualization(step) {
        const svg = this.container.querySelector('svg');
        if (!svg) return;

        try {
            // Store previous state
            const prevState = new Map();
            svg.querySelectorAll('.graph-node').forEach(node => {
                prevState.set(node.getAttribute('data-node'), {
                    classes: [...node.classList],
                    distance: node.getAttribute('data-distance'),
                    level: node.getAttribute('data-level'),
                    depth: node.getAttribute('data-depth')
                });
            });

            // Reset states
            svg.querySelectorAll('.graph-node').forEach(node => {
                node.classList.remove('visited', 'current', 'active');
            });
            svg.querySelectorAll('.graph-edge').forEach(edge => {
                edge.classList.remove('active', 'highlight');
            });

            switch (step.type) {
                case 'init':
                    if (step.node) {
                        const startNode = svg.querySelector(`[data-node="${step.node}"]`);
                        if (startNode) {
                            startNode.classList.add('current');
                        }
                    }
                    break;

                case 'visit':
                    const visitedNode = svg.querySelector(`[data-node="${step.node}"]`);
                    if (visitedNode) {
                        // Preserve previous visited nodes
                        svg.querySelectorAll('.graph-node.visited').forEach(node => {
                            node.classList.add('visited');
                        });
                        
                        visitedNode.classList.add('current');
                        const prevNodeState = prevState.get(step.node);
                        
                        if (step.distance !== undefined) {
                            visitedNode.setAttribute('data-distance', step.distance);
                        } else if (prevNodeState?.distance) {
                            visitedNode.setAttribute('data-distance', prevNodeState.distance);
                        }
                        
                        if (step.level !== undefined) {
                            visitedNode.setAttribute('data-level', step.level);
                        }
                        if (step.depth !== undefined) {
                            visitedNode.setAttribute('data-depth', step.depth);
                        }
                    }
                    break;

                case 'edge':
                    const edge = svg.querySelector(`line[data-source="${step.source}"][data-target="${step.target}"]`) ||
                                svg.querySelector(`line[data-source="${step.target}"][data-target="${step.source}"]`);
                    if (edge) {
                        edge.classList.add('active');
                    }
                    const sourceNode = svg.querySelector(`[data-node="${step.source}"]`);
                    const targetNode = svg.querySelector(`[data-node="${step.target}"]`);
                    if (sourceNode) sourceNode.classList.add('visited');
                    if (targetNode) targetNode.classList.add('current');
                    break;

                case 'check':
                case 'update':
                case 'backtrack':
                    // Handle these cases with existing logic
                    break;
            }
        } catch (error) {
            console.error('Error in updateGraphVisualization:', error);
            // Continue visualization even if there's an error
        }
    }

    updateDescription(description) {
        const descriptionElement = document.getElementById('step-description');
        if (descriptionElement) {
            descriptionElement.textContent = description;
        }
    }

    setSpeed(speed) {
        this.speed = speed;
    }

    pause() {
        this.isPaused = true;
    }

    async resume() {
        this.isPaused = false;
        if (this.resumeResolve) {
            this.resumeResolve();
            this.resumeResolve = null;
        }
    }

    reset() {
        this.isPaused = false;
        this.isRunning = false;
        if (this.resumeResolve) {
            this.resumeResolve();
            this.resumeResolve = null;
        }
        this.initialize(this.array.length);
    }

    async stepForward() {
        if (this.currentStep < this.steps.length) {
            await this.updateVisualization(this.steps[this.currentStep]);
            this.currentStep++;
        }
    }

    async stepBackward() {
        if (this.currentStep > 0) {
            this.currentStep--;
            // Replay from start to current step
            this.initialize(this.array.length);
            for (let i = 0; i <= this.currentStep; i++) {
                await this.updateVisualization(this.steps[i]);
            }
        }
    }

    async runAlgorithm(algorithmName, updateCallback) {
        if (this.isRunning) return;
        this.isRunning = true;
        this.isPaused = false;
        this.currentStep = 0;
        this.steps = [];
        let totalSteps = 0;

        const info = Algorithms.getAlgorithmInfo(algorithmName);
        this.updateAlgorithmInfo(info);

        try {
            // Handle graph algorithms
            if (['dijkstra', 'bfs', 'dfs', 'prim', 'kruskal'].includes(algorithmName)) {
                if (!this.graphData || !Array.isArray(this.graphData) || this.graphData.length === 0) {
                    throw new Error('No valid graph data available. Please input graph data first.');
                }

                // Ensure we're in graph mode and reset visualization
                this.graphMode = true;
                this.treeMode = false;
                this.createGraphVisualization();

                // Get the start node for algorithms that need it
                const startNode = this.graphData[0].source;

                // Execute algorithm and collect all steps first
                try {
                    switch (algorithmName) {
                        case 'dijkstra':
                            this.steps = await Algorithms.dijkstra(this.graphData, startNode, null);
                            break;
                        case 'bfs':
                            this.steps = await Algorithms.bfs(this.graphData, null);
                            break;
                        case 'dfs':
                            this.steps = await Algorithms.dfs(this.graphData, null);
                            break;
                        case 'prim':
                            this.steps = await Algorithms.prim(this.graphData, null);
                            break;
                        case 'kruskal':
                            this.steps = await Algorithms.kruskal(this.graphData, null);
                            break;
                    }

                    if (!this.steps || !Array.isArray(this.steps) || this.steps.length === 0) {
                        throw new Error('Algorithm did not generate any steps');
                    }

                    totalSteps = this.steps.length;
                    console.log(`Starting ${algorithmName} with ${totalSteps} steps`);

                    // Execute visualization steps with proper timing
                    for (let i = 0; i < this.steps.length; i++) {
                        if (!this.isRunning) break;
                        
                        if (this.isPaused) {
                            await new Promise(resolve => {
                                this.resumeResolve = resolve;
                            });
                        }
                        
                        this.currentStep = i;
                        try {
                            await this.updateVisualization(this.steps[i]);
                            if (updateCallback) updateCallback(this.steps[i]);
                            
                            // Log progress
                            if ((i + 1) % 5 === 0 || i === this.steps.length - 1) {
                                console.log(`${algorithmName}: Completed step ${i + 1}/${totalSteps}`);
                            }
                        } catch (error) {
                            console.error('Error during visualization step:', error);
                            continue;
                        }
                    }

                    // Mark completion
                    console.log(`${algorithmName} completed successfully!`);
                    this.updateDescription(`${algorithmName} completed! Total steps: ${totalSteps}`);
                } catch (error) {
                    console.error(`Error executing ${algorithmName}:`, error);
                    throw new Error(`Failed to execute ${algorithmName}: ${error.message}`);
                }
            } else {
                // Handle other algorithms (existing code)
                switch (algorithmName) {
                    case 'bubble':
                        this.steps = await Algorithms.bubbleSort([...this.array], updateCallback);
                        break;
                    case 'quick':
                        this.steps = await Algorithms.quickSort([...this.array], updateCallback);
                        break;
                    case 'merge':
                        this.steps = await Algorithms.mergeSort([...this.array], updateCallback);
                        break;
                    case 'insertion':
                        this.steps = await Algorithms.insertionSort([...this.array], updateCallback);
                        break;
                    case 'selection':
                        this.steps = await Algorithms.selectionSort([...this.array], updateCallback);
                        break;
                    case 'heap':
                        this.steps = await Algorithms.heapSort([...this.array], updateCallback);
                        break;
                    case 'binary':
                        const target = Math.floor(Math.random() * 100) + 1;
                        const sortedArray = [...this.array].sort((a, b) => a - b);
                        this.array = sortedArray;
                        this.createBars();
                        this.steps = await Algorithms.binarySearch(sortedArray, target, updateCallback);
                        break;
                    case 'linear':
                        const linearTarget = Math.floor(Math.random() * 100) + 1;
                        this.steps = await Algorithms.linearSearch([...this.array], linearTarget, updateCallback);
                        break;
                    case 'inorder':
                    case 'preorder':
                    case 'postorder': {
                        if (!this.treeData) {
                            // Create BST from current array if no tree data
                            const bst = new BinarySearchTree();
                            this.array.forEach(value => bst.insert(value));
                            this.treeData = this.array;
                        }
                        this.createTreeVisualization(this.treeData);
                        
                        const traversalType = algorithmName;
                        const bst = new BinarySearchTree();
                        this.treeData.forEach(value => bst.insert(value));
                        
                        switch (traversalType) {
                            case 'inorder':
                                this.steps = await bst.inorderTraversal(updateCallback);
                                break;
                            case 'preorder':
                                this.steps = await bst.preorderTraversal(updateCallback);
                                break;
                            case 'postorder':
                                this.steps = await bst.postorderTraversal(updateCallback);
                                break;
                        }
                        break;
                    }
                    case 'bst': {
                        if (!this.treeData) throw new Error('No tree data available');
                        const bst = new BinarySearchTree();
                        this.steps = await Algorithms.bstOperations(this.treeData, updateCallback);
                        break;
                    }
                    case 'avl': {
                        if (!this.treeData) throw new Error('No tree data available');
                        this.steps = await Algorithms.avlOperations(this.treeData, updateCallback);
                        break;
                    }
                }
            }
        } catch (error) {
            console.error('Algorithm execution failed:', error);
            this.updateDescription(`Algorithm failed: ${error.message}`);
            throw error;
        } finally {
            this.isRunning = false;
            this.isPaused = false;
        }
    }

    updateAlgorithmInfo(info) {
        if (!info) return;

        const descriptionElement = document.getElementById('algorithm-description');
        const timeComplexityElement = document.getElementById('time-complexity');
        const spaceComplexityElement = document.getElementById('space-complexity');

        if (descriptionElement) {
            descriptionElement.textContent = info.description;
        }
        if (timeComplexityElement) {
            timeComplexityElement.textContent = info.timeComplexity;
        }
        if (spaceComplexityElement) {
            spaceComplexityElement.textContent = info.spaceComplexity;
        }
    }
} 