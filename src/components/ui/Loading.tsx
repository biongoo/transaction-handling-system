import styles from './Loading.module.css';

export const Loading = () => (
  <div className={styles['lds-roller']} data-testid="spinner">
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div>
);
