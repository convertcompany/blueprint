import type { ToastOptions } from "react-hot-toast";

const toastOptions : ToastOptions = {
    position : "bottom-right",
    className : "border border-slate antialiased",
    style : {
        boxShadow : "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        borderRadius: 12,
        fontSize: 14,
        fontWeight: 600,
        background: "#001122",
        color : "#FFFFFF"
    }
}

const toastContainerStyle : React.CSSProperties = {
    top: 40,
    bottom: 40,
    right: 40,
    left: 40
}


export { toastOptions, toastContainerStyle };
