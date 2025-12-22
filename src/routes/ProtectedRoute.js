import { Navigate } from "react-router-dom";

export default function ProtectedRoute({
    credential,
    trade,
    children,
}) {
    if (!credential) {
        return <Navigate to="/" replace />;
    }

    if (trade.authMessage) {
        return <Navigate to="/" replace />;
    }

    if (!trade.isConnected) {
        return <h3>Connecting to WebSocket...</h3>;
    }

    return children;
}
