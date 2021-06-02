import React, {useEffect, useState} from "react";
import {DataGrid, getThemePaletteMode} from '@material-ui/data-grid';
import makeStyles from "@material-ui/core/styles/makeStyles";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import axios from "axios";

const defaultTheme = createMuiTheme();
const useStyles = makeStyles(
    (theme) => {
        const isDark = getThemePaletteMode(theme.palette) === 'dark';

        return {
            root: {
                '& .MuiDataGrid-cellEditing': {
                    backgroundColor: 'rgb(255,215,115, 0.19)',
                    color: '#1a3e72',
                },
                '& .Mui-error': {
                    backgroundColor: `rgb(126,10,15, ${isDark ? 0 : 0.1})`,
                    color: isDark ? '#ff4343' : '#750f0f',
                },
            },
        };
    },
    { defaultTheme },
);

function StudentsGradesList(props) {
    const [gradesList, setGradesList] = useState([]);
    const [editRowsModel, setEditRowsModel] = React.useState({});
    const classes = useStyles();

    useEffect(() => {
        let mounted = true;
        axios.get("/grades/" + props.testId + "/" + props.groupId).then((response) => {
            if(mounted)
            {
                setGradesList(response.data);
                console.log(gradesList)
                gradesList.map((grade) => {
                    grade['id'] = grade._id
                })
            }
        });
        return () => mounted = false;
    }, []);

    const handleEditCellChange = React.useCallback(
        ({ id, field, props }) => {
            if (field === 'gradePercentage') {
                const data = props; // Fix eslint value is missing in prop-types for JS files
                const isValid = validateGrade(data.value);
                const newState = {};
                newState[id] = {
                    ...editRowsModel[id],
                    gradePercentage: { ...props, error: !isValid },
                };
                setEditRowsModel((state) => ({ ...state, ...newState }));
            }
        },
        [editRowsModel],
    );

    function validateGrade(grade) {
        return grade >= 0 && grade <= 100;
    }

    return (
        <div style={{ height: 400, width: '100%' }}>
            <DataGrid
                className={classes.root}
                rows={gradesList}
                columns={columns}
                editRowsModel={editRowsModel}
                onEditCellChange={handleEditCellChange}
                id={(row) => row._id}
            />
        </div>
  );
}

const columns = [
    {
        field: '_id',
        headerName: "Identifiant de l'élève",
        hide: true,
        width: 200,
        identity: true,
        editable: false,
    },
    {
        field: 'studentName',
        headerName: "Nom de l'élève",
        width: 200,
        editable: false,
    },
    {
        field: 'isPresent',
        headerName: 'Présent',
        type: 'boolean',
        width: 200,
        editable: true
    },
    {
        field: 'gradePercentage',
        headerName: 'Pourcentage',
        type: 'number',
        width: 200,
        editable: true,
    },
    {
        field: 'gradeBI',
        headerName: 'Note du BI',
        type: 'number',
        width: 200,
        editable: false,
    },
];

export default StudentsGradesList;
