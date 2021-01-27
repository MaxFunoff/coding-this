import React, { FC } from "react";
import { useRouter } from "next/router";
import styles from "./FilterNav.module.scss";
import { classes } from "../../utils/classLister";

export const FilterNav: FC = () => {
  const router = useRouter();
  const orderBy = router.query.orderby || null;


  const handleNav = (tab: string | null) => {
    if (orderBy !== tab) {
      const _query = { ...router.query };
      if (tab === null) {
        delete _query['orderby'];
      } else {
        _query.orderby = tab;
      }
      router.push({ pathname: "", query: { ..._query } });
    }
  };
  
  return (
    <div className={styles.tabWrapper}>
      <div
        onClick={() => handleNav(null)}
        className={classes(styles.tab, !orderBy && styles.active)}
      >
        Hot
      </div>
      <div
        onClick={() => handleNav("rising")}
        className={classes(styles.tab, orderBy === "rising" && styles.active)}
      >
        Rising
      </div>
      <div
        onClick={() => handleNav("new")}
        className={classes(styles.tab, orderBy === "new" && styles.active)}
      >
        New
      </div>
    </div>
  );
};
