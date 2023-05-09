import React, { ReactNode } from 'react';
import clsx, { ClassValue } from 'clsx';
import './PanelContent.scss';

export interface IPanelContentLayout {
    children: ReactNode,
    className?: ClassValue,
}

const PanelContentLayout: React.FC<IPanelContentLayout> = ({ children, className }) => (
    <div className={clsx('PanelContentLayout', className)}>
        {children}
    </div>
);

PanelContentLayout.defaultProps = {
    className: null,
};

export default PanelContentLayout;
