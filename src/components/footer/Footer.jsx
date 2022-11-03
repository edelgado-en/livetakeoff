
import { Link } from "react-router-dom";
import logo from '../../images/logo_2618936_web.png'

const Footer = () => {
    return (
      <div className="border-t border-slate-900/5 py-8">
        <img
            className="block h-14 w-auto text-center mx-auto"
            src={logo}
            alt="Livetakeoff logo"
        /> 
        <p className="mt-2 text-center text-sm leading-6 text-slate-500">&#169; 2022 Livetakeoff. All rights reserved.</p>
        <div className="mt-6 flex items-center justify-center space-x-4 text-sm font-medium leading-6 text-slate-700">
            <Link to="/privacy-policy">Privacy policy</Link>
            <div class="h-4 w-px bg-slate-500/20"></div>
            <Link to="/changelog">Changelog</Link>
        </div>
      </div>
    )
}

export default Footer;