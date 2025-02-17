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

## Deployment on GitHub Pages

### Method 1: Project Site (Recommended for Multiple Projects)
1. Create a new repository named `algorithm-visualizer`
2. Push your code to this repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/algorithm-visualizer.git
   git push -u origin main
   ```
3. Go to repository Settings > Pages
4. Under "Source", select "main" branch
5. Your site will be available at: `https://yourusername.github.io/algorithm-visualizer`

### Method 2: User/Organization Site
If you want to host multiple projects under your GitHub Pages:

1. Create a repository named `yourusername.github.io`
2. Create a subdirectory for this project:
   ```bash
   mkdir -p projects/algorithm-visualizer
   cp -r algorithm-visualizer/* projects/algorithm-visualizer/
   ```
3. Update all relative paths in HTML files to include the project path:
   ```html
   <!-- Update paths from -->
   <link rel="stylesheet" href="css/styles.css">
   <!-- to -->
   <link rel="stylesheet" href="/projects/algorithm-visualizer/css/styles.css">
   ```
4. Push to GitHub:
   ```bash
   git add .
   git commit -m "Add algorithm visualizer"
   git push
   ```
5. Your site will be available at: `https://yourusername.github.io/projects/algorithm-visualizer`

### Project Structure for Multiple GitHub Pages Projects
```
yourusername.github.io/
├── index.html              # Main portfolio/projects page
├── projects/
│   ├── algorithm-visualizer/
│   │   ├── index.html
│   │   ├── css/
│   │   ├── js/
│   │   └── ...
│   ├── project2/
│   │   └── ...
│   └── project3/
│       └── ...
└── README.md
```

### Tips for Managing Multiple Projects
1. **Consistent Navigation**: Add navigation links between projects
2. **Central Portfolio**: Create an index page listing all projects
3. **Domain Setup**: You can use a custom domain for all projects
4. **Version Control**: 
   - Use separate repositories for each project (Method 1)
   - Or maintain all projects in one repository (Method 2)

### Common Issues and Solutions
1. **Broken Links**: Ensure all resource paths are correct
   - Use relative paths from project root
   - Or use absolute paths from domain root
2. **404 Errors**: Add a custom 404 page
3. **Path Issues**: Update `base` tag in HTML:
   ```html
   <base href="/algorithm-visualizer/">
   ```

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