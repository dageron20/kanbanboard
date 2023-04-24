import styles from "../style.module.scss";
import defaultButton from "../../asset/resourse/defoultButton.png";
import React from "react";

interface ColumHeader {
    title: string;
}

const ColumHeader: React.FC<ColumHeader> = ({title}) => {
    return (
        <div className={`${styles.col_header} ${title.toLowerCase()}`}>
            <div className={styles.col_header_name}>
                <span>{title}</span>
                <span className={styles.col_header_name_countTasks}>3</span>
            </div>
            <div className={styles.col_header_buttons}>
                <img src={defaultButton} alt="" />
                <img src={defaultButton} alt="" />
            </div>
        </div>
    )
}

export {ColumHeader}