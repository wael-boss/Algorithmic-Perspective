import { Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";
import SortingVisualiser from "./pages/SortingVisualiser";


function App() {
  return (
    <div className="App">
      <Header/>
      <Routes>
        <Route path="/" element={<SortingVisualiser/>}/>
      </Routes>
      <Footer/>
    </div>
  );
}

export default App;
