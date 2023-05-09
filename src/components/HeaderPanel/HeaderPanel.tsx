import * as React from 'react';
import clsx from 'clsx';
import './HeaderPanel.scss';
import close from '../../asset/resourse/closebutton.svg';

export interface IHeader {
    name: string,
}

const HeaderPanel: React.FC<IHeader> = ({ name }) => {
    return (
        <header
            className={clsx('Header')}
        >
            <label
                className={clsx('Label')}
            >
                {name}
            </label>
            <button
                className={clsx('Button')}
            >
                <img src={close} alt="Закрыть меню"/>
            </button>
        </header>
    );
};

export default HeaderPanel;
