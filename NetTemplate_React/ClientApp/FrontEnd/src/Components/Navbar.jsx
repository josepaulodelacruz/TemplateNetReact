import { Sidebar } from 'lucide-react'

const Navbar = ({
  title = "", 
  children = null,
}) => {

  return (
    <nav className="w-full shadow-2xs bg-white pl-3 py-5">
      <div className="flex flex-row">
        <Sidebar className='cursor-pointer'/>
        <h2 className="font-normal pl-2">{title}</h2>
      </div>
      {children}
    </nav>

  )
}

export default Navbar;
