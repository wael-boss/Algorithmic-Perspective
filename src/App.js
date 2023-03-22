import { Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import SortingVisualiser from "./pages/SortingVisualiser";


function App() {
  return (
    <div className="App">
      <Header/>
      <Routes>
        <Route path="/" element={<SortingVisualiser/>}/>
      </Routes>
    </div>
  );
}

export default App;
