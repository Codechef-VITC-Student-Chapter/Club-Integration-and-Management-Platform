import './App.css'
import Admin_view from './Admin_view'
import file from './assets/Admin_view_file.png'

function App() {

  return (
    <>
    <div className='min-h-screen bg-blue-100'>
      <div className='flex'>
        <img src={file} alt="file-img" className='pl-4 pt-4 h-16' />
        <p className='pt-4 pl-6 font-semibold text-4xl'>Review Requests</p>

      </div>
      <Admin_view />
    </div>
      
    </>
  )
}

export default App
