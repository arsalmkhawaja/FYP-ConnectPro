/* eslint-disable react/prop-types */
import { MenuItem } from "react-pro-sidebar";
import { Link, useLocation } from "react-router-dom";

const Item = ({ title, path, icon, colors }) => {
  const location = useLocation();
  return (
    <MenuItem
      component={<Link to={path} />}
      to={path}
      icon={icon}
      rootStyles={{
        color:
          path === location.pathname
            ? colors.blueAccent[500]
            : colors.gray[100],
      }}
    >
      {title}
    </MenuItem>
  );
};

export default Item;
