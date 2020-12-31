import React from "react";
import {
  Drawer as MUIDrawer,
  ListItem,
  List,
  ListItemIcon,
  ListItemText,
  Divider
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import HomeIcon from "@material-ui/icons/Home";
import GroupIcon from "@material-ui/icons/Group";
import FaceIcon from "@material-ui/icons/Face";
import MenuBook from "@material-ui/icons/MenuBook";
import SchoolIcon from '@material-ui/icons/School';
import EmojiObjectsIcon from '@material-ui/icons/EmojiObjects';
import { withRouter } from "react-router-dom";

const useStyles = makeStyles({
  drawer: {
    width: "190px"
  }
});

const Drawer = props => {
  const { history } = props;
  const classes = useStyles();
  const itemsList1 = [
    {
      text: "Accueil",
      icon: <HomeIcon />,
      onClick: () => history.push("/")
    },
    {
      text: "Groupes",
      icon: <GroupIcon />,
      onClick: () => history.push("/groupes")
    },
    {
      text: "Enseignants",
      icon: <FaceIcon />,
      onClick: () => history.push("/enseignants")
    },
    {
      text: "Matières",
      icon: <MenuBook />,
      onClick: () => history.push("/matieres")
    }
    ];
    const studentsGroups = [
    {
      text: "11 BI",
      icon: <SchoolIcon />,
      onClick: () => history.push("/eleves/11BI")
    },
    {
      text: "12 BI",
      icon: <SchoolIcon />,
      onClick: () => history.push("/eleves/12BI")
    }
    ];
    const tests = [
    {
      text: "A20 - Quad 1",
      icon: <EmojiObjectsIcon />,
      onClick: () => history.push("/tests/A20quad1")
    },
    {
      text: "A20 - Quad 1",
      icon: <EmojiObjectsIcon />,
      onClick: () => history.push("/eleves/A20quad2")
    }
    ];
  return (
    <MUIDrawer variant="permanent" className={classes.drawer}>
        <List>
            {itemsList1.map((item, index) => {
            const { text, icon, onClick } = item;
            return (
                <ListItem button key={text} onClick={onClick}>
                {icon && <ListItemIcon>{icon}</ListItemIcon>}
                <ListItemText primary={text} />
                </ListItem>
            );
            })}
        </List>
        <Divider />
        <List>
            {studentsGroups.map((item, index) => {
            const { text, icon, onClick } = item;
            return (
                <ListItem button key={text} onClick={onClick}>
                {icon && <ListItemIcon>{icon}</ListItemIcon>}
                <ListItemText primary={text} />
                </ListItem>
            );
            })}
        </List>
        <Divider />
        <List>
            {tests.map((item, index) => {
            const { text, icon, onClick } = item;
            return (
                <ListItem button key={text} onClick={onClick}>
                {icon && <ListItemIcon>{icon}</ListItemIcon>}
                <ListItemText primary={text} />
                </ListItem>
            );
            })}
        </List>
    </MUIDrawer>
  );
};

export default withRouter(Drawer);
