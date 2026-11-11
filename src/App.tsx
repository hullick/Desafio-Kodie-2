import { BrowserRouter, Route, Routes } from 'react-router'
import { CameraDenied } from './pages/CameraDenied'
import { Compare } from './pages/Compare'
import { Favorites } from './pages/Favorites'
import { Home } from './pages/Home'
import { NotFound } from './pages/NotFound'
import { Offline } from './pages/Offline'
import { ProductDetails } from './pages/ProductDetails'
import { Scanner } from './pages/Scanner'
import { ServerError } from './pages/ServerError'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/produto/:id" element={<ProductDetails />} />
        <Route path="/comparar" element={<Compare />} />
        <Route path="/favoritos" element={<Favorites />} />
        <Route path="/scanner" element={<Scanner />} />
        <Route path="/scanner/camera-negada" element={<CameraDenied />} />
        <Route path="/erro" element={<ServerError />} />
        <Route path="/sem-conexao" element={<Offline />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
