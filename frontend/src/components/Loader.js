import '../styles/Loader.css';
const Loader = () => {
    return (
      <div className="flex justify-center items-center py-4">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-600"></div>
      </div>
    )
  }
  
  export default Loader
  
  