import * as React from 'react';
import clsx from 'clsx';
import './FooterPanel.scss';

const Footer: React.FC = () => {
    return (
        <header
            className={clsx('Footer')}
        >
            <button
                className={clsx('Button')}
                onClick={() => {
                    // Допишешь обработчик постановки задачи в проекте
                }}
            >
                Поставить задачу
            </button>
        </header>
    );
};

export default Footer;
