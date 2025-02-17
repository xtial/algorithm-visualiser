# Algorithm Visualizer

A comprehensive web-based tool for visualizing and understanding algorithms and data structures. This interactive platform helps users learn through visual animations, step-by-step explanations, and detailed algorithm analysis.

## Features

### Sorting Algorithms
- **Bubble Sort** - Simple comparison-based sorting
- **Quick Sort** - Efficient divide-and-conquer sorting
- **Merge Sort** - Stable divide-and-conquer sorting
- **Insertion Sort** - Adaptive sorting algorithm
- **Selection Sort** - In-place comparison sorting
- **Heap Sort** - Comparison-based sorting using binary heap

### Searching Algorithms
- **Binary Search** - Efficient search in sorted arrays
- **Linear Search** - Simple sequential search

### Graph Algorithms
- **Dijkstra's Algorithm** - Shortest path finding
- **Breadth First Search (BFS)** - Level-order traversal
- **Depth First Search (DFS)** - Deep traversal
- **Prim's Algorithm** - Minimum Spanning Tree
- **Kruskal's Algorithm** - Minimum Spanning Tree

### Tree Algorithms
- **Inorder Traversal** - Left-Root-Right
- **Preorder Traversal** - Root-Left-Right
- **Postorder Traversal** - Left-Right-Root
- **BST Operations** - Binary Search Tree operations
- **AVL Tree** - Self-balancing BST operations

### Interactive Features
- Real-time visualization of algorithm execution
- Step-by-step execution with explanations
- Adjustable animation speed
- Custom input data support
- Performance metrics tracking
- Keyboard shortcuts for control

### Educational Resources
- Detailed algorithm explanations
- Time and space complexity analysis
- Mathematical formulas and proofs
- Pseudocode implementations
- Visual examples and use cases

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/xtial/algorithm-visualizer.git
   ```

2. Navigate to the project directory:
   ```bash
   cd algorithm-visualizer
   ```

3. Open `index.html` in your web browser to start using the visualizer.

## Usage Guide

### Basic Controls
- **Space** - Start/Pause visualization
- **N** - Generate new data
- **←/→** - Step through algorithm
- **R** - Reset visualization

### Data Input
1. **Array Data**
   - Enter comma-separated numbers
   - Example: `5,3,8,1,9`

2. **Graph Data**
   - Enter edges in format: `source,target,weight`
   - Example:
     ```
     0,1,4
     1,2,3
     2,0,5
     ```

3. **Tree Data**
   - Enter comma-separated numbers for BST/AVL
   - Numbers will be inserted in BST order
   - Example: `5,3,7,1,4,6,8`

### Visualization Options
- Adjust speed using the speed slider
- Modify data size using the size slider
- View current step description
- Monitor performance metrics

## Project Structure

```
algorithm-visualizer/
├── index.html              # Main application page
├── algorithm-explanations.html  # Detailed algorithm documentation
├── css/
│   └── styles.css         # Styling and themes
├── js/
│   ├── algorithms.js      # Algorithm implementations
│   ├── visualizer.js      # Visualization logic
│   └── main.js           # Main application logic
└── README.md             # Project documentation
```

## Technical Details

### Visualization Components
- SVG-based graph visualization
- Canvas-based array visualization
- DOM-based tree visualization
- Real-time performance tracking
- Dynamic step descriptions

### Algorithm Implementation Features
- Modular algorithm design
- Comprehensive error handling
- Performance optimization
- Clear code documentation

## Contributing

1. Fork the repository
2. Create your feature branch:
   ```bash
   git checkout -b feature/YourFeature
   ```
3. Commit your changes:
   ```bash
   git commit -m 'Add some feature'
   ```
4. Push to the branch:
   ```bash
   git push origin feature/YourFeature
   ```
5. Open a Pull Request

### Contribution Guidelines
- Maintain consistent code style
- Add appropriate comments
- Include algorithm complexity analysis
- Update documentation
- Add tests if applicable

## Future Enhancements
- [ ] Additional algorithms
- [ ] Algorithm comparison tools
- [ ] Download/share visualizations
- [ ] Mobile responsiveness
- [ ] Dark/light theme toggle
- [ ] Multiple language support

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by various algorithm visualization tools
- Built with vanilla JavaScript for educational purposes
- Designed to be easily extensible
- Special thanks to algorithm visualization community

## Support

For support, questions, or feature requests, please:
1. Open an issue
2. Contact the maintainers
3. Check the documentation

---
Created with ❤️ for algorithm enthusiasts 