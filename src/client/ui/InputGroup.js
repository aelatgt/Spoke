import React from "react";
import PropTypes from "prop-types";
import styles from "./InputGroup.scss";

export default function InputGroup({ name, children }) {
  return (
    <div className={styles.inputGroup}>
      <label className={styles.label}>
        <span className={styles.name}>{name}:</span>
        <div className={styles.content}>{children}</div>
      </label>
    </div>
  );
}

InputGroup.propTypes = {
  name: PropTypes.string,
  children: PropTypes.any
};