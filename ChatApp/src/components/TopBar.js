import Accessibility from "@mui/icons-material/Accessibility";
import { AppBar, IconButton, Toolbar, Typography } from "@mui/material";
const TopBar = (props) => {
  const onIconClicked = () => props.viewDialog(); // notify the parent
  return (
    <AppBar position="static">
      <Toolbar color="primary" title="Sample Toolbar">
        <Typography variant="h6" color="inherit">
          Chat App
        </Typography>
        {props.showIcon === true ? (
          <section style={{ height: 90, width: 90, marginLeft: "auto" }}>
            <IconButton onClick={onIconClicked}>
              <Accessibility
                style={{ color: "white", height: 70, width: 70 }}
              />
            </IconButton>
          </section>
        ) : null}
      </Toolbar>
    </AppBar>
  );
};
export default TopBar;
