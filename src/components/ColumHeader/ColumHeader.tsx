import styles from "../style.module.scss";
import defaultButton from "../../asset/resourse/defoultButton.png";
import React from "react";
import {ITask} from "../../types/ITask";

interface ColumHeader {
    title: string;
    label: string;
    items: ITask[];
}

const ColumHeader: React.FC<ColumHeader> = ({title, items, label}) => {
    return (
        <div className={`${styles.col_header} ${title.toLowerCase()}`}>
            <div className={styles.col_header_name}>
                <span>{label}</span>
                <span className={styles.col_header_name_countTasks}>{items.length}</span>
            </div>
            <div className={styles.col_header_buttons}>
                <img src={defaultButton} alt="" />
            </div>
        </div>
    )
}

export {ColumHeader}