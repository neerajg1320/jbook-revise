import './resizable.css';
import React from "react";
import {ResizableBox} from "react-resizable";

interface ResizableProps {
    children?: React.ReactNode;
    direction: "horizontal" | "vertical";
}

const Resizable: React.FC<ResizableProps> = ({children, direction}) => {
    return (
        <ResizableBox
            height={300}
            width={Infinity}
            resizeHandles={['s']}
        >
            {children}
        </ResizableBox>
    )
}

export default Resizable;
