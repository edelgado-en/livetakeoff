
import { Outlet } from 'react-router-dom';

import HeaderBar from './HeaderBar';

const SharedLayout = () => {
    return (
        <>
            <HeaderBar />
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

export default SharedLayout;