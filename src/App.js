import { Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";
import SortingVisualiser from "./pages/SortingVisualiser";
import PathFindingVisualiser from "./pages/PathFindingVisualiser";


function App() {
  return (
    <div className="App">
      <Header/>
      <Routes>
        <Route path="/" element={<SortingVisualiser/>}/>
        <Route path="/pathFinding" element={<PathFindingVisualiser/>}/>
      </Routes>
      <Footer/>
    </div>
  );
}

export default App;
