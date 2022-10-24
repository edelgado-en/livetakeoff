import { useEffect, useState } from "react";
import AnimatedPage from "../../components/animatedPage/AnimatedPage";
import { Link, useParams, Outlet, useLocation, useNavigate } from "react-router-dom";
import * as api from './apiService'


const CustomerAddDiscount = () => {
    const navigate = useNavigate();

    const handleCancel = () => {
        navigate(-1)
    }


    return (
        <AnimatedPage>
            <div>Add discount</div>
            <button onClick={() => handleCancel()}>cancel</button>
        </AnimatedPage>
    )

}

export default CustomerAddDiscount;