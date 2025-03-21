import React, { useState } from 'react';
import Login from '../components/Login';

export default {
    title: 'Components/Login',
    component: Login,
};

export const Default = () => {
    const [loading, setLoading] = useState(false);

    return (
        <Login
            label="Login"
            variant="primary"
            loading={loading}
        />
    );
};

export const LoadingLogin = () => {
    const [loading, setLoading] = useState(true);

    return (
        <Login
            label="Logging in..."
            variant="primary"
            loading={()=>setLoading(loading)}
        />
    );
};
