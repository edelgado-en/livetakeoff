
import { Link } from "react-router-dom";
import logo from '../../images/logo_red-no-text.png'

import { useLocation } from "react-router-dom"

const navigation = {
    solutions: [
      { name: 'Marketing', href: '#' },
      { name: 'Analytics', href: '#' },
      { name: 'Commerce', href: '#' },
      { name: 'Insights', href: '#' },
    ],
    support: [
      { name: 'Pricing', href: '#' },
      { name: 'Documentation', href: '#' },
      { name: 'Guides', href: '#' },
      { name: 'API Status', href: '#' },
    ],
    company: [
      { name: 'About', href: '#' },
      { name: 'Blog', href: '#' },
      { name: 'Jobs', href: '#' },
      { name: 'Press', href: '#' },
      { name: 'Partners', href: '#' },
    ],
    legal: [
      { name: 'Claim', href: '#' },
      { name: 'Privacy', href: '#' },
      { name: 'Terms', href: '#' },
    ],
    social: [
      {
        name: 'Facebook',
        href: 'https://www.facebook.com/cleantakeoff/',
        icon: (props) => (
          <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
            <path
              fillRule="evenodd"
              d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
              clipRule="evenodd"
            />
          </svg>
        ),
      },
      {
        name: 'Instagram',
        href: 'https://www.instagram.com/cleantakeoff/',
        icon: (props) => (
          <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
            <path
              fillRule="evenodd"
              d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
              clipRule="evenodd"
            />
          </svg>
        ),
      },
      {
        name: 'Linkedin',
        href: 'https://www.linkedin.com/company/clean-takeoff/',
        icon: (props) => (
            <svg viewBox="0 0 24 24" fill="currentColor" width="26px" height="26px"
                 data-ux="IconSocial"
                  className="x-el x-el-svg c1-1 c1-2 c1-8e c1-1i c1-2g c1-3b c1-3c c1-3d c1-3e c1-b c1-c c1-d c1-e c1-f c1-g">
                <g>
                    <path d="M12 2c5.523 0 10 4.476 10 10 0 5.523-4.477 10-10 10-5.522 0-10-4.477-10-10C2 6.478 6.478 2 12 2z" fill="#a0a1a4"></path>
                    <path d="M16.926 6H6.871C6.391 6 6 6.38 6 6.85v10.098c0 .47.39.852.871.852h10.056a.864.864 0 00.873-.852V6.85a.863.863 0 00-.874-.85z" fill="#fff"></path>
                    <path d="M7.75 10.424h1.753v5.63H7.75v-5.63zm.875-2.803a1.015 1.015 0 11-.002 2.03 1.015 1.015 0 01.002-2.03m1.973 2.803h1.678v.77h.024c.233-.443.804-.91 1.66-.91 1.771 0 2.098 1.166 2.098 2.682v3.089H14.31v-2.74c0-.652-.011-1.493-.909-1.493-.91 0-1.05.712-1.05 1.446v2.785H10.6v-5.63h-.002z" fill="#a0a1a4"></path>
                </g>
            </svg>
        ),
      },
      {
        name: 'Yelp',
        href: 'https://www.yelp.com/biz/clean-takeoff-fort-lauderdale',
        icon: (props) => (
            <svg viewBox="0 0 24 24" fill="currentColor" width="26px" height="26px"
                 data-ux="IconSocial"
                  className="x-el x-el-svg c1-1 c1-2 c1-8e c1-1i c1-2g c1-3b c1-3c c1-3d c1-3e c1-b c1-c c1-d c1-e c1-f c1-g">
                <g>
                    <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10A10 10 0 0012 2z" fill="#a0a1a4"></path>
                    <path d="M7.055 13.745a.971.971 0 01-.073-.509l.182-2.072a.688.688 0 01.29-.364c.182-.11.582.036.582.036l2.619 1.31s.4.181.4.508c-.037.437-.219.437-.364.51l-3.055.654s-.436.146-.581-.072zm4.945.473l-.036 3.018s.036.437-.219.51c-.144.02-.291.02-.436 0l-2.036-.655a.6.6 0 01-.291-.364c-.073-.218.182-.545.182-.545l2.036-2.255s.327-.29.582-.145c.254.145.254.436.218.436zm-.364-3.236a.687.687 0 01-.581-.182l-2.51-3.418s-.363-.4-.181-.691a.64.64 0 01.363-.291l2.4-.873c.11-.036.218-.145.582.073.255.145.291.655.291.655l.036 4.145s-.072.51-.4.582zm1.419.582l1.636-2.582s.145-.364.436-.327c.152.002.29.085.364.218l1.382 1.636a.677.677 0 01.072.473c-.072.218-.472.364-.472.364l-2.91.836s-.4.072-.545-.182c-.145-.255 0-.51.037-.436zm3.781 3.309L15.6 16.654a.814.814 0 01-.436.182c-.219 0-.473-.327-.473-.327l-1.564-2.618s-.182-.364.037-.582c.218-.218.472-.109.509-.145l2.909.945s.4.073.4.364a1.936 1.936 0 01-.146.4z" fill="#fff"></path>
                </g>
            </svg>
        ),
      },
    ],
  }

const Footer = () => {
    const location = useLocation()


    return (
      <div className="border-t border-slate-900/5 py-8">
        <img
            className="block h-14 w-auto text-center mx-auto"
            src={logo}
            alt="Livetakeoff logo"
        /> 
        <p className="mt-2 text-center text-sm leading-6 text-slate-500">&#169; 2022 Livetakeoff. All rights reserved.</p>
        <div className="flex space-x-6 justify-center mt-6">
            {navigation.social.map((item) => (
              <a key={item.name} href={item.href} className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">{item.name}</span>
                <item.icon className="h-6 w-6" aria-hidden="true" />
              </a>
            ))}
        </div>
        {!location.pathname.includes('shared') && (
            <div className="mt-6 flex items-center justify-center space-x-4 text-sm font-medium leading-6 text-slate-700">
                <Link to="/privacy-policy">Privacy policy</Link>
                <div className="h-4 w-px bg-slate-500/20"></div>
                <Link to="/changelog">Changelog</Link>
            </div>
        )}
        
      </div>
    )
}

export default Footer;