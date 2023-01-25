import './resizable.css';
import React from "react";
import {ResizableBox, ResizableBoxProps} from "react-resizable";

interface ResizableProps {
    children?: React.ReactNode;
    direction: "horizontal" | "vertical";
}

const Resizable: React.FC<ResizableProps> = ({children, direction}) => {
    let resizableBoxProps: ResizableBoxProps;

    if (direction === 'horizontal') {
        resizableBoxProps = {
            className: 'resize-horizontal',
            minConstraints: [window.innerWidth * 0.2, Infinity],
            maxConstraints: [window.innerWidth * 0.75, Infinity],
            height: Infinity,
            width: window.innerWidth * 0.75,
            resizeHandles: ['e']
        };
    } else {
        resizableBoxProps = {
            minConstraints: [Infinity, 150],
            maxConstraints: [Infinity, window.innerHeight * 0.9],
            height: 300,
            width: Infinity,
            resizeHandles: ['s']
        };
    }

    return (
        <ResizableBox {...resizableBoxProps}>
            {children}
        </ResizableBox>
    )
}

export default Resizable;
