import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { authRoutes, publicRoutes } from "../routes";
import { MARKET_ROUTE } from "../utils/consts";
import { Context } from "../index";

const AppRouter = observer(({cartOpen}) => { 
    const { user } = useContext(Context);

    return (
        <Routes>
            {user.isAuth && authRoutes.map(({ path, Component }) => (
                <Route key={path} path={path} element={<Component cartOpen={cartOpen} />} />
            ))}

            {publicRoutes.map(({ path, Component }) => (
                <Route key={path} path={path} element={<Component cartOpen={cartOpen} />} />
            ))}

            <Route path="*" element={<Navigate to={MARKET_ROUTE} replace />} />
        </Routes>
    );
});

export default AppRouter;
