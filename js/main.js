document.addEventListener('DOMContentLoaded', () => {
    // Initialize the visualizer
    const visualizationArea = document.getElementById('visualization-area');
    const visualizer = new Visualizer(visualizationArea);
    
    // Get DOM elements
    const algorithmSelect = document.getElementById('algorithm-select');
    const generateArrayBtn = document.getElementById('generate-array');
    const startVisualizationBtn = document.getElementById('start-visualization');
    const speedControl = document.getElementById('speed-control');
    const sizeControl = document.getElementById('size-control');
    const timeElapsed = document.getElementById('time-elapsed');
    const operationCount = document.getElementById('operation-count');
    const arrayInput = document.getElementById('array-input');
    const graphInput = document.getElementById('graph-input');
    const treeInput = document.getElementById('tree-input');
    const graphDataInput = document.getElementById('graph-data');
    const treeDataInput = document.getElementById('tree-data');
    const applyGraphDataBtn = document.getElementById('apply-graph-data');
    const applyTreeDataBtn = document.getElementById('apply-tree-data');
    const sizeControlGroup = document.querySelector('.slider-control');

    // State management
    let isRunning = false;
    let isPaused = false;
    let startTime = 0;
    let operations = 0;
    let animationFrameId = null;
    
    // Algorithm-specific sizes
    const algorithmSizes = new Map();
    const defaultSizes = {
        'Sorting Algorithms': 50,
        'Searching Algorithms': 50,
        'Graph Algorithms': 5,
        'Tree Algorithms': 7
    };

    function getCurrentAlgorithmKey() {
        const type = getAlgorithmType();
        const algorithm = algorithmSelect.value;
        return `${type}-${algorithm}`;
    }

    function getDefaultSizeForType(type) {
        return defaultSizes[type] || 50;
    }

    function updateSizeControl() {
        const type = getAlgorithmType();
        const key = getCurrentAlgorithmKey();
        const defaultSize = getDefaultSizeForType(type);
        
        if (!algorithmSizes.has(key)) {
            algorithmSizes.set(key, defaultSize);
        }
        
        sizeControl.value = algorithmSizes.get(key);
        
        // Update size control range based on algorithm type
        if (type.includes('Graph')) {
            sizeControl.min = 3;
            sizeControl.max = 10;
        } else if (type.includes('Tree')) {
            sizeControl.min = 3;
            sizeControl.max = 15;
        } else {
            sizeControl.min = 5;
            sizeControl.max = 100;
        }
    }

    function updateTimer() {
        if (isRunning && !isPaused) {
            const elapsed = (Date.now() - startTime) / 1000;
            timeElapsed.textContent = elapsed.toFixed(2) + 's';
            animationFrameId = requestAnimationFrame(updateTimer);
        }
    }

    function resetTimer() {
        startTime = Date.now();
        timeElapsed.textContent = '0.00s';
        operations = 0;
        operationCount.textContent = '0';
    }

    function stopTimer() {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
        isRunning = false;
        isPaused = false;
    }

    function updateControlsState() {
        generateArrayBtn.disabled = isRunning && !isPaused;
        algorithmSelect.disabled = isRunning && !isPaused;
        sizeControl.disabled = isRunning && !isPaused;
        startVisualizationBtn.textContent = isPaused ? 'Resume' : (isRunning ? 'Pause' : 'Start Visualization');
    }

    function getAlgorithmType() {
        const selectedOption = algorithmSelect.selectedOptions[0];
        return selectedOption.parentElement.label;
    }

    function updateInputVisibility() {
        const type = getAlgorithmType();
        
        // Hide all inputs first
        arrayInput.style.display = 'none';
        graphInput.style.display = 'none';
        treeInput.style.display = 'none';
        sizeControlGroup.style.display = 'block';

        // Show relevant input based on algorithm type
        if (type.includes('Sorting') || type.includes('Searching')) {
            arrayInput.style.display = 'flex';
            generateArrayBtn.textContent = 'Generate New Array';
        } else if (type.includes('Graph')) {
            graphInput.style.display = 'flex';
            generateArrayBtn.textContent = 'Generate Random Graph';
            sizeControlGroup.style.display = 'none';
        } else if (type.includes('Tree')) {
            treeInput.style.display = 'flex';
            generateArrayBtn.textContent = 'Generate Random Tree';
            sizeControlGroup.style.display = 'none';
        }
    }

    function generateRandomGraph(nodeCount = 5) {
        const edges = [];
        for (let i = 0; i < nodeCount; i++) {
            const edgeCount = Math.floor(Math.random() * 3) + 1; // 1-3 edges per node
            for (let j = 0; j < edgeCount; j++) {
                const target = (i + 1 + Math.floor(Math.random() * (nodeCount - 1))) % nodeCount;
                const weight = Math.floor(Math.random() * 9) + 1;
                edges.push(`${i},${target},${weight}`);
            }
        }
        return edges.join('\n');
    }

    function generateRandomTree(nodeCount = 7) {
        const values = [];
        for (let i = 0; i < nodeCount; i++) {
            values.push(Math.floor(Math.random() * 100) + 1);
        }
        return values.join(',');
    }

    // Initialize with current size
    const initialSize = parseInt(sizeControl.value);
    visualizer.initialize(initialSize);

    // Event listeners for data input buttons
    const applyCustomDataBtn = document.getElementById('apply-custom-data');
    const customDataInput = document.getElementById('custom-data');

    applyCustomDataBtn.addEventListener('click', () => {
        const data = customDataInput.value
            .split(',')
            .map(x => parseInt(x.trim()))
            .filter(x => !isNaN(x));
        
        if (data.length > 0) {
            visualizer.setCustomData(data);
        }
    });

    applyGraphDataBtn.addEventListener('click', () => {
        const data = graphDataInput.value.trim();
        if (data) {
            visualizer.setGraphData(data);
        }
    });

    applyTreeDataBtn.addEventListener('click', () => {
        const data = treeDataInput.value
            .split(',')
            .map(x => parseInt(x.trim()))
            .filter(x => !isNaN(x));
        
        if (data.length > 0) {
            visualizer.setTreeData(data);
        }
    });

    // Event listeners
    generateArrayBtn.addEventListener('click', () => {
        const type = getAlgorithmType();
        const size = algorithmSizes.get(getCurrentAlgorithmKey()) || getDefaultSizeForType(type);
        
        if (type.includes('Graph')) {
            graphDataInput.value = generateRandomGraph(size);
            applyGraphDataBtn.click();
        } else if (type.includes('Tree')) {
            treeDataInput.value = generateRandomTree(size);
            applyTreeDataBtn.click();
        } else {
            stopTimer();
            visualizer.initialize(size);
        }
        updateControlsState();
    });

    startVisualizationBtn.addEventListener('click', async () => {
        const selectedAlgorithm = algorithmSelect.value;

        if (isPaused) {
            // Resume
            isPaused = false;
            isRunning = true;
            startTime = Date.now() - (parseFloat(timeElapsed.textContent) * 1000);
            updateTimer();
            await visualizer.resume();
        } else if (isRunning) {
            // Pause
            isPaused = true;
            visualizer.pause();
        } else {
            // Start new
            isRunning = true;
            isPaused = false;
            resetTimer();
            updateTimer();
            
            try {
                await visualizer.runAlgorithm(selectedAlgorithm, (step) => {
                    operations++;
                    operationCount.textContent = operations;
                });
            } catch (error) {
                console.error('Algorithm execution failed:', error);
            } finally {
                stopTimer();
            }
        }
        updateControlsState();
    });

    speedControl.addEventListener('input', (e) => {
        visualizer.setSpeed(parseInt(e.target.value));
    });

    sizeControl.addEventListener('input', (e) => {
        if (!isRunning || isPaused) {
            const size = parseInt(e.target.value);
            const key = getCurrentAlgorithmKey();
            algorithmSizes.set(key, size);
            
            const type = getAlgorithmType();
            if (type.includes('Graph')) {
                graphDataInput.value = generateRandomGraph(size);
                applyGraphDataBtn.click();
            } else if (type.includes('Tree')) {
                treeDataInput.value = generateRandomTree(size);
                applyTreeDataBtn.click();
            } else {
                visualizer.initialize(size);
            }
        }
    });

    // Initial algorithm info
    const initialInfo = Algorithms.getAlgorithmInfo(algorithmSelect.value);
    visualizer.updateAlgorithmInfo(initialInfo);

    algorithmSelect.addEventListener('change', () => {
        if (!isRunning || isPaused) {
            if (isPaused) {
                stopTimer();
                isPaused = false;
            }
            
            updateInputVisibility();
            updateSizeControl();
            
            const info = Algorithms.getAlgorithmInfo(algorithmSelect.value);
            visualizer.updateAlgorithmInfo(info);

            // Reset visualization based on algorithm type
            const type = getAlgorithmType();
            const size = algorithmSizes.get(getCurrentAlgorithmKey()) || getDefaultSizeForType(type);
            
            if (type.includes('Graph')) {
                graphDataInput.value = generateRandomGraph(size);
                applyGraphDataBtn.click();
            } else if (type.includes('Tree')) {
                treeDataInput.value = generateRandomTree(size);
                applyTreeDataBtn.click();
            } else {
                visualizer.initialize(size);
            }

            updateControlsState();
        }
    });

    // Handle keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === ' ' && (!isRunning || isPaused)) {
            e.preventDefault();
            startVisualizationBtn.click();
        } else if (e.key === 'n' && (!isRunning || isPaused)) {
            e.preventDefault();
            generateArrayBtn.click();
        } else if (e.key === 'r' && (!isRunning || isPaused)) {
            e.preventDefault();
            stopTimer();
            visualizer.reset();
            updateControlsState();
        } else if (e.key === 'ArrowLeft' && (!isRunning || isPaused)) {
            e.preventDefault();
            visualizer.stepBackward();
        } else if (e.key === 'ArrowRight' && (!isRunning || isPaused)) {
            e.preventDefault();
            visualizer.stepForward();
        }
    });

    // Add tooltips for controls
    const addTooltip = (element, text) => {
        element.title = text;
    };

    addTooltip(generateArrayBtn, 'Generate new data (N)');
    addTooltip(startVisualizationBtn, 'Start/Pause visualization (Space)');
    addTooltip(speedControl, 'Adjust animation speed');
    addTooltip(sizeControl, 'Adjust data size');

    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        if (!isRunning || isPaused) {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                const size = parseInt(sizeControl.value);
                visualizer.initialize(size);
            }, 250);
        }
    });

    // Initialize input visibility
    updateInputVisibility();

    // Initialize size control
    updateSizeControl();
}); 