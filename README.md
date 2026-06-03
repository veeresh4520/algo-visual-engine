# AlgoLab

AlgoLab is an interactive algorithm learning web app built with React and Vite. It helps users visualize sorting algorithms, compare their behavior side by side, and understand the difference between List and Set operations.

## Features

- Sorting visualizer with animated step-by-step bars
- Side-by-side comparison of two sorting algorithms
- Supported algorithms:
  - Bubble Sort
  - Selection Sort
  - Insertion Sort
  - Merge Sort
  - Quick Sort
  - Heap Sort
  - Radix Sort
- Custom array input and random array generation
- Adjustable animation speed
- List vs Set analyzer for:
  - Membership checking
  - Duplicate removal
  - Common element detection
- Theory panel with time complexity, space complexity, and sample code
- Dark and light mode UI

## Tech Stack

- React
- Vite
- JavaScript
- CSS
- Node.js and npm

## Project Structure

```text
algolab
├── package.json
├── README.md
└── frontend
    ├── package.json
    ├── vite.config.js
    └── src
        ├── App.jsx
        ├── main.jsx
        ├── components
        ├── styles
        └── utils
```

## Requirements

Install these before running the project:

- Node.js
- npm

You can check whether they are installed with:

```bash
node -v
npm -v
```

## How to Run

Open a terminal in the project root folder:

```bash
cd "algolab - Copy"
```

Install dependencies:

```bash
npm install
npm run install:frontend
```

Start the development server:

```bash
npm run dev
```

Then open the local URL shown in the terminal. For this project, it is configured as:

```text
http://localhost:3000
```

## Build for Production

To create a production build:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

## API Note

The frontend is configured to call an API at:

```text
http://localhost:5000
```

These API endpoints are used for performance metrics:

```text
POST /sort
POST /list-vs-set
```

If the backend is not running, the visual animations and UI will still load, but metric results may show an API error.

You can change the API URL by creating an environment file inside the `frontend` folder:

```text
frontend/.env
```

Example:

```env
VITE_API_URL=http://localhost:5000
```

## GitHub Upload Tip

Before uploading to GitHub, do not include dependency or build output folders such as:

```text
node_modules
frontend/node_modules
frontend/dist
```

Add a `.gitignore` file if your repository does not already have one.

## License

This project is for learning and educational use.
