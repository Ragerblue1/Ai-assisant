
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
// import UserContext from './context/UserContext.jsx'
import DataProvider from './Provider.jsx'

createRoot(document.getElementById('root')).render(
 <DataProvider>
    <App />
</DataProvider>
)
