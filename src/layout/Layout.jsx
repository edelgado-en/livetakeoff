
import { Outlet } from 'react-router-dom';

import Topbar from '../components/topbar/Topbar';

const Layout = () => {
    return (
        <>
            <Topbar />
            <div style={{ marginTop: '20px' }}></div>
            <div className="flex">
                <div className="w-full">
                    <div className="mt-3">
                        <Outlet />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Layout;