import React, {useEffect} from 'react';
import { Navigate } from 'react-router-dom';
import { useAppDispatch } from "../redux/hook";
import { useAuthorizeUserQuery } from "../redux/apiSlice";
import { setAuthorizeUser } from "../redux/slice/generalSlice";

interface IProps {
    children: JSX.Element
}

const ProtectedRoute = ({  children }: IProps) => {
    const dispatch = useAppDispatch();
    const [skip, setSkip] = React.useState(true)
    const token = localStorage.getItem('token');
    useEffect(() => {
        setSkip((prev) => !prev)
    }, [token])

    const { data = null, isFetching, error } = useAuthorizeUserQuery(token, {
        skip
    })

    if (data && !isFetching) {
        dispatch(setAuthorizeUser(data.currentUser))
    }


    if (error && 'data' in error && error.status === 401) {
        return <Navigate to="/auth" />
    } else  {
        return children
    }
}

export default ProtectedRoute
