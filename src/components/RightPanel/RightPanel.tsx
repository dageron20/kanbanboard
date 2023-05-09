import React, { useState, useEffect, useRef, ReactNode } from 'react';
import clsx from 'clsx';
import './RightPanel.scss';

export interface IRightPanel {
    children: ReactNode,
}

const RightPanel: React.FC<IRightPanel> = ({ children }) => {
    const [widthForm, setWidthForm] = useState(600);
    const [startX, setStartX] = useState(0);

    const shutter = useRef<HTMLDivElement>(null);

    const mouseDownShutterResizingElement = (event: React.MouseEvent) => {
        event.preventDefault();
        setStartX(event.clientX);
        document.addEventListener('mouseup', mouseUpShutterResizingElement);
        document.addEventListener('mousemove', mouseMoveShutterResizingElement);
    };

    const mouseMoveShutterResizingElement = (event: MouseEvent) => {
        const deltaX = startX - event.clientX;
        const changeWidth = widthForm + deltaX;
        event.preventDefault();
        if (changeWidth > 448 && changeWidth < 768) {
            setWidthForm(changeWidth);
            setStartX(event.clientX);
        } else if (changeWidth <= 448) {
            setWidthForm(448);
            setStartX(event.clientX);
        } else if (changeWidth >= 768) {
            setWidthForm(768);
            setStartX(event.clientX);
        }
    };

    const mouseUpShutterResizingElement = () => {
        document.removeEventListener('mouseup', mouseUpShutterResizingElement);
        document.removeEventListener('mousemove', mouseMoveShutterResizingElement);
    };

    useEffect(() => {
        if (shutter?.current) {
            setStartX(shutter.current.getBoundingClientRect().left);
        }
    });

    return (
        <div
            className={clsx('RightPanel')}
            style={{ width: `${widthForm}px`, minWidth: `${widthForm}px` }}
        >
            <div
                ref={shutter}
                role="presentation"
                className="shutter-resizing-element"
                onMouseDown={(event: React.MouseEvent) => {
                    mouseDownShutterResizingElement(event);
                }}
            />
            {children}
        </div>
    );
};

export default RightPanel;
