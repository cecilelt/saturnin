import React, {useState, useEffect} from "react";
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import GroupInfo from '../components/GroupInfo'

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
});

export default function Groups() {
    const classes = useStyles();
    const [selectedTab, setSelectedTab] = useState(0);
    const [groupNamesList, setGroupNamesList] = useState([]);
    const [groupName, setGroupName] = useState("hello");

    const handleChange = (event, newValue) => {
        console.log(newValue);
        setSelectedTab(newValue);
    };

    // Executed everytime the component is rendered
    useEffect(() => {
        getAllGroups();
    }, []);

    const tabs = groupNamesList.map(tab => {
        return(
             <Tab key= {tab._id} label={tab.groupName}/>
        )
    })

    function getAllGroups() {
        axios.get("/groups").then(response => {
            console.log('h');
            setGroupNamesList(response.data);
        });
    }

    return (
        <Paper className={classes.root}>
        <Tabs
            value={selectedTab}
            onChange={handleChange}
            indicatorColor="primary"
            textColor="primary"
            centered
        >
            {tabs}
        </Tabs>
        { <GroupInfo level = {groupNamesList[selectedTab].level} description = {groupNamesList[selectedTab].description} /> }
        </Paper>
    );
}

